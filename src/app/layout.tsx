"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import "./Toggle.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { trackVisit } from "./utils/trafficTracker";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Define paths where Header/Footer should be hidden
  const hideLayout =
    pathname === "/login" || pathname === "/singup";

useEffect(() => {
    trackVisit();  // 🔥 Fires on every route change
  }, [pathname]);  // ← IMPORTANT: tracks every page navigation

  return (
    <html lang="en">
      <body>
        {/* Conditionally render header/footer */}
        {!hideLayout && <Header />}
        {children}
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
