/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";

import "./FourImageGrid.css";

interface GridItem {
  imageUrl: string;
  title?: string;
  description?: string;
}

const WomensBannerCard: React.FC = () => {
  const [banners, setBanners] = useState<GridItem[]>([]);

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`
        );

        const data = await res.json();

        if (data?.women4Grid) {
          setBanners(data.women4Grid);
        }
      } catch (err) {
        console.error("Failed to load 4-grid CMS:", err);
      }
    };

    fetchGrid();
  }, []);

  return (
    <div className="four-image-grid-wrapper">
      {(banners.length > 0 ? banners : Array(4).fill(null)).map((banner, index) => (
        <div key={index} className="grid-item">
          <img
            src={banner?.imageUrl || "/placeholder.png"}
            alt={banner?.title || "Women Banner"}
            width={410}
            height={668}
            className="grid-image"
          />

          <div className="grid-text lsp-3">
            <h3>{banner?.title || ""}</h3>
            <p>{banner?.description || ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WomensBannerCard;
