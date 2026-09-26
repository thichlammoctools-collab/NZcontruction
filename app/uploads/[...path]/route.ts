import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { r2GetObject } from "@/lib/cloud-storage";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

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
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: rawSegments } = await params;
    if (!rawSegments || rawSegments.length === 0) {
      return new NextResponse("File path required", { status: 400 });
    }

    const segments = rawSegments.map((seg) => decodeURIComponent(seg));
    if (
      segments.some(
        (segment) =>
          !segment ||
          segment === "." ||
          segment === ".." ||
          segment.includes("/") ||
          segment.includes("\\")
      )
    ) {
      return new NextResponse("Invalid file path", { status: 400 });
    }
    const r2Key = segments.join("/");
    const isPrivateQuote = r2Key === "quotes" || r2Key.startsWith("quotes/");
    if (isPrivateQuote && !(await verifySessionToken(_request.cookies.get(ADMIN_COOKIE)?.value))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Try serving from Cloudflare R2 bucket
    const r2Obj = await r2GetObject(r2Key);
    if (r2Obj) {
      return new Response(r2Obj.body as any, {
        status: 200,
        headers: {
          "Content-Type": isPrivateQuote ? "application/octet-stream" : r2Obj.contentType,
          ...(isPrivateQuote ? { "Content-Disposition": "attachment" } : {}),
          "Content-Length": r2Obj.size.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // 2. Fall back to local filesystem if available (local development)
    try {
      const uploadsDir = isPrivateQuote
        ? path.resolve(process.cwd(), "content", "private-uploads")
        : path.resolve(process.cwd(), "public", "uploads");
      const joined = path.join(...segments);
      const resolved = path.resolve(uploadsDir, joined);

      if (resolved.startsWith(uploadsDir + path.sep) || resolved === uploadsDir) {
        if (fs.existsSync(resolved)) {
          const stat = await fs.promises.stat(resolved);
          if (stat.isFile()) {
            const ext = path.extname(resolved).toLowerCase();
            const contentType = isPrivateQuote ? "application/octet-stream" : MIME_MAP[ext] || "application/octet-stream";
            const fileBuffer = await fs.promises.readFile(resolved);

            return new Response(fileBuffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                ...(isPrivateQuote ? { "Content-Disposition": "attachment" } : {}),
                "Content-Length": stat.size.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Content-Type-Options": "nosniff",
              },
            });
          }
        }
      }
    } catch {
      // Ignore fs error on edge
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (err: any) {
    console.error("Error serving uploaded file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
