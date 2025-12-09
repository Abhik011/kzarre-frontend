"use client";

import React, { useEffect, useState, useRef } from "react";
import "./Styles.css";
import Link from "next/link";
import Cookies from "js-cookie";
import PageLayout from "../components/PageLayout";

export default function MenPage() {

  /* ================= ✅ PRICE FORMAT ================= */
  function formatPrice(num) {
    return Number(num).toLocaleString("en-US");
  }

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  // ✅ MEN CMS VIDEO STATE
  const [cmsVideo, setCmsVideo] = useState(null);

  const COOKIE_KEY = "men_products_cache";
  const mountedRef = useRef(false);

  /* ================= ✅ MOUNT SAFETY ================= */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ================= ✅ LOAD MEN PRODUCTS ================= */
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

        // ✅ MEN FILTER
        let menProducts = data.products.filter((p) =>
          p.gender?.includes("Men")
        );

        // ✅ ✅ ✅ OUT-OF-STOCK GOES DOWN
        menProducts = menProducts.sort((a, b) => {
          const aOut = Number(a.stockQuantity) <= 0;
          const bOut = Number(b.stockQuantity) <= 0;
          return aOut - bOut; // in-stock first
        });

        Cookies.set(COOKIE_KEY, JSON.stringify(menProducts), {
          expires: 1,
        });

        if (mountedRef.current) setProducts(menProducts);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    refresh();
  }, []);

  /* ================= ✅ LOAD MEN PAGE VIDEO ================= */
  useEffect(() => {
    async function loadVideo() {
      try {
        const cachedVideo = Cookies.get("men_page_video");
        if (cachedVideo) {
          setCmsVideo(cachedVideo);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.menPageVideoUrl && mountedRef.current) {
          setCmsVideo(data.menPageVideoUrl);

          Cookies.set("men_page_video", data.menPageVideoUrl, {
            expires: 1,
          });
        }
      } catch (err) {
        console.warn("Men CMS video failed:", err);
      }
    }

    loadVideo();
  }, []);

  /* ================= ✅ IMAGE PICKER (HOVER ONLY) ================= */
  const pickImage = (p) => {
    const imgs = p.gallery?.length ? p.gallery : [p.imageUrl];
    if (hoveredId === p._id && imgs.length > 1) return imgs[1];
    return imgs[0];
  };

  /* ================= ✅ NOTIFY HANDLER ================= */
  const handleNotify = async (productId) => {
    const email = prompt("Enter your email to get restock notification:");
    if (!email) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      const res = await fetch(`${API_URL}/api/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert(data.message);
    } catch (err) {
      alert(err.message || "Notify failed");
    }
  };

  /* ================= ✅ PRODUCT CARD ================= */
  const ProductCard = ({ p }) => {
    const url = pickImage(p);
    const isOutOfStock = Number(p.stockQuantity) <= 0;

    return (
      <div
        className="gallery-item"
        onMouseEnter={() => setHoveredId(p._id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="product-row">
          <Link href={`/product/${p._id}`}>
            <div className="img-wrapper notify-overlay-parent">
              <img
                src={url}
                alt={p.name}
                className="real-img"
                loading="lazy"
                style={{
                  filter: isOutOfStock ? "grayscale(0%)" : "none",
                  opacity: isOutOfStock ? 1 : 1,
                }}
              />

              {/* ✅ NOTIFY OVER IMAGE */}
              {isOutOfStock && (
                <button
                  onClick={() => handleNotify(p._id)}
                  className="notify-overlay-btn"
                >
                  Notify Me
                </button>
              )}
            </div>
          </Link>
        </div>

        <Link href={`/product/${p._id}`}>
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

  /* ================= ✅ FINAL MEN PAGE ================= */
  return (
    <PageLayout>
      <section className="gallery">

        <div className="gallery-div">
          {firstFour.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>

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
              poster="/video-poster-men.jpg"
              className="heritage-video"
            />
          )}
        </div>

        <div className="gallery-div">
          {remaining.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>

      </section>
    </PageLayout>
  );
}
