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

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ================= ✅ CATEGORY FILTER ================= */
  function filterByCategory(products, categoryName) {
    const target = categoryName.toLowerCase();

    return products.filter((p) => {
      const categoryMatch =
        p.category?.toLowerCase().includes(target) ||
        p.categories?.some((c) => c.toLowerCase().includes(target));

      if (target === "accessories") return categoryMatch;

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

        let accessoriesProducts = filterByCategory(
          data.products,
          "Accessories"
        );

        // ✅ ✅ ✅ SORT: IN-STOCK FIRST, OUT-OF-STOCK LAST
        accessoriesProducts = accessoriesProducts.sort((a, b) => {
          const aOut = Number(a.stockQuantity) <= 0;
          const bOut = Number(b.stockQuantity) <= 0;
          return aOut - bOut; // false(0) comes before true(1)
        });

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

  /* ================= ✅ LOAD ACCESSORIES PAGE VIDEO ================= */
  useEffect(() => {
    async function loadVideo() {
      try {
        const cachedVideo = Cookies.get("accessories_page_video");
        if (cachedVideo) setCmsVideo(cachedVideo);

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
            { expires: 1 }
          );
        }
      } catch (err) {
        console.warn("Accessories CMS video failed:", err);
      }
    }

    loadVideo();
  }, []);

  /* ================= ✅ IMAGE PICKER ================= */
  const pickImage = (p) => {
    const imgs = p.gallery?.length ? p.gallery : [p.imageUrl];
    if (hoveredId === p._id && imgs.length > 1) return imgs[1];
    return imgs[slideIndex % imgs.length];
  };

  /* ================= ✅ NOTIFY HANDLER ================= */
  const handleNotify = async (productId) => {
    const userRaw = localStorage.getItem("kzarre_user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const email = user?.email;

    if (!email) {
      alert("Please login to get stock notifications.");
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      const res = await fetch(`${API_URL}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("You will be notified when this product is back in stock.");
    } catch (err) {
      alert(err.message || "Notify failed");
    }
  };

  /* ================= ✅ PRODUCT CARD ================= */
  const ProductCard = ({ p }) => {
    const url = pickImage(p);
    const [loaded, setLoaded] = useState(false);

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
                className={`real-img ${loaded ? "visible" : ""}`}
                loading="lazy"
                onLoad={() => setLoaded(true)}
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
          <p className="gallery-price">$ {p.price}</p>
        </Link>
      </div>
    );
  };

  /* ================= ✅ FINAL DATA ================= */
  const firstFour = products.slice(0, 4);
  const remaining = products.slice(4);

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
              poster="/video-poster-accessories.jpg"
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

  );
}
