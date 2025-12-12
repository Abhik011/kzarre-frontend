"use client";

import React, { useEffect, useState } from "react";
import "./Banner.css";

interface BannerStyle {
  titleColor?: string;
  titleSize?: string;
  descColor?: string;
  descSize?: string;
  alignment?: "left" | "center" | "right";  // <-- FIXED
  fontFamily?: string;
}


interface BannerItem {
  image?: string;
  title?: string;
  description?: string;
  style?: BannerStyle;
}

export default function Bannertwo() {
  const [banner, setBanner] = useState<BannerItem | null>(null);
  const [fonts, setFonts] = useState<any[]>([]);

  // Fetch banner + fonts
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.banners?.bannerTwo) setBanner(data.banners.bannerTwo);
        if (data?.fonts) setFonts(data.fonts);
      })
      .catch((err) => console.error("BannerTwo Error:", err));
  }, []);

  // Inject uploaded fonts
useEffect(() => {
  if (!fonts.length) return;

  const styleTag = document.createElement("style");
  let css = "";

  fonts.forEach((font) => {
    css += `
      @font-face {
        font-family: '${font.name}';
        src: url('${font.url}');
      }
    `;
  });

  styleTag.innerHTML = css;
  document.head.appendChild(styleTag);

  // CLEANUP MUST RETURN void
  return () => {
    document.head.removeChild(styleTag);
  };
}, [fonts]);


  const s = banner?.style || {};

  // only apply values if they exist — otherwise CSS handles it
  const titleStyle: React.CSSProperties = {
    ...(s.titleColor ? { color: s.titleColor } : {}),
    ...(s.titleSize ? { fontSize: s.titleSize } : {}),
    ...(s.fontFamily ? { fontFamily: s.fontFamily } : {}),
    ...(s.alignment ? { textAlign: s.alignment } : {}),
  };

  const descStyle: React.CSSProperties = {
    ...(s.descColor ? { color: s.descColor } : {}),
    ...(s.descSize ? { fontSize: s.descSize } : {}),
    ...(s.fontFamily ? { fontFamily: s.fontFamily } : {}),
    ...(s.alignment ? { textAlign: s.alignment } : {}),
  };

  return (
    <div className="div2">
      {banner?.image ? (
        <img src={banner.image} alt={banner.title || "Banner Two"} className="bone" />
      ) : (
        <div className="bone-placeholder" />
      )}

      <h3 className="lsp-3" style={titleStyle}>
        {banner?.title}
      </h3>

      <p className="lsp-3" style={descStyle}>
        {banner?.description}
      </p>
    </div>
  );
}
