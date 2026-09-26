import fs from "fs";
import path from "path";
import { getKV, kvGetJson, kvPutJson } from "./cloud-storage";

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
  const kv = await getKV();
  const persistedToKv = kv ? await kvPutJson(key, data) : false;

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
      if (BUNDLED_DEFAULTS[key] !== undefined) BUNDLED_DEFAULTS[key] = data;
      return;
    }
  } catch (error) {
    if (!persistedToKv) throw error;
  }

  if (persistedToKv) {
    if (BUNDLED_DEFAULTS[key] !== undefined) BUNDLED_DEFAULTS[key] = data;
    return;
  }
  throw new Error(`No durable storage available for ${key}`);
}

function deepMerge<T = any>(target: any, source: any): T {
  if (!source) return target;
  if (!target) return source;
  if (typeof target !== "object" || typeof source !== "object") return source;
  if (Array.isArray(target) || Array.isArray(source)) return source;

  const result: any = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];
    if (
      srcVal !== null &&
      typeof srcVal === "object" &&
      !Array.isArray(srcVal) &&
      key in target &&
      tgtVal !== null &&
      typeof tgtVal === "object" &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal, srcVal);
    } else {
      result[key] = srcVal;
    }
  }
  return result as T;
}

function hasVietnameseText(value: unknown): boolean {
  return typeof value === "string" && /[À-ỹĐđ]/.test(value);
}

// Older KV data can contain values copied from the Vietnamese editor. Keep the
// English dictionary aligned with its bundled defaults for known bilingual fields.
function repairEnglishDictionary<T>(key: string, data: T): T {
  if (key !== "content:dict_en" || !data || typeof data !== "object") return data;

  const dictionary = data as any;
  const defaults = BUNDLED_DEFAULTS[key] as any;
  const repaired = { ...dictionary };

  for (const section of ["before_after", "quick_contact"]) {
    if (!dictionary[section] || !defaults?.[section]) continue;
    repaired[section] = { ...dictionary[section] };
    for (const field of Object.keys(defaults[section])) {
      if (hasVietnameseText(repaired[section][field])) {
        repaired[section][field] = defaults[section][field];
      }
    }
  }

  return repaired as T;
}

// Durable JSON read: checks Cloudflare KV first -> local fs -> bundled JSON -> fallback
export async function readJsonSafe<T>(filePath: string, fallback: T): Promise<T> {
  const key = resolveKvKey(filePath);

  // 1. Try reading from Cloudflare KV
  try {
    const remoteData = await kvGetJson<T>(key);
    if (remoteData !== null && remoteData !== undefined) {
      // Deep-merge default configs for singleton settings and dictionaries to ensure
      // newly added keys or sub-objects are never lost if KV has a partial/older schema.
      // NEVER merge collections (services_detail, projects_detail, posts, etc.), otherwise deleted items will be resurrected!
      if (
        (key === "content:site_settings" ||
          key === "content:ai_config" ||
          key === "content:dict_vi" ||
          key === "content:dict_en") &&
        typeof remoteData === "object" &&
        !Array.isArray(remoteData) &&
        BUNDLED_DEFAULTS[key] &&
        typeof BUNDLED_DEFAULTS[key] === "object" &&
        !Array.isArray(BUNDLED_DEFAULTS[key])
      ) {
        return repairEnglishDictionary(
          key,
          deepMerge(BUNDLED_DEFAULTS[key], remoteData) as T
        );
      }
      return repairEnglishDictionary(key, remoteData);
    }
  } catch (err) {
    console.warn(`[Read Warning] KV get failed for ${key}:`, err);
  }

  // 2. Try reading from local filesystem if available (local dev)
  try {
    if (fs.existsSync(filePath)) {
      return repairEnglishDictionary(
        key,
        JSON.parse(fs.readFileSync(filePath, "utf8")) as T
      );
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }

  // 3. Fall back to bundled default content (useful when running on Cloudflare Workers before KV is initialized or fs is unavailable)
  if (BUNDLED_DEFAULTS[key] !== undefined) {
    return repairEnglishDictionary(key, BUNDLED_DEFAULTS[key] as T);
  }

  return fallback;
}

// Synchronous read (used for components/utilities that cannot be made async)
export function readJsonSafeSync<T>(filePath: string, fallback: T): T {
  const key = resolveKvKey(filePath);
  // Try reading from local filesystem first if exists
  try {
    if (fs.existsSync(filePath)) {
      return repairEnglishDictionary(
        key,
        JSON.parse(fs.readFileSync(filePath, "utf8")) as T
      );
    }
  } catch {}

  // Fall back to bundled defaults
  if (BUNDLED_DEFAULTS[key] !== undefined) {
    return repairEnglishDictionary(key, BUNDLED_DEFAULTS[key] as T);
  }
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
