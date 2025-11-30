"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./product.css";
import { addToCart } from "../../utils/addToCart";
import PageLayout from "../../components/PageLayout";

/* ==================== HELPERS ==================== */
function formatPrice(num) {
  return Number(num).toLocaleString("en-US");
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { __raw: text };
  }
}

export default function ProductPage() {
  const pathname = usePathname();

  const id = useMemo(() => {
    if (!pathname) return null;
    const p = pathname.replace(/\/$/, "").split("/");
    return p[p.length - 1];
  }, [pathname]);

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  /* ✅ IMAGE INDEX */
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ✅ SCROLL DELAY LOCK */
  const scrollLock = useRef(false);

  /* ✅ VERTICAL TOUCH SWIPE */
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (scrollLock.current) return;
    scrollLock.current = true;

    const diff =
      touchStartY.current -
      e.changedTouches[0].clientY;

    if (!product?.gallery?.length) return;

    if (diff > 50) {
      setCurrentIndex((p) => (p + 1) % product.gallery.length);
    } else if (diff < -50) {
      setCurrentIndex(
        (p) => (p - 1 + product.gallery.length) % product.gallery.length
      );
    }

    setTimeout(() => {
      scrollLock.current = false;
    }, 700);
  };

  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) return alert("Please select a size");
    if (!selectedColor) return alert("Please select a color");

    setAdding(true);

    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.imageUrl || product.gallery?.[0],
      size: selectedSize,
      color: selectedColor,
      qty: 1,
    };

    await addToCart(cartProduct);
    setAdding(false);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return alert("Please select a size");
    if (!selectedColor) return alert("Please select a color");

    const url = `/checkout?product=${product._id}&qty=1&size=${encodeURIComponent(
      selectedSize
    )}&color=${encodeURIComponent(selectedColor)}`;

    window.location.href = url;
  };

  /* ✅ LUXURY POPUP STATE */
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  /* ==================== ✅ NOTIFY HANDLER (AUTO + LOCKED) ==================== */
  const handleNotify = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      const userRaw = localStorage.getItem("kzarre_user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      const userEmail = user?.email;

      if (!userEmail) {
        setPopup({
          show: true,
          message: "Please login to get stock notifications.",
          type: "error",
        });
        return;
      }

      // ✅ BLOCK IF ALREADY SUBSCRIBED
      if (subscribed) {
        setPopup({
          show: true,
          message: "You are already subscribed for this product.",
          type: "success",
        });
        return;
      }

      const res = await fetch(`${API_URL}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          email: userEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ SAVE LOCAL SUBSCRIPTION FLAG
      localStorage.setItem(`notify_${product._id}`, "true");
      setSubscribed(true);

      setPopup({
        show: true,
        message: "You will be notified when this product is back in stock.",
        type: "success",
      });
    } catch (err) {
      setPopup({
        show: true,
        message: err.message || "Notify failed",
        type: "error",
      });
    }

    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 3000);
  };

  /* ==================== FETCH PRODUCT ==================== */
  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/products/${id}`
      );
      const parsed = await safeJson(res);

      if (!res.ok || !parsed.product) return alert("Product not found.");

      const data = parsed.product;

      const normalized = {
        _id: data._id,
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice || null,
        gallery: Array.isArray(data.gallery)
          ? data.gallery
          : [data.imageUrl],
        imageUrl: data.imageUrl,
        variants: data.variants || [],
        category: data.category,
        stockQuantity: data.stockQuantity,
        inStock: data.inStock,
      };

      setProduct(normalized);
      setCurrentIndex(0);

      // ✅ LOAD SUBSCRIBED STATE
      const notifyKey = `notify_${data._id}`;
      const alreadySubscribed = localStorage.getItem(notifyKey);
      if (alreadySubscribed === "true") {
        setSubscribed(true);
      } else {
        setSubscribed(false);
      }

      const sizes = [
        ...new Set(normalized.variants.map((v) => v.size).filter(Boolean)),
      ];
      const colors = [
        ...new Set(normalized.variants.map((v) => v.color).filter(Boolean)),
      ];

      setSelectedSize(sizes[0] || "");
      setSelectedColor(colors[0] || "");

      setLoading(false);
    }

    load();
  }, [id]);

  /* ==================== ✅ FETCH SIMILAR ==================== */
  useEffect(() => {
    if (!product?.category) return;

    async function loadSimilarByCategory() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/products`
      );
      const data = await safeJson(res);

      if (!data?.products) return;

      const related = data.products
        .filter(
          (p) => p.category === product.category && p._id !== product._id
        )
        .slice(0, 8);

      setSimilar(related);
    }

    loadSimilarByCategory();
  }, [product]);

  if (!product) return <div className="loading">Loading…</div>;

  const priceNow =
    product.discountPrice && product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  const isOutOfStock = Number(product.stockQuantity) <= 0;

  return (
    <PageLayout>
      <main className="product-page">
        <div className="product-top">
          <div className="gallery-col">
            <div
              className="main-image luxury-scroll"
              onWheel={(e) => {
                e.preventDefault();
                if (!product.gallery.length) return;
                if (scrollLock.current) return;

                scrollLock.current = true;

                setCurrentIndex((prev) => {
                  if (e.deltaY > 0) {
                    return (prev + 1) % product.gallery.length;
                  } else {
                    return (
                      (prev - 1 + product.gallery.length) %
                      product.gallery.length
                    );
                  }
                });

                setTimeout(() => {
                  scrollLock.current = false;
                }, 700);
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* ✅ GRAYSCALE WHEN OUT OF STOCK */}
              <img
                src={product.gallery[currentIndex]}
                alt={product.name}
                className="luxury-img"
                style={{
                  filter: isOutOfStock ? "grayscale(100%)" : "none",
                  opacity: isOutOfStock ? 0.6 : 1,
                }}
              />
            </div>
          </div>

          {/* ================= RIGHT INFO ================= */}
          <aside className="info-col">
            <h1 className="product-title">{product.name}</h1>
            <p className="subtitle">{product.description}</p>

            <div className="price-current">
              $ {formatPrice(priceNow)}
            </div>

            {/* ✅ ACTIONS — STOCK AWARE */}
            <div className="actions">
              {!isOutOfStock ? (
                <>
                  <button className="btn primary" onClick={handleBuyNow}>
                    Buy Now
                  </button>

                  <button
                    className="btn outline"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    Cart
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn outline"
                    onClick={handleNotify}
                    disabled={subscribed}
                    style={{
                      opacity: subscribed ? 0.5 : 1,
                      cursor: subscribed ? "not-allowed" : "pointer",
                    }}
                  >
                    {subscribed ? "Subscribed" : "Notify Me"}
                  </button>

                  <p style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>
                    This product is currently out of stock
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>

        {/* =================== ✅ SIMILAR PRODUCTS =================== */}
        {similar.length > 0 && (
          <section className="similar-section">
            <h2>Similar Products</h2>
            <div className="similar-grid">
              {similar.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p._id}`}
                  className="card"
                >
                  <div className="card-image">
                    <img
                      src={p.imageUrl || p.gallery?.[0]}
                      alt={p.name}
                    />
                  </div>
                  <div className="card-body">
                    <div className="card-title">{p.name}</div>
                    <div className="card-price">${p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ✅ LUXURY POPUP */}
      {popup.show && (
        <div className="luxury-popup-overlay">
          <div className={`luxury-popup ${popup.type}`}>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
