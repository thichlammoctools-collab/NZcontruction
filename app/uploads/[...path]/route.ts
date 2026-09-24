import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  try {
    const rawSegments = params.path;
    if (!rawSegments || rawSegments.length === 0) {
      return new NextResponse("File path required", { status: 400 });
    }

    const segments = rawSegments.map((seg) => decodeURIComponent(seg));
    const uploadsDir = path.resolve(process.cwd(), "public", "uploads");

    // Secure path resolution against directory traversal
    const joined = path.join(...segments);
    const resolved = path.resolve(uploadsDir, joined);

    if (!resolved.startsWith(uploadsDir + path.sep) && resolved !== uploadsDir) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(resolved)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const stat = await fs.promises.stat(resolved);
    if (!stat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const fileBuffer = await fs.promises.readFile(resolved);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    console.error("Error serving uploaded file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
