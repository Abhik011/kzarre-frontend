
"use client";

import React, { useEffect, useState } from "react";
import "./FourImageGrid.css";

// ⭐ Stronger type — no 'any'
interface GridItem {
  imageUrl: string;
  title?: string;
  description?: string;
}

const MensBannerCard: React.FC = () => {
  const [banners, setBanners] = useState<GridItem[]>([]);

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`
        );

        const data = await res.json();

        // Backend: men4Grid
        if (Array.isArray(data?.men4Grid)) {
          setBanners(data.men4Grid as GridItem[]);
        }
      } catch (err) {
        console.error("Failed to load men 4-grid CMS:", err);
      }
    };

    fetchGrid();
  }, []);

  // ⭐ No more "any"
const isValidUrl = (url: unknown): boolean =>
  typeof url === "string" && url.startsWith("http");


  return (
    <div className="four-image-grid-wrapper">
      {(banners.length > 0 ? banners : Array(4).fill(null)).map(
        (banner, index) => (
          <div key={index} className="grid-item">
            <img
              src={
                banner && isValidUrl(banner.imageUrl)
                  ? banner.imageUrl
                  : "/placeholder.png"
              }
              alt={banner?.title || "Men Banner"}
              className="grid-image"
            />

            <div className="grid-text lsp-3">
              <h3>{banner?.title || ""}</h3>
              <p>{banner?.description || ""}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MensBannerCard;
