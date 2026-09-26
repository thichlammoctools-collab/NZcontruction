import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/admin-password-kv";
import { getKV } from "@/lib/cloud-storage";

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { error: "Vui lòng nhập mật khẩu hiện tại." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải có ít nhất 6 ký tự." },
        { status: 400 }
      );
    }

    // Xác thực mật khẩu cũ
    const isCurrentValid = await verifyPassword(currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Mật khẩu hiện tại không chính xác." },
        { status: 401 }
      );
    }

    // Tạo mã băm SHA-256 cho mật khẩu mới
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(newPassword.trim()));
    const newHash =
      "sha256:" +
      Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    // Lưu vào Cloudflare KV
    const kv = await getKV();
    if (!kv) {
      return NextResponse.json(
        { error: "Không thể đổi mật khẩu khi Cloudflare KV chưa được cấu hình." },
        { status: 503 }
      );
    }

    await kv.put("ADMIN_PASSWORD_HASH", newHash);
    await kv.put(
      "ADMIN_SESSION_SECRET",
      Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
      // Xóa key plain password cũ trong KV nếu có để ưu tiên hash mới
    try {
      await kv.delete("ADMIN_PASSWORD");
      await kv.delete("admin_password");
    } catch {
      // Ignore absent legacy keys.
    }

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công. Các phiên đăng nhập cũ đã bị vô hiệu hóa.",
      savedToKV: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Đã xảy ra lỗi khi đổi mật khẩu." },
      { status: 500 }
    );
  }
}
