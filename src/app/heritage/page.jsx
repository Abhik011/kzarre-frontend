"use client";

import React, { useEffect, useState, useRef } from "react";
import "./Styles.css";
import Link from "next/link";
import Cookies from "js-cookie";

export default function HeritagePage() {

  function formatPrice(num) {
    return Number(num).toLocaleString("en-US");
  }

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  // ✅ CMS VIDEO STATE
  const [cmsVideo, setCmsVideo] = useState(null);

  const COOKIE_KEY = "Heritage_products_cache";
  const mountedRef = useRef(false);

  /* ================= ✅ MOUNT SAFETY ================= */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ================= ✅ CATEGORY FILTER (NO UNISEX) ================= */
  function filterByCategory(products, categoryName) {
    const target = categoryName.toLowerCase();

    return products.filter((p) => {
      const categoryMatch =
        p.category?.toLowerCase().includes(target) ||
        p.categories?.some((c) => c.toLowerCase().includes(target));

      if (target === "heritage") return categoryMatch;

      const isUnisex = Array.isArray(p.gender)
        ? p.gender.some((g) => g.toLowerCase().includes("unisex"))
        : p.gender?.toLowerCase().includes("unisex");

      return categoryMatch && !isUnisex;
    });
  }

  /* ================= ✅ LOAD PRODUCTS ================= */
  useEffect(() => {
    const cached = Cookies.get(COOKIE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProducts(parsed);
      } catch {}
    }

    async function refresh() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/products`
        );

        const data = await res.json();

        const heritageProducts = filterByCategory(
          data.products,
          "heritage"
        );

        Cookies.set(COOKIE_KEY, JSON.stringify(heritageProducts), {
          expires: 1,
        });

        if (mountedRef.current) setProducts(heritageProducts);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    refresh();
  }, []);

  /* ================= ✅ LOAD HERITAGE PAGE VIDEO ================= */
  useEffect(() => {
    async function loadVideo() {
      try {
        const cachedVideo = Cookies.get("heritage_page_video");
        if (cachedVideo) {
          setCmsVideo(cachedVideo);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.heritageVideoUrl && mountedRef.current) {
          setCmsVideo(data.heritageVideoUrl);

          Cookies.set(
            "heritage_page_video",
            data.heritageVideoUrl,
            { expires: 1 }
          );
        }
      } catch (err) {
        console.warn("Heritage CMS video failed:", err);
      }
    }

    loadVideo();
  }, []);

  /* ================= ✅ IMAGE PICKER (HOVER ONLY — NO SLIDESHOW) ================= */
  const pickImage = (p) => {
    const imgs = p.gallery?.length ? p.gallery : [p.imageUrl];

    // ✅ Only swap on hover
    if (hoveredId === p._id && imgs.length > 1) {
      return imgs[1];
    }

    // ✅ Always main image
    return imgs[0];
  };

  /* ================= ✅ PRODUCT CARD ================= */
  const ProductCard = ({ p }) => {
    const url = pickImage(p);
    const [loaded, setLoaded] = useState(false);

    return (
      <div
        className="gallery-item"
        onMouseEnter={() => setHoveredId(p._id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <Link href={`/product/${p._id}`}>
          <div className="img-wrapper">
            <img
              src={url}
              alt={p.name}
              className={`real-img ${loaded ? "visible" : ""}`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
          </div>

          <p className="gallery-title">{p.name}</p>
          <p className="gallery-price">$ {formatPrice(p.price)}</p>
        </Link>
      </div>
    );
  };

  /* ================= ✅ FINAL DATA ================= */
  const firstFour = products.slice(0, 4);
  const remaining = products.slice(4);

  /* ================= ✅ SKELETON LOADER ================= */
  if (loading) {
    return (
      <section className="gallery">
        <div className="gallery-div">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-text" />
                <div className="skeleton-text small" />
              </div>
            ))}
        </div>
      </section>
    );
  }

  /* ================= ✅ FINAL HERITAGE PAGE ================= */
  return (
    <section className="gallery">

      {/* ✅ FIRST 4 PRODUCTS */}
      <div className="gallery-div">
        {firstFour.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>

      {/* ✅ HERITAGE PAGE CMS VIDEO */}
      <div className="gallery-video">
        {cmsVideo && (
          <video
            src={cmsVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            fetchPriority="high"
            poster="/video-poster-Heritage.jpg"
            className="heritage-video"
          />
        )}
      </div>

      {/* ✅ REMAINING PRODUCTS */}
      <div className="gallery-div">
        {remaining.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>

    </section>
  );
}
