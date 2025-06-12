import { NextRequest, NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/todos", "/settings", "/profile"];
// Define auth routes (accessible only when not logged in)
const authRoutes = ["/login", "/register"];
// Define protected API routes

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user is authenticated by looking for the session token in cookies
  const token = request.cookies.get("firebase-auth-token")?.value;
  const isAuthenticated = !!token;

  // Handling protected routes (redirect to login if not authenticated)
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  // Handling auth routes (redirect to todos if already authenticated)
  //   if (
  //     authRoutes.some((route) => pathname.startsWith(route)) &&
  //     isAuthenticated
  //   ) {
  //     return NextResponse.redirect(new URL("/todos", request.url));
  //   }

  // Handling protected API routes (return 401 if not authenticated)
 
  return NextResponse.next();
}

// Configure which routes this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
    "/api/:path*",
  ],
};
