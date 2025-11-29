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
      // ✅ Swipe UP → Next image
      setCurrentIndex(
        (p) => (p + 1) % product.gallery.length
      );
    } else if (diff < -50) {
      // ✅ Swipe DOWN → Previous image
      setCurrentIndex((p) =>
        (p - 1 + product.gallery.length) %
        product.gallery.length
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

  if (!selectedSize)
    return alert("Please select a size");
  if (!selectedColor)
    return alert("Please select a color");

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
    if (!selectedSize)
      return alert("Please select a size");
    if (!selectedColor)
      return alert("Please select a color");

    const url = `/checkout?product=${
      product._id
    }&qty=1&size=${encodeURIComponent(
      selectedSize
    )}&color=${encodeURIComponent(
      selectedColor
    )}`;

    window.location.href = url;
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

      if (!res.ok || !parsed.product)
        return alert("Product not found.");

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
      };

      setProduct(normalized);
      setCurrentIndex(0);

      const sizes = [
        ...new Set(
          normalized.variants
            .map((v) => v.size)
            .filter(Boolean)
        ),
      ];
      const colors = [
        ...new Set(
          normalized.variants
            .map((v) => v.color)
            .filter(Boolean)
        ),
      ];

      setSelectedSize(sizes[0] || "");
      setSelectedColor(colors[0] || "");

      setLoading(false);
    }

    load();
  }, [id]);

  /* ==================== ✅ FETCH SIMILAR BY CATEGORY ==================== */
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
          (p) =>
            p.category === product.category &&
            p._id !== product._id
        )
        .slice(0, 8);

      setSimilar(related);
    }

    loadSimilarByCategory();
  }, [product]);

  if (!product)
    return <div className="loading">Loading…</div>;

  const sizes = [
    ...new Set(
      product.variants
        .map((v) => v.size)
        .filter(Boolean)
    ),
  ];

  const colors = [
    ...new Set(
      product.variants
        .map((v) => v.color)
        .filter(Boolean)
    ),
  ];

  const priceNow =
    product.discountPrice &&
    product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  return (
    <PageLayout>
    <main className="product-page">
      <div className="product-top">
        {/* =================== ✅ VERTICAL IMAGE SCROLL =================== */}
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
                  // ✅ Scroll DOWN → Next
                  return (
                    (prev + 1) %
                    product.gallery.length
                  );
                } else {
                  // ✅ Scroll UP → Previous
                  return (
                    (prev - 1 +
                      product.gallery.length) %
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
            <img
              src={product.gallery[currentIndex]}
              alt={product.name}
              className="luxury-img"
            />

            {/* ✅ GOLD PROGRESS LINE */}
            <div className="luxury-line">
              <div
                className="luxury-line-fill"
                style={{
                  height: `${
                    ((currentIndex + 1) /
                      product.gallery.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* =================== RIGHT INFO =================== */}
        <aside className="info-col">
          <h1 className="product-title">
            {product.name}
          </h1>

          <p className="subtitle">
            {product.description}
          </p>

          <div className="price-current">
            $ {formatPrice(priceNow)}
          </div>

          {/* COLORS */}
          <div className="color-box-list">
            {colors.map((c) => (
              <button
                key={c}
                className={`color-box ${
                  selectedColor === c ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedColor(c)
                }
              >
                <div
                  className="color-fill"
                  style={{ background: c }}
                ></div>
              </button>
            ))}
          </div>

          {/* SIZES */}
          <div className="sizes">
            {sizes.map((s) => (
              <button
                key={s}
                className={`size-btn ${
                  selectedSize === s
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedSize(s)
                }
              >
                {s}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="actions">
            <button
              className="btn primary"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button className="btn outline"  
            onClick={handleAddToCart}
            disabled={adding}>
              Cart
            </button>
          </div>
        </aside>
      </div>

      {/* =================== ✅ SIMILAR BY CATEGORY =================== */}
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
                  <div className="card-title">
                    {p.name}
                  </div>
                  <div className="card-price">
                    ${p.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
    </PageLayout>
  );
}
