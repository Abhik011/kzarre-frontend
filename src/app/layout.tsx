"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import "./Toggle.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

import { trackVisit } from "./utils/trafficTracker";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // hide header/footer on certain pages
  const hideLayout =
    pathname === "/login" || pathname === "/singup";

  useEffect(() => {
    trackVisit();   // fires on every route change
  }, [pathname]);

  return (
    <html lang="en">
      <body>
                <CookieBanner />
        {!hideLayout && <Header />}
        {children}
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
