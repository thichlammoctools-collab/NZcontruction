import fs from "fs";
import path from "path";
import { kvGetJson, kvPutJson } from "./cloud-storage";

import defaultPosts from "@/content/posts.json";
import defaultProjects from "@/content/projects.json";
import defaultProjectsDetail from "@/content/projects_detail.json";
import defaultServicesDetail from "@/content/services_detail.json";
import defaultSiteSettings from "@/content/site_settings.json";
import defaultAiConfig from "@/content/ai_config.json";
const defaultQuoteLeads: any[] = [];
import defaultDictVi from "@/content/dictionaries/vi.json";
import defaultDictEn from "@/content/dictionaries/en.json";

export const BUNDLED_DEFAULTS: Record<string, any> = {
  "content:posts": defaultPosts,
  "content:projects": defaultProjects,
  "content:projects_detail": defaultProjectsDetail,
  "content:services_detail": defaultServicesDetail,
  "content:site_settings": defaultSiteSettings,
  "content:ai_config": defaultAiConfig,
  "content:quote_leads": defaultQuoteLeads,
  "content:dict_vi": defaultDictVi,
  "content:dict_en": defaultDictEn,
};

export function resolveKvKey(filePathOrKey: string): string {
  if (filePathOrKey.startsWith("content:")) return filePathOrKey;
  const normalized = filePathOrKey.replace(/\\/g, "/");
  if (normalized.includes("dictionaries/vi.json")) return "content:dict_vi";
  if (normalized.includes("dictionaries/en.json")) return "content:dict_en";
  if (normalized.includes("projects_detail.json")) return "content:projects_detail";
  if (normalized.includes("projects.json")) return "content:projects";
  if (normalized.includes("posts.json")) return "content:posts";
  if (normalized.includes("services_detail.json")) return "content:services_detail";
  if (normalized.includes("site_settings.json")) return "content:site_settings";
  if (normalized.includes("ai_config.json")) return "content:ai_config";
  if (normalized.includes("quote_leads.json")) return "content:quote_leads";
  return `content:${path.basename(filePathOrKey, ".json")}`;
}

// Durable atomic JSON write: writes to Cloudflare KV first, and local disk if available
export async function writeJsonAtomic(filePath: string, data: unknown): Promise<void> {
  const key = resolveKvKey(filePath);

  // 1. Persist to Cloudflare KV
  await kvPutJson(key, data);

  // 2. Also write to local filesystem if supported (for local dev mode)
  try {
    const dir = path.dirname(filePath);
    if (fs.existsSync(dir)) {
      const tmp = path.join(
        dir,
        `.${path.basename(filePath)}.${process.pid || "worker"}.${Date.now()}.tmp`
      );
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
      fs.renameSync(tmp, filePath);
    }
  } catch {
    // In Cloudflare Workers edge environment, fs is read-only or not writeable.
    // KV write succeeded, so ignore fs error.
  }
}

// Durable JSON read: checks Cloudflare KV first -> bundled JSON -> local fs -> fallback
export async function readJsonSafe<T>(filePath: string, fallback: T): Promise<T> {
  const key = resolveKvKey(filePath);

  // 1. Try reading from Cloudflare KV
  try {
    const remoteData = await kvGetJson<T>(key);
    if (remoteData !== null && remoteData !== undefined) {
      if (
        typeof remoteData === "object" &&
        !Array.isArray(remoteData) &&
        BUNDLED_DEFAULTS[key] &&
        typeof BUNDLED_DEFAULTS[key] === "object" &&
        !Array.isArray(BUNDLED_DEFAULTS[key])
      ) {
        return { ...(BUNDLED_DEFAULTS[key] as any), ...(remoteData as any) } as T;
      }
      return remoteData;
    }
  } catch (err) {
    console.warn(`[Read Warning] KV get failed for ${key}:`, err);
  }

  // 2. Check bundled default content
  if (BUNDLED_DEFAULTS[key] !== undefined) {
    return BUNDLED_DEFAULTS[key] as T;
  }

  // 3. Fall back to local disk if fs exists
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }

  return fallback;
}

// Synchronous read (used for components/utilities that cannot be made async)
export function readJsonSafeSync<T>(filePath: string, fallback: T): T {
  const key = resolveKvKey(filePath);
  if (BUNDLED_DEFAULTS[key] !== undefined) {
    return BUNDLED_DEFAULTS[key] as T;
  }
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
    }
  } catch {}
  return fallback;
}

// Sanitize a user-supplied string before persisting: trim, clamp length, and
// strip control characters. Keeps line breaks / basic punctuation for prose.
export function sanitizeString(value: unknown, maxLen = 2000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, maxLen);
}

// Validate a plain email address (lightweight, no external deps).
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Keep only digits (and a leading +) — used to normalize phone numbers.
export function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}
