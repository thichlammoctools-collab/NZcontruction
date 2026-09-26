import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "ns_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Default fallback password hash: "nsbuilding2026"
export const DEFAULT_PASSWORD_HASH =
  "sha256:c47fe4eedd6b66a6747460b21a7df3269e5da9ef449a42b48cec4bd916ccea7a";
const DEFAULT_SESSION_SECRET =
  "dev-only-change-me-0f3a9c71b2e84d5fa6c1d90e7b2583ac";

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD_HASH ||
    DEFAULT_SESSION_SECRET
  );
}

function timingSafeEqualStr(a: string, b: string): boolean {
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
  const secret = getSecret();
  if (!secret) return "";
  const exp = Date.now() + SESSION_TTL_MS;
  const sig = await hmacSha256(String(exp), secret);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const [expStr, sig] = token.split(".");
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
