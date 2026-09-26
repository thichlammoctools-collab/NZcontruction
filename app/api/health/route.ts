import { NextResponse } from "next/server";
import { getKV } from "@/lib/cloud-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const kv = await getKV();

  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    storage: kv ? "cloudflare_kv" : "bundled_fallback",
  });
}
