"use client";

import React, { useEffect, useState } from "react";
import "./fivegridBanner.css";

interface BannerStyle {
  titleColor?: string;
  titleSize?: string;
  descColor?: string;
  descSize?: string;
  alignment?: "left" | "center" | "right";
  fontFamily?: string;
}

export default function Bannergrid() {
  const [media, setMedia] = useState<any[]>([]);
  const [parent, setParent] = useState<any>(null);
  const [fonts, setFonts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`
        );
        const data = await res.json();

        /** 
         * YOUR API RETURNS:
         * womenGrid = [
         *    { _doc: {image...}, $__parent: {...parent data...} },
         *    { _doc: {...}, $__parent: {...} },
         *    ...
         * ]
         */

        const arr = data?.womenGrid || [];

        if (arr.length > 0) {
          setParent(arr[0].$__parent);         // ⭐ Extract parent (title, desc, bannerStyle)
        }

        // Extract only images
        const cleanedImages = arr.map((item: any) => item._doc);
        setMedia(cleanedImages);

        // Fonts
        if (Array.isArray(data?.fonts)) setFonts(data.fonts);
      } catch (err) {
        console.error("Women 5-grid load error:", err);
      }
    };

    load();
  }, []);

  /** Inject fonts */
/** Inject uploaded fonts dynamically */
useEffect(() => {
  if (!fonts.length) {
    return; // no cleanup required
  }

  const styleTag = document.createElement("style");
  styleTag.innerHTML = fonts
    .map(
      (font: any) => `
        @font-face {
          font-family: '${font.name}';
          src: url('${font.url}');
        }
      `
    )
    .join("");

  document.head.appendChild(styleTag);

  return () => {
    document.head.removeChild(styleTag);
  };
}, [fonts]);


  if (!parent || media.length !== 5) return null;

  const style: BannerStyle = parent.bannerStyle || {};

  const layoutClasses = [
    "banner-left-top",
    "banner-left-bottom",
    "banner-center",
    "banner-right-top",
    "banner-right-bottom",
  ];

  const titleStyle: React.CSSProperties = {
    color: style.titleColor,
    fontSize: style.titleSize,
    fontFamily: style.fontFamily,
    textAlign: style.alignment || "center",
  };

  const descStyle: React.CSSProperties = {
    color: style.descColor,
    fontSize: style.descSize,
    fontFamily: style.fontFamily,
    textAlign: style.alignment || "center",
  };

  const alignFlex =
    style.alignment === "left"
      ? "flex-start"
      : style.alignment === "right"
      ? "flex-end"
      : "center";

  return (
    <div className="banner-containerid">
      <div className="banner-wrapper">
        {media.map((img, i) => (
          <div key={i} className={`banner-item ${layoutClasses[i]}`}>
            <img src={img.imageUrl} className="banner-img" alt="Grid" />
          </div>
        ))}
      </div>

      {/* TEXT FROM PARENT ONLY */}
      <div
        className="banner-text-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: alignFlex,
        }}
      >
        <h3 className="banner-title" style={titleStyle}>
          {parent.title}
        </h3>

        <p className="banner-description" style={descStyle}>
          {parent.description}
        </p>
      </div>
    </div>
  );
}
