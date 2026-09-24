import { NextResponse } from "next/server";
import path from "path";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

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
  createdAt: string;
}

const MAX_FIELD = 2000;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD) : "";
}

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

    const body = await req.json();
    const lead: QuoteLead = {
      id: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: str(body?.name),
      phone: str(body?.phone),
      email: str(body?.email),
      service: str(body?.service),
      location: str(body?.location),
      details: str(body?.details),
      createdAt: new Date().toISOString(),
    };

    if (!lead.name || (!lead.phone && !lead.email)) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập tên và số điện thoại hoặc email." },
        { status: 400 }
      );
    }

    const leads = readJsonSafe<QuoteLead[]>(leadsFilePath, []);
    leads.unshift(lead);
    writeJsonAtomic(leadsFilePath, leads.slice(0, 500));

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
