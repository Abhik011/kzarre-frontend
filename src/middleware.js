import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("kzarre_token")?.value;
  const { pathname } = request.nextUrl;

  // ✅ 🧪 DEBUG LOGS (YOU MUST SEE THESE IN TERMINAL)
  console.log("🛡️ MIDDLEWARE HIT:");
  console.log("➡️ Path:", pathname);
  console.log("🍪 Token from cookie:", token);

  // ✅ Always allow public & system routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    console.log("✅ Public route allowed:", pathname);
    return NextResponse.next();
  }

  // ✅ Protected routes
  const protectedRoutes = [
    "/cart",
    "/checkout",
    "/profile",
    "/orders",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log("🔐 Is protected route?", isProtected);

  // ✅ If NOT logged in → redirect to login
  if (isProtected && !token) {
    console.log("🚨 NO TOKEN → REDIRECT TO LOGIN");

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  console.log("✅ Access allowed:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/orders/:path*",
  ],
};
