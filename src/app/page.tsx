"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";


export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <>
      <Analytics />
    </>
  );
}
