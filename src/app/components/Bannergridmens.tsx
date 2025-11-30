/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import './fivegridBanner.css';

interface GridItem {
  imageUrl: string;
  title?: string;
  description?: string;
}

const MenBannerGrid: React.FC = () => {
  const [grid, setGrid] = useState<GridItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`
        );

        const data = await res.json();

        // 🔥 Backend sends menGrid array
        if (Array.isArray(data?.menGrid)) {
          setGrid(data.menGrid);
        }
      } catch (err) {
        console.error("Failed to load men 5-grid:", err);
      }
    };

    loadData();
  }, []);

  // If not exactly 5 images → hide component
  if (grid.length !== 5) return null;

  // Correct layout order (same as women)
  const layoutClasses = [
    "banner-left-top",
    "banner-left-bottom",
    "banner-center",
    "banner-right-top",
    "banner-right-bottom",
  ];

  return (
    <div className="banner-containerid">
      <div className="banner-wrapper">
        {grid.map((item, index) => (
          <div key={index} className={`banner-item ${layoutClasses[index]}`}>
            <img
              src={item.imageUrl}
              alt={item.title || "Men Banner"}
              className="banner-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenBannerGrid;
