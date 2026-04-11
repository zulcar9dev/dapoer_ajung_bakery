import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Client-side auth uses Zustand persist (localStorage).
// This middleware provides a lightweight server-side redirect
// for the first page load by checking a simple cookie.
// The real auth check happens client-side via AuthGuard.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files), API routes, and auth pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For all other admin routes, the AuthGuard component handles
  // the redirect client-side after Zustand hydration.
  // This middleware is a placeholder for future server-side auth (e.g., Better Auth).
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
