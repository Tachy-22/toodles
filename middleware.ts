import { NextRequest, NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/todos", "/settings", "/profile"];
// Define auth routes (accessible only when not logged in)
const authRoutes = ["/login", "/register"];

// This middleware shouldn't interfere with Firebase authentication
// Firebase handles auth client-side, so we'll just let the pages handle auth checks
export function middleware(request: NextRequest) {
  // Let the client-side Firebase auth handle the authentication
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
