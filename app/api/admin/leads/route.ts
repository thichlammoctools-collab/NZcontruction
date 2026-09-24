import { NextResponse } from "next/server";
import path from "path";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const quoteLeadsFilePath = path.join(process.cwd(), "content", "quote_leads.json");
const aiConfigFilePath = path.join(process.cwd(), "content", "ai_config.json");

// Reusable status vocabulary shared with the admin UI.
const LEAD_STATUSES = [
  "new",
  "contacted",
  "site_visit",
  "quoted",
  "won",
  "lost",
] as const;

type LeadStatus = (typeof LEAD_STATUSES)[number];

function readQuoteLeads() {
  return readJsonSafe<any[]>(quoteLeadsFilePath, []);
}
function readChatLeads() {
  const config = readJsonSafe<any>(aiConfigFilePath, {});
  return Array.isArray(config.capturedLeads) ? config.capturedLeads : [];
}

function buildStats(quoteLeads: any[], chatLeads: any[]) {
  const all = [...quoteLeads, ...chatLeads];
  const byStatus: Record<string, number> = {};
  for (const l of all) {
    const s = l.status || "new";
    byStatus[s] = (byStatus[s] || 0) + 1;
  }
  // Leads created in the last 7 days
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = all.filter((l) => {
    const t = l.createdAt ? new Date(l.createdAt).getTime() : 0;
    return t >= weekAgo;
  }).length;

  return {
    total: all.length,
    new: (byStatus.new || 0),
    recent7d: recent,
    byStatus,
  };
}

export async function GET() {
  try {
    const quoteLeads = readQuoteLeads().map((l: any) => ({ ...l, source: "quote" }));
    const chatLeads = readChatLeads().map((l: any) => ({ ...l, source: "chat" }));
    const stats = buildStats(quoteLeads, chatLeads);

    return NextResponse.json({ quoteLeads, chatLeads, stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { source, id, status, notes } = body;

    if (source !== "quote" && source !== "chat") {
      return NextResponse.json({ error: "Invalid lead source" }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: "Lead id is required" }, { status: 400 });
    }
    if (status && !LEAD_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid lead status" }, { status: 400 });
    }

    if (source === "quote") {
      const leads = readQuoteLeads();
      const idx = leads.findIndex((l) => l.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Quote lead not found" }, { status: 404 });
      }
      if (status) leads[idx].status = status;
      if (notes !== undefined) leads[idx].notes = String(notes).slice(0, 2000);
      leads[idx].updatedAt = new Date().toISOString();
      writeJsonAtomic(quoteLeadsFilePath, leads);
      return NextResponse.json({ success: true, lead: { ...leads[idx], source: "quote" } });
    }

    // source === "chat"
    const config = readJsonSafe<any>(aiConfigFilePath, {});
    const leads = Array.isArray(config.capturedLeads) ? config.capturedLeads : [];
    const idx = leads.findIndex((l: any) => l.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Chat lead not found" }, { status: 404 });
    }
    if (status) leads[idx].status = status;
    if (notes !== undefined) leads[idx].notes = String(notes).slice(0, 2000);
    leads[idx].updatedAt = new Date().toISOString();
    config.capturedLeads = leads;
    writeJsonAtomic(aiConfigFilePath, config);
    return NextResponse.json({ success: true, lead: { ...leads[idx], source: "chat" } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { source, id } = await req.json();
    if (source !== "quote" && source !== "chat") {
      return NextResponse.json({ error: "Invalid lead source" }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: "Lead id is required" }, { status: 400 });
    }

    if (source === "quote") {
      const leads = readQuoteLeads();
      const filtered = leads.filter((l) => l.id !== id);
      if (filtered.length === leads.length) {
        return NextResponse.json({ error: "Quote lead not found" }, { status: 404 });
      }
      writeJsonAtomic(quoteLeadsFilePath, filtered);
      return NextResponse.json({ success: true, deletedId: id });
    }

    const config = readJsonSafe<any>(aiConfigFilePath, {});
    const leads = Array.isArray(config.capturedLeads) ? config.capturedLeads : [];
    const filtered = leads.filter((l: any) => l.id !== id);
    if (filtered.length === leads.length) {
      return NextResponse.json({ error: "Chat lead not found" }, { status: 404 });
    }
    config.capturedLeads = filtered;
    writeJsonAtomic(aiConfigFilePath, config);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
