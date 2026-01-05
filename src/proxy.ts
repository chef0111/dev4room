import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const sessionData = await auth.api.getSession({
    headers: request.headers,
  });
  const session = sessionData?.session;
  const user = sessionData?.user;
  const pathname = request.nextUrl.pathname;

  // Protected routes - require authentication
  const protectedRoutes = ["/settings", "/ask-question", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes - redirect to home if already logged in
  const authRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/verify-email",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const adminRoutes = ["/dashboard"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && session) {
    const from = request.nextUrl.searchParams.get("from");
    const redirectUrl =
      from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect non-admin users away from admin routes
  if (isAdminRoute && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
