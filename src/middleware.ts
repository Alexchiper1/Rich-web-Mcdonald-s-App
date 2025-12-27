import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // protect manager pages + manager api
  if (pathname.startsWith("/manager") || pathname.startsWith("/api/manager")) {
    const role = req.cookies.get("role")?.value;

    if (role !== "manager") {
      const url = req.nextUrl.clone();
      url.pathname = "/"; // send them to login
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manager/:path*", "/api/manager/:path*"],
};
