import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const signInURL = new URL("/", request.url);
  const homeURL = new URL("/reader/library", request.url);

  if (!token) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    return NextResponse.redirect(signInURL);
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(homeURL);
  }
}

export const config = {
  matcher: ["/", "/reader/:path*"],
};
