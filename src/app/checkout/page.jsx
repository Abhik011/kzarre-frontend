"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Checkout.module.css";
import { CheckCircle, Home, FileText, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const search = useSearchParams();

  // Product params from URL
  const productId = search.get("product");
  const sizeFromUrl = search.get("size") || "";
  const colorFromUrl = search.get("color") || "";

  const [qty, setQty] = useState(Number(search.get("qty") || 1));
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // USER TOKEN (for protected endpoints)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("kzarre_token") || "" : "";

  // ADDRESS STATES
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    title: "",
    name: "",
    line1: "",
    pincode: "",
    phone: "",
    city: "",
    state: "",
  });

  // Toast / popup (simple)
  const [message, setMessage] = useState(null);
  function showMessage(txt) {
    setMessage(txt);
    setTimeout(() => setMessage(null), 3000);
  }

  /* ============================================================
      FETCH USER ADDRESSES
  ============================================================ */
  useEffect(() => {
    async function loadAddresses() {
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/address/list`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const data = await res.json();
        if (data.success) {
          setAddresses(data.addresses || []);
          if ((data.addresses || []).length) {
            setSelectedAddressId(data.addresses[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    }

    loadAddresses();
  }, [token]);

  /* ============================================================
      FETCH PRODUCT
  ============================================================ */
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/products/${productId}`
        );

        const data = await res.json();
        setProduct(data.product || null);
      } catch (err) {
        console.error("Failed to load product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (productId) loadProduct();
    else setLoading(false);
  }, [productId]);

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!product) return <div className={styles.loading}>Product not found.</div>;

  /* ============================================================
      SAVE NEW ADDRESS
  ============================================================ */
  async function saveNewAddress() {
    const token2 = typeof window !== "undefined" ? localStorage.getItem("kzarre_token") || "" : "";
    if (!token2) {
      showMessage("Please login first");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/address/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token2 ? { Authorization: `Bearer ${token2}` } : {}),
          },
          body: JSON.stringify(newAddress),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showMessage("Failed to add address: " + (data.message || "Unknown"));
        return;
      }

      setAddresses((prev) => [...prev, data.address]);
      setSelectedAddressId(data.address._id);
      setShowAddForm(false);

      // Reset form
      setNewAddress({
        title: "",
        name: "",
        line1: "",
        pincode: "",
        phone: "",
        city: "",
        state: "",
      });

      showMessage("Address saved");
    } catch (err) {
      console.error("saveNewAddress error", err);
      showMessage("Failed to add address");
    }
  }

  /* ============================================================
      CREATE ORDER → GO TO PAYMENT
      (Sends userId & email so order.userId is set)
  ============================================================ */
  async function handleNext() {
    const addr = addresses.find((a) => a._id === selectedAddressId);
    if (!addr) return alert("Please select an address");

    // get userId + email from localStorage (browser-only)
    const userId = typeof window !== "undefined" ? localStorage.getItem("kzarre_user_id") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("kzarre_remember_email") : null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/checkout/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            userId,
            email,
            productId,
            qty,
            size: sizeFromUrl,
            color: colorFromUrl,
            address: {
              name: addr.name,
              phone: addr.phone,
              pincode: addr.pincode,
              line1: addr.line1,
              city: addr.city,
              state: addr.state,
            },
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert("Order failed: " + (data.message || "Unknown error"));
        return;
      }

      // redirect to payment with ORDER ID (readable: ORD-xxxxxx)
      window.location.href = `/payment?order=${encodeURIComponent(data.orderId)}`;
    } catch (err) {
      console.error("create-order error", err);
      alert("Order failed (network)");
    }
  }

  /* ============================================================
      COMPUTE TOTALS (No discount)
  ============================================================ */

  const price = product.price;
  const subtotal = price * qty;
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  /* ============================================================
      JSX
  ============================================================ */

  return (
    <div className={styles.pageWrap}>
      {/* PROGRESS BAR */}
      <div className={styles.progress}>
        <div className={styles.progressInner}>
          <div className={styles.progressStepActive}><CheckCircle /></div>
          <div className={styles.progressLineActive} />
          <div className={styles.progressStepActive}><Home /></div>
          <div className={styles.progressLineActive} />
          <div className={styles.progressStep}><FileText /></div>
          <div className={styles.progressLine} />
          <div className={styles.progressStep}><Package /></div>
        </div>
      </div>

      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.left}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Select delivery address</h2>
              <button className={styles.addNew} onClick={() => setShowAddForm(true)}>
                + Add New
              </button>
            </div>

            {/* Address List */}
            <div className={styles.addressList}>
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`${styles.addressCard} ${
                    selectedAddressId === addr._id ? styles.addressCardSelected : ""
                  }`}
                  onClick={() => setSelectedAddressId(addr._id)}
                >
                  <div className={styles.addressTitleRow}>
                    <div className={styles.addressTitle}>{addr.title}</div>
                  </div>

                  <div className={styles.addressName}>{addr.name}</div>
                  <div className={styles.addressText}>{addr.line1}</div>

                  <div className={styles.addressMeta}>
                    <span>Pincode: {addr.pincode}</span>
                    <span>Phone: {addr.phone}</span>
                  </div>
                </div>
              ))}

              {addresses.length === 0 && (
                <div className={styles.emptyAddresses}>No saved addresses — please add one.</div>
              )}
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className={styles.addForm}>
                <input
                  placeholder="Title"
                  value={newAddress.title}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, title: e.target.value })
                  }
                />
                <input
                  placeholder="Name"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                />
                <input
                  placeholder="Full Address"
                  value={newAddress.line1}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, line1: e.target.value })
                  }
                />
                <input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  placeholder="Postal Code"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                />
                <input
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />

                <button className={styles.saveBtn} onClick={saveNewAddress}>
                  Save Address
                </button>
              </div>
            )}

            <div className={styles.nextRow}>
              <button onClick={handleNext} className={styles.nextBtn}>
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className={styles.right}>
          <div className={styles.summaryCard}>
            <h3>Summary</h3>

            <div className={styles.summaryList}>
              <div className={styles.summaryItem}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={80}
                  height={80}
                />
                <div>
                  <div className={styles.itemTitle}>{product.name}</div>

                  <div className={styles.qtyRow}>
                    <span>Size: {sizeFromUrl}</span>

                    <div className={styles.qtyControls}>
                      <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => setQty(qty + 1)}>+</button>
                    </div>
                  </div>

                  <div className={styles.priceLarge}>₹{product.price}</div>
                </div>
              </div>
            </div>

            <div className={styles.summaryTotals}>
              <div>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div>
                <span>Delivery</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className={styles.grandTotal}>
                <strong>Total</strong>
                <strong>₹{total}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* simple toast */}
      {message && <div className={styles.simpleToast}>{message}</div>}
    </div>
  );
}
