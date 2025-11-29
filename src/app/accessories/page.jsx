"use client";

import React, { useEffect, useState, useRef } from "react";
import "./Styles.css";
import Link from "next/link";
import Cookies from "js-cookie";
import PageLayout from "../components/PageLayout";

export default function AccessoriesPage() {

  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [slideIndex, setSlideIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);

  // ✅ CMS VIDEO STATE
  const [cmsVideo, setCmsVideo] = useState(null);

  const SLIDE_INTERVAL = 2500;
  const COOKIE_KEY = "accessories_products_cache";

  // ✅ Prevent state update after unmount
const mountedRef = useRef(false);

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

    // ✅ ALLOW UNISEX FOR ACCESSORIES
    if (target === "accessories") return categoryMatch;

    // ❌ BLOCK UNISEX FOR MEN / WOMEN / HERITAGE
    const isUnisex = Array.isArray(p.gender)
      ? p.gender.some((g) => g.toLowerCase().includes("unisex"))
      : p.gender?.toLowerCase().includes("unisex");

    return categoryMatch && !isUnisex;
  });
}


  /* ================= ✅ LOAD PRODUCTS (COOKIE → API REFRESH) ================= */
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

        // ✅ ACCESSORIES FILTER
        const accessoriesProducts = filterByCategory(
          data.products,
          "Accessories"
        );

        Cookies.set(COOKIE_KEY, JSON.stringify(accessoriesProducts), {
          expires: 1,
        });

        if (mountedRef.current) setProducts(accessoriesProducts);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    refresh();
  }, []);

  /* ================= ✅ LOAD ACCESSORIES PAGE VIDEO (COOKIE → CMS REFRESH) ================= */
  useEffect(() => {
    async function loadVideo() {
      try {
        // ✅ 1. Instant Cookie Load
        const cachedVideo = Cookies.get("accessories_page_video");
        if (cachedVideo) {
          setCmsVideo(cachedVideo);
        }

        // ✅ 2. Always Refresh from CMS
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.accessoriesVideoUrl && mountedRef.current) {
          setCmsVideo(data.accessoriesVideoUrl);

          Cookies.set(
            "accessories_page_video",
            data.accessoriesVideoUrl,
            {
              expires: 1,
            }
          );
        }
      } catch (err) {
        console.warn("Accessories CMS video failed:", err);
      }
    }

    loadVideo();
  }, []);

  /* ================= ✅ SLIDESHOW ROTATION ================= */
  // useEffect(() => {
  //   const t = setInterval(
  //     () => setSlideIndex((i) => i + 1),
  //     SLIDE_INTERVAL
  //   );
  //   return () => clearInterval(t);
  // }, []);

  /* ================= ✅ IMAGE PICKER (HOVER + SLIDESHOW) ================= */
  const pickImage = (p) => {
    const imgs = p.gallery?.length ? p.gallery : [p.imageUrl];
    if (hoveredId === p._id && imgs.length > 1) return imgs[1];
    return imgs[slideIndex % imgs.length];
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
          <p className="gallery-price">$ {p.price}</p>
        </Link>
      </div>
    );
  };

  /* ================= ✅ FINAL DATA ================= */
  const firstFour = products.slice(0, 4);
  const remaining = products.slice(4);

  // ✅ ✅ WHITE SCREEN FIX — NEVER SHOW EMPTY PAGE
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

  return (
      <PageLayout>
    <section className="gallery">
      {/* ✅ FIRST 4 PRODUCTS */}
      <div className="gallery-div">
        {firstFour.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>

      {/* ✅ ACCESSORIES PAGE CMS VIDEO */}
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
           
            poster="/video-poster-accessories.jpg"
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
    </PageLayout>
  );
}
