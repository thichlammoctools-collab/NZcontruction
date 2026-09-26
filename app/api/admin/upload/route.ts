import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { r2PutObject, r2ListObjects } from "@/lib/cloud-storage";

export const dynamic = "force-dynamic";

// Maximum allowed image size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Throttle uploads per IP to bound storage abuse (max 30 / 10 min).
const UPLOAD_LIMIT = 30;
const UPLOAD_WINDOW_MS = 10 * 60 * 1000;

// Allowed image MIME types. SVG is intentionally EXCLUDED: it can embed
// scripts and would be a stored-XSS vector when served from the same origin.
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

// Map MIME types to file extensions if original has strange or missing extension
const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

// Magic-byte sniffing: verify the real content type instead of trusting the
// client-declared File.type. Returns the detected MIME or null.
function detectImageMime(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buf.length >= 6) {
    const sig = buf.toString("ascii", 0, 6);
    if (sig === "GIF87a" || sig === "GIF89a") return "image/gif";
  }
  if (buf.length >= 12 && buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12);
    if (["avif", "avis", "mif1"].includes(brand)) return "image/avif";
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const { remaining, retryAfterSec } = rateLimit(`upload:${ip}`, UPLOAD_LIMIT, UPLOAD_WINDOW_MS);
    if (remaining === 0) {
      return NextResponse.json(
        { error: `Quá nhiều lượt tải lên. Vui lòng thử lại sau ${retryAfterSec}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Vui lòng chọn một tệp hình ảnh để tải lên." },
        { status: 400 }
      );
    }

    const uploadedFile = file as File;

    if (!ALLOWED_MIME_TYPES.has(uploadedFile.type)) {
      return NextResponse.json(
        {
          error: "Định dạng tệp không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, GIF, AVIF.",
        },
        { status: 400 }
      );
    }

    if (uploadedFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Kích thước tệp quá lớn. Tối đa cho phép là 10MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const detectedMime = detectImageMime(buffer);
    if (!detectedMime) {
      return NextResponse.json(
        { error: "Nội dung tệp không phải hình ảnh hợp lệ (chữ ký nhị phân không khớp)." },
        { status: 400 }
      );
    }
    if (detectedMime !== uploadedFile.type) {
      return NextResponse.json(
        { error: `Kiểu tệp khai báo (${uploadedFile.type}) không khớp nội dung thực (${detectedMime}).` },
        { status: 400 }
      );
    }

    // Generate safe, unique filename
    const originalName = uploadedFile.name || "image";
    const extFromOriginal = path.extname(originalName).toLowerCase();
    const safeExt = MIME_EXTENSION_MAP[detectedMime] || extFromOriginal || ".jpg";

    const baseName = path
      .basename(originalName, extFromOriginal)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-") // Convert special chars to dash
      .replace(/^-+|-+$/g, "") // Trim dashes
      .slice(0, 50); // Limit name length

    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const finalFilename = `${baseName || "photo"}-${uniqueSuffix}${safeExt}`;

    // 1. Upload to Cloudflare R2 bucket
    await r2PutObject(finalFilename, buffer, detectedMime);

    // 2. Also save to local public/uploads if fs is writeable (local dev)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, finalFilename), buffer);
    } catch {
      // In Cloudflare Workers edge environment, fs is read-only. Ignore.
    }

    // Public URL served by Next.js static asset handler or /uploads/[...path]
    const publicUrl = `/uploads/${finalFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      originalName: uploadedFile.name,
      size: uploadedFile.size,
      mimeType: detectedMime,
    });
  } catch (error: any) {
    console.error("Lỗi khi tải ảnh lên:", error);
    return NextResponse.json(
      {
        error: error?.message || "Đã xảy ra lỗi trong quá trình lưu ảnh lên máy chủ.",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to list recently uploaded files
export async function GET() {
  try {
    // 1. Try listing from Cloudflare R2
    const r2Files = await r2ListObjects(undefined, 30);
    if (r2Files.length > 0) {
      const files = r2Files
        .filter((item) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(item.key))
        .map((item) => ({
          filename: item.key,
          url: `/uploads/${item.key}`,
          size: item.size,
          createdAt: item.uploaded,
        }));
      return NextResponse.json({ files });
    }

    // 2. Fall back to local disk if available
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs.readdirSync(uploadDir);
    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file))
      .map((file) => {
        const stats = fs.statSync(path.join(uploadDir, file));
        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 30);

    return NextResponse.json({ files: imageFiles });
  } catch (error) {
    return NextResponse.json({ files: [] });
  }
}
