import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Public health endpoint (no auth) for uptime monitors (e.g. Uptime Robot).
export const dynamic = "force-dynamic";

export async function GET() {
  // Surface basic disk / content availability without exposing secrets.
  const contentDir = path.join(process.cwd(), "content");
  const contentOk = fs.existsSync(contentDir);

  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    contentStore: contentOk ? "available" : "missing",
  });
}
