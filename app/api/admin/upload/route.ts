import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { rateLimit, clientIp } from "@/lib/rate-limit";

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
    // WEBP may be lossy/lossless/extended — all fine for browsers.
    return "image/webp";
  }
  if (buf.length >= 6) {
    const sig = buf.toString("ascii", 0, 6);
    if (sig === "GIF87a" || sig === "GIF89a") return "image/gif";
  }
  // AVIF/HEIF share the ISO-BMFF "ftyp" box at offset 4.
  if (buf.length >= 12 && buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12);
    if (["avif", "avis", "mif1"].includes(brand)) return "image/avif";
  }
  return null;
}

export async function POST(req: Request) {
  try {
    // Per-IP throttle: bound storage abuse from a single client.
    const rl = rateLimit(`upload:${clientIp(req)}`, UPLOAD_LIMIT, UPLOAD_WINDOW_MS);
    if (rl.remaining <= 0) {
      return NextResponse.json(
        { error: "Quá nhiều lượt tải lên. Vui lòng thử lại sau." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec || 600) } }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Không tìm thấy file tải lên." },
        { status: 400 }
      );
    }

    const uploadedFile = file as File;

    // Validate declared MIME type
    if (!ALLOWED_MIME_TYPES.has(uploadedFile.type)) {
      return NextResponse.json(
        {
          error: `Định dạng tệp không hợp lệ (${uploadedFile.type}). Chỉ chấp nhận file ảnh (JPG, PNG, WebP, GIF, AVIF).`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (uploadedFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Dung lượng tệp quá lớn (${(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là 10MB.`,
        },
        { status: 400 }
      );
    }

    // Read bytes once for both magic-byte check and writing
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const detectedMime = detectImageMime(buffer);
    if (!detectedMime || !ALLOWED_MIME_TYPES.has(detectedMime)) {
      return NextResponse.json(
        { error: "Nội dung tệp không phải ảnh hợp lệ (bị chặn bởi kiểm tra magic-byte)." },
        { status: 400 }
      );
    }
    if (detectedMime !== uploadedFile.type) {
      return NextResponse.json(
        { error: `Kiểu tệp khai báo (${uploadedFile.type}) không khớp nội dung thực (${detectedMime}).` },
        { status: 400 }
      );
    }

    // Prepare upload directory: /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate safe, unique filename — extension comes from the DETECTED mime,
    // never from the client-supplied name.
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
    const destinationPath = path.join(uploadDir, finalFilename);

    // Write file to disk
    fs.writeFileSync(destinationPath, buffer);

    // Public URL served by Next.js static asset handler
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
