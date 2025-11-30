
"use client";

import React, { useEffect, useState } from "react";
import "./Banner.css";

interface BannerItem {
  image?: string;
  title?: string;
  description?: string;
}

export default function Bannerone() {
  const [banner, setBanner] = useState<BannerItem | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.banners?.bannerOne) {
          setBanner(data.banners.bannerOne);
        }
      })
      .catch((err) => console.error("BannerOne Error:", err));
  }, []);

  return (
    <div className="div2">
      {/* IMAGE */}
      {banner?.image ? (
        <img
          src={banner.image}
          alt={banner.title || "Banner One"}
          className="bone"
        />
      ) : (
        <div className="bone-placeholder" />
      )}

      <h3 className="lsp-3">{banner?.title}</h3>
      <p className="lsp-3">{banner?.description}</p>
    </div>
  );
}
