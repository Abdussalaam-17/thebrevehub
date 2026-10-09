import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin and /account
  const needsAuth =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    pathname.startsWith("/account");

  if (!needsAuth) {
    return NextResponse.next();
  }

  // Supabase cookies look like: sb-<project-ref>-auth-token
  const hasSessionCookie = req.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!hasSessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Only run on these routes — keeps middleware fast and out of the way
  matcher: ["/admin/:path*", "/account/:path*"],
};
