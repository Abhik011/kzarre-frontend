
'use client';

import React, { useEffect, useState } from 'react';
import './fivegridBanner.css';

interface GridItem {
  imageUrl: string;
  title?: string;
  description?: string;
}

const Bannergrid: React.FC = () => {
  const [grid, setGrid] = useState<GridItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`
        );
        const data = await res.json();

        if (Array.isArray(data?.womenGrid)) {
          setGrid(data.womenGrid);
        }
      } catch (err) {
        console.error("Failed to load women 5-grid:", err);
      }
    };

    loadData();
  }, []);

  // If not exactly 5 images → render nothing
  if (grid.length !== 5) return null;

  // Mapping layout classes in correct order (1 → 5)
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
              alt={item.title || "Women Banner"}
              className="banner-img"
            />
          </div>
        ))}
        
      </div>
        <h3>Title</h3>
      <p>Captions</p>
    
    </div>
  );
};

export default Bannergrid;
