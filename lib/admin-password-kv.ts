import { getCloudContext, getKV } from "@/lib/cloud-storage";
import { DEFAULT_PASSWORD_HASH } from "@/lib/admin-auth";

interface ResolvedAuthConfig {
  plainPasswords: string[];
  passwordHashes: string[];
  sessionSecret: string;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export async function resolveAuthConfig(): Promise<ResolvedAuthConfig> {
  const plainPasswords: string[] = [];
  const passwordHashes: string[] = [];
  let sessionSecret = "";

  // 1. Kiểm tra Cloudflare Worker env (ctx.env từ Cloudflare Dashboard Secrets/Variables)
  try {
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
  } catch {
    // Bỏ qua nếu không chạy trên Cloudflare
  }

  // 2. Kiểm tra Cloudflare KV (nếu được lưu trong KV namespace)
  try {
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
    // Bỏ qua lỗi đọc KV
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

  return { plainPasswords, passwordHashes, sessionSecret };
}

export async function verifyPassword(password: string): Promise<boolean> {
  if (!password) return false;

  const { plainPasswords, passwordHashes } = await resolveAuthConfig();

  // 1. So khớp mật khẩu text thường
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

  // 3. Fallback mặc định
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
