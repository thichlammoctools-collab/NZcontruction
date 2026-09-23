import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Maximum allowed image size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed image MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

// Map MIME types to file extensions if original has strange or missing extension
const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Không tìm thấy file tải lên." },
        { status: 400 }
      );
    }

    const uploadedFile = file as File;

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(uploadedFile.type)) {
      return NextResponse.json(
        {
          error: `Định dạng tệp không hợp lệ (${uploadedFile.type}). Chỉ chấp nhận file ảnh (JPG, PNG, WebP, GIF, SVG, AVIF).`,
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

    // Prepare upload directory: /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate safe, unique filename
    const originalName = uploadedFile.name || "image";
    const extFromOriginal = path.extname(originalName).toLowerCase();
    const safeExt =
      extFromOriginal || MIME_EXTENSION_MAP[uploadedFile.type] || ".jpg";

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
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destinationPath, buffer);

    // Public URL served by Next.js static asset handler
    const publicUrl = `/uploads/${finalFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      originalName: uploadedFile.name,
      size: uploadedFile.size,
      mimeType: uploadedFile.type,
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
      .filter((file) => /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file))
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
