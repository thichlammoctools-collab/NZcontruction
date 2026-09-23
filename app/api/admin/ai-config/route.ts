import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const aiConfigFilePath = path.join(process.cwd(), "content", "ai_config.json");

function readConfig() {
  try {
    if (!fs.existsSync(aiConfigFilePath)) return null;
    const raw = fs.readFileSync(aiConfigFilePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading ai_config.json:", err);
    return null;
  }
}

function writeConfig(data: any) {
  fs.writeFileSync(aiConfigFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
    const config = readConfig();
    if (!config) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
    }

    const faqs = config.trainingFaqs || [];
    const leads = config.capturedLeads || [];

    const stats = {
      totalFaqs: faqs.length,
      activeFaqs: faqs.filter((f: any) => f.enabled !== false).length,
      totalLeads: leads.length,
      newLeads: leads.filter((l: any) => l.status === "new").length,
      activeModel: config.general?.model || "gemini-1.5-flash",
      provider: config.general?.provider || "gemini",
      isEnabled: config.general?.enabled !== false,
    };

    return NextResponse.json({ config, stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI configuration" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const current = readConfig() || {};

    const updated = {
      ...current,
      ...(body.general ? { general: { ...current.general, ...body.general } } : {}),
      ...(body.persona ? { persona: { ...current.persona, ...body.persona } } : {}),
      ...(body.knowledgeBase ? { knowledgeBase: { ...current.knowledgeBase, ...body.knowledgeBase } } : {}),
      ...(body.trainingFaqs ? { trainingFaqs: body.trainingFaqs } : {}),
      ...(body.leadCapture ? { leadCapture: { ...current.leadCapture, ...body.leadCapture } } : {}),
      ...(body.capturedLeads ? { capturedLeads: body.capturedLeads } : {}),
    };

    writeConfig(updated);

    return NextResponse.json({
      success: true,
      message: "Đã lưu thành công cấu hình và dữ liệu huấn luyện AI!",
      config: updated,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update AI configuration" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const config = readConfig() || {};

    // 1. Interactive sandbox test
    if (action === "test_chat") {
      const { message, locale = "vi" } = body;
      const text = (message || "").toLowerCase();
      const isVi = locale === "vi";

      // Check contact info detection
      const hasPhone = /\b(02\d{7,9}|09\d{8}|\+64\d{8,10}|\d{8,11})\b/.test(text.replace(/[\s-]/g, ""));
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);

      let matchedFaq = null;
      let reply = "";
      let source = "knowledge_engine";

      if (hasPhone || hasEmail) {
        reply = isVi
          ? config.leadCapture?.leadSuccess_vi || "Dạ em đã ghi nhận số liên hệ của Anh/Chị! Kỹ sư Nguyễn Sơn sẽ liên hệ trực tiếp sớm nhất ạ."
          : config.leadCapture?.leadSuccess_en || "Thank you! I have saved your contact details. Nguyen Son will call you shortly.";
        source = "lead_capture_trigger";
      } else {
        // Search in trainingFaqs
        const faqs = (config.trainingFaqs || []).filter((f: any) => f.enabled !== false);
        for (const faq of faqs) {
          const matchKeywords = (faq.keywords || []).some((kw: string) => text.includes(kw.toLowerCase()));
          const matchQuestion = isVi
            ? faq.question_vi.toLowerCase().includes(text) || text.includes(faq.question_vi.toLowerCase().slice(0, 15))
            : faq.question_en.toLowerCase().includes(text) || text.includes(faq.question_en.toLowerCase().slice(0, 15));

          if (matchKeywords || matchQuestion) {
            matchedFaq = faq;
            reply = isVi ? faq.answer_vi : faq.answer_en;
            source = "faq_rule_match";
            break;
          }
        }

        // If no direct FAQ matched, synthesize response from pricing guide & knowledge base
        if (!reply) {
          const pricing = config.knowledgeBase?.pricingGuide || [];
          let foundCategory = null;

          if (text.includes("giá") || text.includes("chi phí") || text.includes("cost") || text.includes("quote") || text.includes("price")) {
            foundCategory = pricing[0];
          } else if (text.includes("phòng tắm") || text.includes("bathroom") || text.includes("toilet")) {
            foundCategory = pricing.find((p: any) => p.category.toLowerCase().includes("phòng tắm"));
          } else if (text.includes("sàn") || text.includes("floor") || text.includes("timber")) {
            foundCategory = pricing.find((p: any) => p.category.toLowerCase().includes("sàn"));
          } else if (text.includes("tủ") || text.includes("bếp") || text.includes("kitchen")) {
            foundCategory = pricing.find((p: any) => p.category.toLowerCase().includes("tủ bếp"));
          } else if (text.includes("sơn") || text.includes("paint")) {
            foundCategory = pricing.find((p: any) => p.category.toLowerCase().includes("sơn"));
          }

          if (foundCategory) {
            source = "pricing_knowledge_synthesis";
            reply = isVi
              ? `Chi phí tham khảo cho ${foundCategory.category} tại Auckland thường ở mức ${foundCategory.rangeNZD}. ${foundCategory.description}\n\n${config.leadCapture?.leadTriggerPrompt_vi || "Anh/Chị có thể để lại số điện thoại để anh Nguyễn Sơn (LBP #BP128842) liên hệ tư vấn và khảo sát miễn phí nhé!"}`
              : `Reference cost for ${foundCategory.category} in Auckland is typically ${foundCategory.rangeNZD}. ${foundCategory.description}\n\n${config.leadCapture?.leadTriggerPrompt_en || "Please leave your contact number so Nguyen Son can schedule a free site consultation!"}`;
          } else {
            source = "default_fallback";
            reply = isVi
              ? `Dạ vâng! Để được hỗ trợ chuyên sâu theo quy chuẩn xây dựng New Zealand và nhận bảng dự toán chi tiết, Anh/Chị có thể để lại Số Điện Thoại hoặc gọi trực tiếp Kỹ sư Nguyễn Sơn (LBP #BP128842) qua hotline 027 666 6510 nhé!`
              : `Thank you for reaching out! For detailed advice adhering to NZ Building Code standards, feel free to leave your phone number or call Director Nguyen Son directly on 027 666 6510.`;
          }
        }
      }

      return NextResponse.json({
        reply,
        source,
        matchedFaqId: matchedFaq?.id || null,
        leadDetected: hasPhone || hasEmail,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    // 2. Update lead status
    if (action === "update_lead_status") {
      const { leadId, status, notes } = body;
      const leads = config.capturedLeads || [];
      const index = leads.findIndex((l: any) => l.id === leadId);
      if (index === -1) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      if (status) leads[index].status = status;
      if (notes !== undefined) leads[index].notes = notes;

      config.capturedLeads = leads;
      writeConfig(config);

      return NextResponse.json({ success: true, lead: leads[index] });
    }

    // 3. Delete a lead
    if (action === "delete_lead") {
      const { leadId } = body;
      config.capturedLeads = (config.capturedLeads || []).filter((l: any) => l.id !== leadId);
      writeConfig(config);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
