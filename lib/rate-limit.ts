// Simple in-memory fixed-window limiter. Use Cloudflare Rate Limiting/KV for
// enforcement shared across isolates in production.
// Returns the remaining allowance, or 0 when the caller is over the limit.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { remaining: number; retryAfterSec: number } {
  const now = Date.now();
  if (buckets.size > 5000) {
    buckets.forEach((bucket, bucketKey) => {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    });
  }
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { remaining: limit - 1, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return { remaining: 0, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { remaining: limit - entry.count, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return req.headers.get("x-real-ip") || "unknown";
}
