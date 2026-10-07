import { NextResponse } from "next";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  // Protect /api/upload and future protected routes
  if (req.nextUrl.pathname.startsWith("/api/upload")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
  }

  // Example for protecting frontend dashboard routes later
  // if (req.nextUrl.pathname.startsWith("/dashboard")) {
  //   if (!token || !(await verifyToken(token))) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/upload", "/dashboard/:path*"],
};
