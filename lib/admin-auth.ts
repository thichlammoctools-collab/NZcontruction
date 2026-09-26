import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "ns_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Default fallback password hash: "nsbuilding2026"
export const DEFAULT_PASSWORD_HASH =
  "sha256:c47fe4eedd6b66a6747460b21a7df3269e5da9ef449a42b48cec4bd916ccea7a";
const DEFAULT_SESSION_SECRET =
  "dev-only-change-me-0f3a9c71b2e84d5fa6c1d90e7b2583ac";

interface ResolvedAuthConfig {
  plainPasswords: string[];
  passwordHashes: string[];
  sessionSecret: string;
}

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD_HASH ||
    DEFAULT_SESSION_SECRET
  );
}

/**
 * Lấy cấu hình xác thực từ nhiều nguồn theo thứ tự ưu tiên:
 * 1. Cloudflare KV (key: ADMIN_PASSWORD, ADMIN_PASSWORD_HASH)
 * 2. Cloudflare Worker context / Secrets (ctx.env.ADMIN_PASSWORD, ctx.env.ADMIN_PASSWORD_HASH)
 * 3. process.env (ADMIN_PASSWORD, ADMIN_PASSWORD_HASH)
 * 4. Fallback mặc định (nsbuilding2026)
 */
async function resolveAuthConfig(): Promise<ResolvedAuthConfig> {
  const plainPasswords: string[] = [];
  const passwordHashes: string[] = [];
  let sessionSecret = getSecret();

  // 1. Kiểm tra Cloudflare Worker env (ctx.env từ Cloudflare Dashboard Secrets/Variables)
  try {
    const { getCloudContext, getKV } = await import("@/lib/cloud-storage");
    const cloudEnv = await getCloudContext();
    if (cloudEnv) {
      if (typeof cloudEnv.ADMIN_PASSWORD === "string" && cloudEnv.ADMIN_PASSWORD.trim()) {
        plainPasswords.push(cloudEnv.ADMIN_PASSWORD.trim());
      }
      if (typeof cloudEnv.ADMIN_PASSWORD_HASH === "string" && cloudEnv.ADMIN_PASSWORD_HASH.trim()) {
        passwordHashes.push(cloudEnv.ADMIN_PASSWORD_HASH.trim());
      }
      if (typeof cloudEnv.ADMIN_SESSION_SECRET === "string" && cloudEnv.ADMIN_SESSION_SECRET.trim()) {
        sessionSecret = cloudEnv.ADMIN_SESSION_SECRET.trim();
      }
    }

    const kv = await getKV();
    if (kv) {
      const [kvPlain1, kvPlain2, kvHash1, kvHash2, kvSecret] = await Promise.all([
        kv.get("ADMIN_PASSWORD"),
        kv.get("admin_password"),
        kv.get("ADMIN_PASSWORD_HASH"),
        kv.get("admin_password_hash"),
        kv.get("ADMIN_SESSION_SECRET"),
      ]);

      if (kvPlain1) plainPasswords.push(String(kvPlain1).trim());
      if (kvPlain2 && kvPlain2 !== kvPlain1) plainPasswords.push(String(kvPlain2).trim());
      if (kvHash1) passwordHashes.push(String(kvHash1).trim());
      if (kvHash2 && kvHash2 !== kvHash1) passwordHashes.push(String(kvHash2).trim());
      if (kvSecret && !sessionSecret) sessionSecret = String(kvSecret).trim();
    }
  } catch {
    // Bỏ qua nếu không chạy trên Cloudflare hoặc lỗi KV
  }

  // 3. Kiểm tra biến môi trường process.env (Node.js / .env.local)
  if (process.env.ADMIN_PASSWORD?.trim()) {
    plainPasswords.push(process.env.ADMIN_PASSWORD.trim());
  }
  if (process.env.ADMIN_PASSWORD_HASH?.trim()) {
    passwordHashes.push(process.env.ADMIN_PASSWORD_HASH.trim());
  }
  if (!sessionSecret && process.env.ADMIN_SESSION_SECRET?.trim()) {
    sessionSecret = process.env.ADMIN_SESSION_SECRET.trim();
  }

  // 4. Nếu chưa có cấu hình tùy chỉnh nào, dùng fallback mặc định
  if (passwordHashes.length === 0 && plainPasswords.length === 0) {
    passwordHashes.push(DEFAULT_PASSWORD_HASH);
  }
  if (!sessionSecret) {
    sessionSecret = passwordHashes[0] || DEFAULT_SESSION_SECRET;
  }

  return { plainPasswords, passwordHashes, sessionSecret };
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
  if (!password) return false;

  const { plainPasswords, passwordHashes } = await resolveAuthConfig();

  // 1. So khớp mật khẩu text thường (khi cấu hình ADMIN_PASSWORD trên Cloudflare / KV / env)
  for (const plain of plainPasswords) {
    if (timingSafeEqualStr(password, plain)) {
      return true;
    }
  }

  // 2. So khớp mật khẩu dạng mã băm SHA-256
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(password));
  const actualHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  for (const hash of passwordHashes) {
    const target = hash.startsWith("sha256:") ? hash.slice(7) : hash;
    if (timingSafeEqualStr(actualHash, target.toLowerCase())) {
      return true;
    }
  }

  // 3. Fallback mặc định: nếu không có bất kỳ mật khẩu tùy chỉnh nào được cấu hình
  const hasCustomAuth =
    plainPasswords.length > 0 ||
    passwordHashes.some((h) => h.toLowerCase() !== DEFAULT_PASSWORD_HASH.toLowerCase());

  if (!hasCustomAuth) {
    const defaultTarget = DEFAULT_PASSWORD_HASH.slice(7);
    if (timingSafeEqualStr(actualHash, defaultTarget.toLowerCase())) {
      return true;
    }
  }

  return false;
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
