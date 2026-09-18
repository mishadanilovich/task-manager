import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/server/auth/cookie";

const LOGIN_PATH = "/login";
const DEFAULT_PATH = "/lists";

export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  if (!hasSessionCookie && pathname !== LOGIN_PATH) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (hasSessionCookie && pathname === LOGIN_PATH) {
    return NextResponse.redirect(new URL(DEFAULT_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
