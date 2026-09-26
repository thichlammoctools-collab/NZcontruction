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
    let savedToKV = false;
    if (kv) {
      await kv.put("ADMIN_PASSWORD_HASH", newHash);
      // Xóa key plain password cũ trong KV nếu có để ưu tiên hash mới
      try {
        await kv.delete("ADMIN_PASSWORD");
        await kv.delete("admin_password");
      } catch {
        // Bỏ qua nếu key không tồn tại
      }
      savedToKV = true;
    }

    return NextResponse.json({
      success: true,
      message: savedToKV
        ? "Đổi mật khẩu thành công! Mật khẩu mới đã được lưu trên Cloudflare KV và có hiệu lực ngay lập tức."
        : "Đổi mật khẩu thành công! (Mã băm mới: " + newHash + ")",
      newHash,
      savedToKV,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Đã xảy ra lỗi khi đổi mật khẩu." },
      { status: 500 }
    );
  }
}
