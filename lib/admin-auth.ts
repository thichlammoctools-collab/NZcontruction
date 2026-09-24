import { NextRequest } from "next/server";
import crypto from "crypto";

export const ADMIN_COOKIE = "ns_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || null;
}

function hash(value: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

// Constant-time comparison of a candidate password against the configured
// ADMIN_PASSWORD_HASH (format: "sha256:<hex>"). Falls back to a single
// bootstrap password from env so the panel is usable before a hash exists.
function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD_HASH;
  if (expected && expected.startsWith("sha256:")) {
    const target = expected.slice(7);
    const actual = crypto.createHash("sha256").update(password).digest("hex");
    const a = Buffer.from(actual, "hex");
    const b = Buffer.from(target, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  const bootstrap = process.env.ADMIN_PASSWORD;
  return !!bootstrap && password === bootstrap;
}

export function createSessionToken(): string {
  const secret = getSecret();
  if (!secret) return "";
  const exp = Date.now() + SESSION_TTL_MS;
  return `${exp}.${hash(String(exp), secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = hash(expStr, secret);
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function isAdminRequest(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export function unauthorized(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
