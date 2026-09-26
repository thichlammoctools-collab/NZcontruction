import { NextRequest } from "next/server";
import { getCloudContext, getKV } from "@/lib/cloud-storage";

export const ADMIN_COOKIE = "ns_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

async function getSecret(): Promise<string> {
  try {
    const kv = await getKV();
    const secret = await kv?.get("ADMIN_SESSION_SECRET");
    if (typeof secret === "string" && secret.trim()) return secret.trim();
  } catch {
    // Fall through to process environment.
  }

  try {
    const env = await getCloudContext();
    if (typeof env?.ADMIN_SESSION_SECRET === "string" && env.ADMIN_SESSION_SECRET.trim()) {
      return env.ADMIN_SESSION_SECRET.trim();
    }
  } catch {
    // Fall through to the Node.js environment.
  }
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

async function hmacSha256(value: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const secret = await getSecret();
  if (!secret) return "";
  const exp = Date.now() + SESSION_TTL_MS;
  const sig = await hmacSha256(String(exp), secret);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = await getSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  const [expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await hmacSha256(expStr, secret);
  return timingSafeEqualStr(sig, expected);
}

export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export function unauthorized(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
