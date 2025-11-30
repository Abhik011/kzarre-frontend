
"use client";

import React, { useEffect, useState } from "react";
import "./Banner.css";

interface BannerItem {
  image?: string;
  title?: string;
  description?: string;
}

export default function Bannertwo() {
  const [banner, setBanner] = useState<BannerItem | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.banners?.bannerTwo) {
          setBanner(data.banners.bannerTwo);
        }
      })
      .catch((err) => console.error("BannerTwo Error:", err));
  }, []);

  return (
    <div className="div2">
      {/* IMAGE */}
      {banner?.image ? (
        <img
          src={banner.image}
          alt={banner.title || "Banner Two"}
          className="bone"
        />
      ) : (
        <div className="bone-placeholder" />
      )}

      {/* TITLE */}
      <h3 className="lsp-3">{banner?.title}</h3>

      {/* DESCRIPTION */}
    <p className="lsp-3">{banner?.description}</p>
    </div>
  );
}
