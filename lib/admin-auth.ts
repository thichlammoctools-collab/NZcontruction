import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "ns_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || null;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
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
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD_HASH;
  if (expected && expected.startsWith("sha256:")) {
    const target = expected.slice(7);
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(password));
    const actual = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return timingSafeEqualStr(actual, target);
  }
  const bootstrap = process.env.ADMIN_PASSWORD;
  return !!bootstrap && password === bootstrap;
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) return "";
  const exp = Date.now() + SESSION_TTL_MS;
  const sig = await hmacSha256(String(exp), secret);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;
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
