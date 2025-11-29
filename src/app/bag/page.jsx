"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./bagsection.module.css";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import PageLayout from "../components/PageLayout";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function BagSection() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Fetch cart (COOKIE AUTH)
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/api/cart`, {
        credentials: "include", // ✅ sends cookie automatically
      });

      if (!res.ok) {
        console.error("Cart fetch failed");
        setCart([]);
        return;
      }

      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update quantity (COOKIE AUTH)
  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    try {
      await fetch(`${API}/api/cart/update`, {
        method: "PUT",
        credentials: "include", // ✅ cookie auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id, quantity: qty }),
      });

      fetchCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ✅ Remove item (COOKIE AUTH)
  const removeItem = async (id) => {
    try {
      await fetch(`${API}/api/cart/remove/${id}`, {
        method: "DELETE",
        credentials: "include", // ✅ cookie auth
      });

      fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  // ✅ Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal;

  if (loading) return <p style={{ padding: 40 }}>Loading cart...</p>;

  return (
    <PageLayout>
    <>
      <section className={styles.cartContainer}>
        {/* ✅ Left Section */}
        <div className={styles.left}>
          {cart.length === 0 && <p>Your cart is empty</p>}

          {cart.map((item) => (
            <div
              className={styles.cartItem}
              key={`${item.productId}-${item.size || "default"}`}
            >
              <div className={styles.itemImg}>
                <img
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                />

              </div>

              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <p className={styles.price}>$ {item.price}</p>

                <div className={styles.details}>
                  <span>Size: {item.size || "M"}</span>
                  <span>
                    Qty:{" "}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQty(item.productId, Number(e.target.value))
                      }
                    />
                  </span>
                </div>
              </div>

              <button
                className={styles.deleteBtn}
                onClick={() => removeItem(item.productId)}
                aria-label="Remove item"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* ✅ Right Section */}
        <div className={styles.right}>
          <div className={styles.summaryBox}>
            <h3>Order Summary</h3>

            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(0)}</span>
            </div>

            <div className={`${styles.row} ${styles.totalRow}`}>
              <strong>Total</strong>
              <strong>${total.toFixed(0)}</strong>
            </div>

            <div className={styles.promo}>
              <input type="text" placeholder="Add promo code" />
              <button>Apply</button>
            </div>

            <Link href="/checkout">
              <button className={styles.checkoutBtn}>
                Go to Checkout →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Share */}
      <div className={styles.shareSection}>
        <button className={styles.shareBtn}>Share</button>
      </div>
    </>
    </PageLayout>
  );
}
