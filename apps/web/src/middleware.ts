import { meService } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const cookie = req.headers.get("cookie") ?? "";
  const user = await meService(cookie);

  if (user) {
    if (req.nextUrl.pathname === "/auth") {
      return NextResponse.redirect(new URL("/rooms", req.url));
    }
  }

  if (!user && req.nextUrl.pathname !== "/auth") return NextResponse.redirect(new URL("/auth", req.url));
  return NextResponse.next();
};

export const config = {
  matcher: ["/rooms/:path*", "/auth"],
};
