"use client";

import React, { useEffect, useState, useRef } from "react";
import "./Styles.css";
import Link from "next/link";
import Cookies from "js-cookie";

export default function MenPage() {

  function formatPrice(num) {
    return Number(num).toLocaleString("en-US");
  }

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  // ✅ CMS VIDEO STATE
  const [cmsVideo, setCmsVideo] = useState(null);

  const COOKIE_KEY = "women_products_cache"; // keeping your original
  const mountedRef = useRef(false);

  /* ================= ✅ MOUNT SAFETY ================= */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ================= ✅ LOAD PRODUCTS (WOMEN) ================= */
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

        const womenProducts = data.products.filter((p) =>
          p.gender?.includes("Women")
        );

        Cookies.set(COOKIE_KEY, JSON.stringify(womenProducts), {
          expires: 1,
        });

        if (mountedRef.current) setProducts(womenProducts);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    refresh();
  }, []);

  /* ================= ✅ LOAD WOMEN PAGE VIDEO ================= */
  useEffect(() => {
    async function loadVideo() {
      try {
        const cachedVideo = Cookies.get("women_page_video");
        if (cachedVideo) {
          setCmsVideo(cachedVideo);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.womenPageVideoUrl && mountedRef.current) {
          setCmsVideo(data.womenPageVideoUrl);

          Cookies.set("women_page_video", data.womenPageVideoUrl, {
            expires: 1,
          });
        }
      } catch (err) {
        console.warn("Women CMS video failed:", err);
      }
    }

    loadVideo();
  }, []);

  /* ================= ✅ IMAGE PICKER (HOVER ONLY — NO SLIDESHOW) ================= */
  const pickImage = (p) => {
    const imgs = p.gallery?.length ? p.gallery : [p.imageUrl];

    // ✅ Only change on hover
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

  /* ================= ✅ FINAL PAGE ================= */
  return (
    <section className="gallery">

      {/* ✅ FIRST 4 PRODUCTS */}
      <div className="gallery-div">
        {firstFour.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>

      {/* ✅ WOMEN PAGE CMS VIDEO */}
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
            poster="/video-poster-women.jpg"
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
