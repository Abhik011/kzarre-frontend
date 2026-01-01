import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🧭 DEBUG
  console.log("🧭 MIDDLEWARE HIT:", pathname);

  // ✅ Allow Next internals & static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // ✅ Always allow maintenance page itself
  if (pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    console.log("🌐 BACKEND URL:", backendUrl);

    const res = await fetch(
      `${backendUrl}/api/admin/system`,
      { cache: "no-store" }
    );

    console.log("📡 BACKEND STATUS:", res.status);

    if (!res.ok) {
      console.warn("⚠️ BACKEND NOT OK → FAIL OPEN");
      return NextResponse.next();
    }

    const data = await res.json();

    const maintenanceEnabled =
      data?.config?.maintenance?.maintenanceMode === true;

    console.log("🧩 MAINTENANCE MODE:", maintenanceEnabled);

    // 🚧 Maintenance ON → redirect frontend only
    if (maintenanceEnabled) {
      console.warn("🚧 MAINTENANCE ACTIVE → REDIRECT");
      const url = req.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ MIDDLEWARE ERROR:", err);
    return NextResponse.next(); // never break site
  }
}

/* =============================
   APPLY ONLY TO FRONTEND ROUTES
============================= */
export const config = {
  matcher: ["/((?!_next|api|maintenance|favicon.ico).*)"],
};
