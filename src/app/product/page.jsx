"use client";
import React, { useState } from "react";
import "./product.css";

/**
 * Example product page. Replace images and data with real props / fetch.
 * Place assets in /public/Assest/
 *
 * Example images used:
 *  - /Assest/product-large.jpg
 *  - /Assest/thumb-1.jpg
 *  - /Assest/thumb-2.jpg
 *  - /Assest/thumb-3.jpg
 *  - /Assest/sim1.jpg ... sim4.jpg
 */

const thumbnails = [
  "../Assest/tham-img.png",
  "/Assest/men.png",
  "/Assest/men.png",
  "/Assest/men.png",
];

const similar = [
  {
    id: 1,
    src: "/Assest/w-img.png",
    title: "La Zoire",
    price: "₹879",
    old: "₹1599",
  },
  {
    id: 2,
    src: "/Assest/M-img.png",
    title: "Roadster",
    price: "₹399",
    old: "₹999",
  },
  {
    id: 3,
    src: "/Assest/g-img5.png",
    title: "Kassually",
    price: "₹491",
    old: "₹1199",
  },
  {
    id: 4,
    src: "/Assest/A-img.png",
    title: "Here&now",
    price: "₹524",
    old: "₹1499",
  },
];

export default function ProductPage() {
  const [selectedThumb, setSelectedThumb] = useState("/Assest/tham-img.png");
  const [size, setSize] = useState("L");
  const [pincode, setPincode] = useState("");
  const [accordionOpen, setAccordionOpen] = useState({
    details: false,
    specs: false,
    photos: false,
  });

  const toggleAccordion = (key) =>
    setAccordionOpen((s) => ({ ...s, [key]: !s[key] }));

  const addToCart = () => {
    // replace with actual add-to-cart logic
    alert("Added to cart (demo)");
  };

  const checkPincode = () => {
    // replace with delivery check API
    alert(pincode ? `Delivery available for ${pincode}` : "Enter a PIN code");
  };

  return (
    <main className="product-page">
      <div className="product-top">
        <div className="gallery-col">
          <div className="thumbs">
            {thumbnails.map((t, i) => (
              <button
                key={i}
                className={`thumb-btn ${selectedThumb === t ? "active" : ""}`}
                onClick={() => setSelectedThumb(t)}
                aria-label={`Thumbnail ${i + 1}`}
              >
                <img src={t} alt={`thumb-${i + 1}`} />
              </button>
            ))}
            <div className="thumb-spacer" />
          </div>

          <div className="main-image">
            <img src={selectedThumb} alt="Product large" />
          </div>
        </div>

        <aside className="info-col">
          <div className="breadcrumbs">
            Home &gt; Women &gt; Top &gt; Here&now
          </div>

          <h1 className="product-title">Here&amp;Now</h1>
          <div className="rating">
            ★ ★ ★ ★ ☆ &nbsp; 82 Reviews &nbsp; <a href="#">Write a Review</a>
          </div>
          <p className="subtitle">Women Navy Blue Printed Top</p>

          <div className="price-block">
            <div className="price-current">₹524</div>
            <div className="price-old">₹1499</div>
            <div className="price-save">(₹975 OFF)</div>
            <div className="price-note">Inclusive of all taxes</div>
          </div>

          <div className="color-size">
            <div className="color-chooser">
              <label>More Color</label>
              <div className="color-thumbs">
                <div
                  className="color-option"
                  style={{ backgroundColor: "#8B4513" }}
                ></div>
                <div
                  className="color-option"
                  style={{ backgroundColor: "#2F4F4F" }}
                ></div>
                <div
                  className="color-option"
                  style={{ backgroundColor: "#C0C0C0" }}
                ></div>
              </div>
            </div>

            <div className="size-chooser">
              <label>Select Size</label>
              <div className="sizes">
                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${size === s ? "selected" : ""}`}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="actions">
            <button
              className="btn primary"
              onClick={() => alert("Buy Now demo")}
            >
              Buy Now
            </button>
            <button className="btn outline" onClick={addToCart}>
              Add to Cart
            </button>
            <button className="btn ghost" title="Add to wishlist">
              ♡
            </button>
          </div>

          <div className="delivery">
            <label>Delivery Options</label>
            <div className="pincode">
              <input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button onClick={checkPincode}>Check</button>
            </div>

            <ul className="delivery-info">
              <li>100% Original Products</li>
              <li>Pay on delivery might be available</li>
              <li>Easy 14 days returns and exchanges</li>
              <li>Try & Buy might be available</li>
            </ul>
          </div>

          <div className="accordion">
            <button
              className="acc-toggle"
              onClick={() => toggleAccordion("details")}
            >
              Products Details <span>{accordionOpen.details ? "-" : "+"}</span>
            </button>
            {accordionOpen.details && (
              <div className="acc-body">
                <p>
                  Detailed product description goes here. Replace with real
                  content.
                </p>
              </div>
            )}

            <button
              className="acc-toggle"
              onClick={() => toggleAccordion("specs")}
            >
              Specifications <span>{accordionOpen.specs ? "-" : "+"}</span>
            </button>
            {accordionOpen.specs && (
              <div className="acc-body">
                <ul>
                  <li>Material: 100% Cotton</li>
                  <li>Care: Hand wash / dry clean</li>
                </ul>
              </div>
            )}

            <button
              className="acc-toggle"
              onClick={() => toggleAccordion("photos")}
            >
              Customer Photos <span>{accordionOpen.photos ? "-" : "+"}</span>
            </button>
            {accordionOpen.photos && (
              <div className="acc-body">
                <p>Customer photos / gallery</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="similar-section">
        <h2>Similar Products</h2>
        <div className="similar-grid">
          {similar.map((p) => (
            <div key={p.id} className="card">
              <div className="card-image">
                <img src={p.src} alt={p.title} />
              </div>
              <div className="card-body">
                <div className="card-title">{p.title}</div>
                <div className="card-price">
                  <span className="now">{p.price}</span>{" "}
                  <span className="old">{p.old}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
