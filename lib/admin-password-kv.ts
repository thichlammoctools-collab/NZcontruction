import { getCloudContext, getKV } from "@/lib/cloud-storage";

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

  // KV values take precedence so a password change can replace deployment config.
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

      if (plainPasswords.length > 0 || passwordHashes.length > 0) {
        return { plainPasswords, passwordHashes, sessionSecret };
      }
    }
  } catch {
    // Fall through to deployment environment values.
  }

  // Cloudflare Worker env values are preferred over process.env.
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
    // Fall through to process.env.
  }

  if (process.env.ADMIN_PASSWORD?.trim()) {
    plainPasswords.push(process.env.ADMIN_PASSWORD.trim());
  }
  if (process.env.ADMIN_PASSWORD_HASH?.trim()) {
    passwordHashes.push(process.env.ADMIN_PASSWORD_HASH.trim());
  }
  if (!sessionSecret && process.env.ADMIN_SESSION_SECRET?.trim()) {
    sessionSecret = process.env.ADMIN_SESSION_SECRET.trim();
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

  return false;
}
