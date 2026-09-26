import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/admin-password-kv";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`admin-login:${clientIp(req)}`, 10, 15 * 60 * 1000);
  if (rl.remaining <= 0) {
    return NextResponse.json(
      { error: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec || 900) } }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    // invalid body → treat as wrong password
  }

  if (!(await verifyPassword(password))) {
    return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Server chưa cấu hình ADMIN_PASSWORD_HASH / ADMIN_SESSION_SECRET." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
