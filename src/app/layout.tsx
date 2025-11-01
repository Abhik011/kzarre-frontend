"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import "./Toggle.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Define paths where Header/Footer should be hidden
  const hideLayout =
    pathname === "/login" || pathname === "/singup";

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
