import { me } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const user = await me();
  if (!user) return NextResponse.redirect(new URL("/auth", req.url));
  return NextResponse.next();
};

export const config = {
  matcher: ["/rooms/:path*"],
};
