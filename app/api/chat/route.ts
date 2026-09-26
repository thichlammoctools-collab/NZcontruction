import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const aiConfigFilePath = path.join(process.cwd(), "content", "ai_config.json");

async function readConfig() {
  return await readJsonSafe<any>(aiConfigFilePath, null);
}

async function saveConfig(data: any) {
  try {
    await writeJsonAtomic(aiConfigFilePath, data);
  } catch (err) {
    console.error("Error saving ai_config.json:", err);
  }
}

// Call Google Gemini REST API if key is present
async function callGemini(apiKey: string, modelName: string, systemPrompt: string, userMessage: string, knowledgeText: string) {
  const model = modelName || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const prompt = `System Instructions:\n${systemPrompt}\n\nCompany Knowledge Base & Context:\n${knowledgeText}\n\nClient inquiry: ${userMessage.slice(0, 2000)}\n\nRespond as NS Building AI Assistant:`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 600,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error status: ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim();
}

export async function POST(req: Request) {
  try {
    // Per-IP throttle: max 20 messages / minute to bound LLM cost and abuse.
    const ip = clientIp(req);
    const rl = rateLimit(`chat:${ip}`, 20, 60 * 1000);
    if (rl.remaining <= 0) {
      return NextResponse.json(
        {
          reply: req.headers.get("accept-language")?.includes("vi")
            ? "Bạn đã gửi quá nhiều tin nhắn trong thời gian ngắn. Vui lòng chờ một lát rồi thử lại, hoặc gọi hotline 027 666 6510 để được hỗ trợ ngay ạ."
            : "You have sent too many messages in a short period. Please wait a moment before trying again, or call us on 027 666 6510.",
          leadCaptured: false,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec || 60) } }
      );
    }

    const { message, locale } = await req.json();
    const rawText = typeof message === "string" ? message.slice(0, 4000) : "";
    const text = rawText.toLowerCase();
    const isVi = locale === "vi";

    const config = await readConfig();

    // Check if chatbot is disabled
    if (config?.general?.enabled === false) {
      return NextResponse.json({
        reply: isVi
          ? "Trợ lý AI hiện đang tạm bảo trì để cập nhật dữ liệu. Quý khách vui lòng gọi trực tiếp hotline 027 666 6510 để được tư vấn ngay ạ!"
          : "Our AI Assistant is currently undergoing scheduled updates. Please call our direct line on 027 666 6510 for immediate assistance.",
        leadCaptured: false,
      });
    }

    let leadCaptured = false;

    // Contact info detection (NZ phone numbers like 02x, 09x, +64, or emails)
    const phoneMatch = text.replace(/[\s-]/g, "").match(/(^|\D)(02\d{7,9}|09\d{8}|\+64\d{8,10})(\D|$)/);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    let reply = "";

    // 1. Lead captured event
    if (phoneMatch || emailMatch) {
      leadCaptured = true;
      const contactVal = phoneMatch ? phoneMatch[2] : emailMatch![0];
      const contactType = phoneMatch ? "phone" : "email";

      // Save lead into ai_config.json
      if (config) {
        const leads = config.capturedLeads || [];
        const newLead = {
          id: `lead-${Date.now()}`,
          contact: contactVal,
          type: contactType,
          customerName: "Khách qua Website Chat",
          suburb: "Auckland",
          message: rawText,
          createdAt: new Date().toISOString(),
          status: "new",
          notes: `Tự động ghi nhận lúc ${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`,
        };
        config.capturedLeads = [newLead, ...leads];
        await saveConfig(config);
      }

      const customSuccess = isVi ? config?.leadCapture?.leadSuccess_vi : config?.leadCapture?.leadSuccess_en;
      reply = customSuccess || (isVi
        ? "Dạ em đã ghi nhận thông tin liên hệ của Anh/Chị! Kỹ sư Nguyễn Sơn (LBP #BP128842) và đội ngũ kỹ thuật NS Building sẽ liên hệ lại trực tiếp qua số điện thoại này trong thời gian sớm nhất để hẹn lịch khảo sát hiện trạng và gửi báo giá chi tiết ạ."
        : "Thank you! I have recorded your contact details. Director Nguyen Son (LBP #BP128842) and our team will be in touch shortly to discuss your project scope and arrange a site inspection.");

      return NextResponse.json({ reply, leadCaptured: true });
    }

    // 2. Try Gemini API if key is present (server env only — never from CMS config)
    const apiKey = process.env.GEMINI_API_KEY;
    const provider = config?.general?.provider;

    if (provider === "gemini" && apiKey) {
      try {
        const systemPrompt = isVi ? config?.persona?.systemPrompt_vi : config?.persona?.systemPrompt_en;
        const knowledgeText = JSON.stringify({
          pricingGuide: config?.knowledgeBase?.pricingGuide,
          councilCompliance: config?.knowledgeBase?.councilAndCompliance,
          trainingFaqs: (config?.trainingFaqs || []).filter((f: any) => f.enabled !== false),
        });

        const geminiReply = await callGemini(
          apiKey,
          config?.general?.model,
          systemPrompt || "",
          rawText,
          knowledgeText
        );

        if (geminiReply) {
          return NextResponse.json({ reply: geminiReply, leadCaptured: false });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local knowledge engine:", geminiError);
      }
    }

    // 3. Expert Local Knowledge Engine (Rule-based & Few-shot FAQs)
    const faqs = (config?.trainingFaqs || []).filter((f: any) => f.enabled !== false);
    for (const faq of faqs) {
      const matchKeywords = (faq.keywords || []).some((kw: string) => text.includes(kw.toLowerCase()));
      const matchQuestion = isVi
        ? faq.question_vi.toLowerCase().includes(text) || text.includes(faq.question_vi.toLowerCase().slice(0, 12))
        : faq.question_en.toLowerCase().includes(text) || text.includes(faq.question_en.toLowerCase().slice(0, 12));

      if (matchKeywords || matchQuestion) {
        reply = isVi ? faq.answer_vi : faq.answer_en;
        return NextResponse.json({ reply, leadCaptured: false });
      }
    }

    // 4. Knowledge Base pricing & general answers
    const pricing = config?.knowledgeBase?.pricingGuide || [];
    let foundCategory = null;

    if (text.includes("giá") || text.includes("chi phí") || text.includes("cost") || text.includes("quote") || text.includes("price") || text.includes("rate")) {
      reply = isVi
        ? "Chi phí sửa chữa nhà tại New Zealand phụ thuộc vào diện tích và vật liệu hoàn thiện (ví dụ: phòng tắm trọn gói từ 15k-35k NZD, làm sàn gỗ từ 80-160 NZD/m2, tủ bếp từ 12k-30k NZD). Anh/Chị có thể để lại Số Điện Thoại hoặc Suburb tại Auckland để anh Sơn gọi tư vấn và lên dự toán chi tiết miễn phí nhé!"
        : "Renovation costs in Auckland vary based on scope, council consent requirements, and material finishes (e.g. bathroom upgrades typically range from $15k–$35k NZD, timber flooring $80–$160/m2). Please share your phone number or suburb, and Nguyen Son will provide a free, accurate estimate.";
    } else if (text.includes("phòng tắm") || text.includes("toilet") || text.includes("bathroom") || text.includes("bath")) {
      foundCategory = pricing.find((p: any) => p.category.toLowerCase().includes("phòng tắm"));
      reply = isVi
        ? `NS Building chuyên cải tạo phòng tắm cao cấp tại Auckland (${foundCategory?.rangeNZD || "$15,000 - $35,000+ NZD"}). Thi công chống thấm chuẩn quy chuẩn New Zealand E3/AS1, ốp lát gạch đá tỉ mỉ, lắp bồn tắm đá và tủ lavabo nổi. Anh/Chị cho em xin số điện thoại hoặc Suburb để anh Sơn liên hệ tư vấn nhé!`
        : `We specialize in luxury bathroom renovations across Auckland (${foundCategory?.rangeNZD || "$15,000 - $35,000+ NZD"}). Certified council-approved waterproofing, precision tiling, freestanding stone baths, and custom vanities. Would you like us to arrange a free site consultation? Please share your phone number.`;
    } else if (text.includes("sàn") || text.includes("floor") || text.includes("flooring") || text.includes("timber")) {
      foundCategory = pricing.find((p: any) => p.category.toLowerCase().includes("sàn"));
      reply = isVi
        ? `Bên em có đầy đủ các giải pháp sàn: phục hồi sàn gỗ tự nhiên Kauri/Rimu, lát sàn gỗ sồi kỹ thuật (engineered oak từ ${foundCategory?.rangeNZD || "$80 - $160 NZD/m2"}), gạch men và vinyl chống nước. Anh/Chị đang dự định làm diện tích khoảng bao nhiêu mét vuông ạ?`
        : `We supply and install engineered oak herringbone, solid native timber restoration, and stone tiles (${foundCategory?.rangeNZD || "$80 - $160 NZD/m2"}). What approximate square meterage are you looking to cover?`;
    } else if (text.includes("tủ") || text.includes("bếp") || text.includes("cabinet") || text.includes("kitchen") || text.includes("joinery")) {
      reply = isVi
        ? "NS Building thiết kế và đóng tủ bếp, tủ áo âm tường theo yêu cầu chuẩn xác từng milimét với phụ kiện ray trượt Blum cao cấp của Áo. Anh/Chị vui lòng để lại số điện thoại hoặc địa chỉ công trình để bên em gửi mẫu thiết kế tham khảo nhé!"
        : "We design and craft bespoke architectural kitchen cabinetry and walk-in wardrobes with soft-close Blum hardware and stone benchtops. Please leave your contact number so we can share our portfolio.";
    } else if (text.includes("địa chỉ") || text.includes("ở đâu") || text.includes("where") || text.includes("location") || text.includes("auckland")) {
      reply = isVi
        ? "NS Building hoạt động trên toàn bộ khu vực Auckland (North Shore, Central Auckland, Remuera, Epsom, Albany, Takapuna, Manukau...) và các khu vực lân cận New Zealand. Hotline: 027 666 6510 & 021 153 1510."
        : "We operate across Greater Auckland (Remuera, Epsom, North Shore, Takapuna, Albany, Central) and surrounding New Zealand regions. Office: 027 666 6510 | Mobile: 021 153 1510.";
    } else {
      reply = isVi
        ? "Dạ vâng! Để được hỗ trợ nhanh nhất theo quy chuẩn xây dựng New Zealand và nhận dự toán chính xác, Anh/Chị có thể để lại Số Điện Thoại hoặc gọi trực tiếp Kỹ sư Nguyễn Sơn (LBP #BP128842) qua hotline 027 666 6510 nhé!"
        : "Thank you for reaching out! To get tailored advice and an accurate estimate from a Licensed Building Practitioner, feel free to leave your contact number or call our team directly on 027 666 6510.";
    }

    return NextResponse.json({ reply, leadCaptured });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: "Thank you for contacting NS Building (LBP #BP128842). Please call 027 666 6510 for direct assistance.",
      leadCaptured: false,
    });
  }
}
