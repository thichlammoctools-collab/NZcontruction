import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
  writeJsonAtomic,
  readJsonSafe,
  sanitizeString,
  isValidEmail,
  normalizePhone,
} from "@/lib/json-store";
import { r2PutObject } from "@/lib/cloud-storage";

export const dynamic = "force-dynamic";

const leadsFilePath = path.join(process.cwd(), "content", "quote_leads.json");

interface QuoteLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  details: string;
  files?: string[];
  createdAt: string;
}

const MAX_FIELD = 2000;

export async function POST(req: Request) {
  try {
    // Per-IP throttle: max 5 quote submissions / 10 minutes.
    const ip = clientIp(req);
    const rl = rateLimit(`quote:${ip}`, 5, 10 * 60 * 1000);
    if (rl.remaining <= 0) {
      return NextResponse.json(
        { success: false, message: "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec || 600) } }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let phone = "";
    let service = "";
    let location = "";
    let details = "";
    const savedFiles: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = sanitizeString(formData.get("name")?.toString(), 200);
      email = sanitizeString(formData.get("email")?.toString(), 200);
      phone = normalizePhone(formData.get("phone")?.toString() || "").slice(0, 20);
      service = sanitizeString(formData.get("service")?.toString(), 200);
      location = sanitizeString(
        formData.get("location")?.toString() || formData.get("address")?.toString(),
        200
      );
      details = sanitizeString(formData.get("details")?.toString(), 2000);

      const fileEntries = formData.getAll("files");
      if (fileEntries.length > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "quotes");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (const entry of fileEntries.slice(0, 10)) {
          if (entry instanceof File && entry.size > 0 && entry.size <= 15 * 1024 * 1024) {
            const origName = entry.name || "file";
            const ext = path.extname(origName).toLowerCase();
            if (/\.(jpe?g|png|webp|gif|avif|pdf)$/i.test(ext)) {
              const base = path
                .basename(origName, ext)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .slice(0, 40);
              const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
              const finalName = `${base || "quote"}-${unique}${ext}`;
              const r2Key = `quotes/${finalName}`;
              const buf = Buffer.from(await entry.arrayBuffer());
              
              // 1. Upload to Cloudflare R2
              await r2PutObject(r2Key, buf, entry.type || "application/octet-stream");

              // 2. Also write to local disk if fs is available
              try {
                const uploadDir = path.join(process.cwd(), "public", "uploads", "quotes");
                if (!fs.existsSync(uploadDir)) {
                  fs.mkdirSync(uploadDir, { recursive: true });
                }
                const dest = path.join(uploadDir, finalName);
                fs.writeFileSync(dest, buf);
              } catch {}

              savedFiles.push(`/uploads/${r2Key}`);
            }
          }
        }
      }
    } else {
      const body = await req.json();
      name = sanitizeString(body?.name, 200);
      email = sanitizeString(body?.email, 200);
      phone = normalizePhone(body?.phone || "").slice(0, 20);
      service = sanitizeString(body?.service, 200);
      location = sanitizeString(body?.location || body?.address, 200);
      details = sanitizeString(body?.details, 2000);
      if (Array.isArray(body?.files)) {
        for (const f of body.files) {
          if (typeof f === "string" && f.trim().length > 0) {
            savedFiles.push(f.slice(0, 300));
          }
        }
      }
    }

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập tên và số điện thoại hoặc email." },
        { status: 400 }
      );
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Địa chỉ email không hợp lệ." },
        { status: 400 }
      );
    }

    if (phone && phone.replace(/\D/g, "").length < 6) {
      return NextResponse.json(
        { success: false, message: "Số điện thoại không hợp lệ." },
        { status: 400 }
      );
    }

    const lead: QuoteLead = {
      id: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      phone,
      email,
      service,
      location,
      details,
      files: savedFiles,
      createdAt: new Date().toISOString(),
    };

    if (!lead.name || (!lead.phone && !lead.email)) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập tên và số điện thoại hoặc email." },
        { status: 400 }
      );
    }

    const leads = await readJsonSafe<QuoteLead[]>(leadsFilePath, []);
    leads.unshift(lead);
    await writeJsonAtomic(leadsFilePath, leads.slice(0, 500));

    return NextResponse.json({
      success: true,
      message: "Quote request successfully registered.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing quote request." },
      { status: 500 }
    );
  }
}
