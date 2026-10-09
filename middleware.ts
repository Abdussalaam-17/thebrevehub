import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard /admin routes except the login page
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Supabase sets cookies named: sb-<project-ref>-auth-token
    // We just check if ANY Supabase auth cookie exists.
    const hasSession = req.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
