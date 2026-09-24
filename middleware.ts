import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow login page without auth (or redirect to /admin if already logged in)
  if (pathname === "/admin/login") {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (token && (await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // 2. Allow login API endpoint without authentication
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // 3. For protected routes, check valid token
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (token && (await verifySessionToken(token))) {
    return NextResponse.next();
  }

  // 4. Reject unauthenticated API requests with 401
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 5. Redirect unauthenticated page requests to login
  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
