import { getCloudflareContext } from "@opennextjs/cloudflare";

// Helper to safely get Cloudflare context (returns null outside Cloudflare environment)
export async function getCloudContext(): Promise<any | null> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return ctx?.env || null;
  } catch {
    try {
      const ctx = getCloudflareContext();
      return ctx?.env || null;
    } catch {
      return null;
    }
  }
}

// ----------------------------------------------------
// Cloudflare KV operations
// ----------------------------------------------------
export async function getKV(): Promise<any | null> {
  const env = await getCloudContext();
  return env?.KV || env?.NZCONSTRUCTION_KV || null;
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  try {
    const kv = await getKV();
    if (!kv) return null;
    const value = await kv.get(key, "json");
    return (value as T) ?? null;
  } catch (err) {
    console.warn(`[KV Get Error] key="${key}":`, err);
    return null;
  }
}

export async function kvPutJson(key: string, value: unknown): Promise<boolean> {
  try {
    const kv = await getKV();
    if (!kv) return false;
    await kv.put(key, JSON.stringify(value, null, 2));
    return true;
  } catch (err) {
    console.error(`[KV Put Error] key="${key}":`, err);
    return false;
  }
}

// ----------------------------------------------------
// Cloudflare R2 operations
// ----------------------------------------------------
export async function getR2(): Promise<any | null> {
  const env = await getCloudContext();
  return env?.R2 || env?.MEDIA_BUCKET || env?.nzconstruction_media || null;
}

export async function r2PutObject(
  key: string,
  data: ArrayBuffer | Uint8Array | Buffer | ReadableStream,
  contentType: string
): Promise<boolean> {
  try {
    const r2 = await getR2();
    if (!r2) return false;
    await r2.put(key, data, {
      httpMetadata: {
        contentType,
      },
    });
    return true;
  } catch (err) {
    console.error(`[R2 Put Error] key="${key}":`, err);
    return false;
  }
}

export async function r2GetObject(key: string): Promise<{
  body: ReadableStream;
  size: number;
  contentType: string;
} | null> {
  try {
    const r2 = await getR2();
    if (!r2) return null;
    const obj = await r2.get(key);
    if (!obj) return null;
    return {
      body: obj.body,
      size: obj.size,
      contentType: obj.httpMetadata?.contentType || "application/octet-stream",
    };
  } catch (err) {
    console.error(`[R2 Get Error] key="${key}":`, err);
    return null;
  }
}

export async function r2ListObjects(prefix?: string, limit = 50): Promise<Array<{
  key: string;
  size: number;
  uploaded: Date;
}>> {
  try {
    const r2 = await getR2();
    if (!r2) return [];
    const listed = await r2.list({ prefix, limit });
    return (listed.objects || []).map((o: any) => ({
      key: o.key,
      size: o.size,
      uploaded: o.uploaded,
    }));
  } catch (err) {
    console.error("[R2 List Error]:", err);
    return [];
  }
}
