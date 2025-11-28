"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { User, Package, Settings, ShoppingCart } from "lucide-react";
import styles from "./OrderDetails.module.css";

export default function OrderDetailsPage() {
  const { id } = useParams(); // /orders/[id] → orderId

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH SINGLE ORDER FROM BACKEND
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

        const res = await fetch(`${API_URL}/api/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch order");

        setOrder(data.order); // ✅ { success, order }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ✅ STATES
  if (loading) return <p className={styles.loading}>Loading order...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!order) return null;

  return (
    <div className={styles.pageWrap}>
      <div className={styles.container}>
        {/* ===== SIDEBAR ===== */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <a href="/profile" className={styles.navItem}>
              <User size={18} /> My Profile
            </a>
            <a href="/orders" className={`${styles.navItem} ${styles.active}`}>
              <Package size={18} /> Orders
            </a>
            <a href="/settings" className={styles.navItem}>
              <Settings size={18} /> Settings
            </a>
            <a href="/home" className={styles.navItem}>
              <ShoppingCart size={18} /> Shop
            </a>
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className={styles.content}>
          <h2 className={styles.sectionTitle}>Order Details</h2>

          <div className={styles.detailsCard}>
            {/* ✅ TOP INFO */}
            <div className={styles.topRow}>
              <div>
                <strong>Order ID</strong>
                <p>{order.orderId}</p>
              </div>
              <div>
                <strong>Order Placed</strong>
                <p>{new Date(order.createdAt).toDateString()}</p>
              </div>
              <div>
                <strong>No of items</strong>
                <p>{order.items.length} items</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>{order.status}</p>
              </div>
            </div>

            {/* ✅ REAL STATUS TRACKING (YOUR ORIGINAL GIFs) */}
            <div className={styles.trackingHeader}>
              <h3>Order Tracking</h3>
              <p>Tracking ID: {order.barcode || "Not assigned"}</p>
            </div>

            {order.status === "cancelled" && (
              <p style={{ color: "red", fontWeight: 600, marginBottom: "10px" }}>
                ❌ This order has been cancelled
              </p>
            )}

            <div className={styles.trackingBox}>
              {[
                {
                  key: "pending",
                  label: "Order Placed",
                  icon: "/Assest/gifs/order-placed.gif",
                },
                {
                  key: "paid",
                  label: "Order Packed",
                  icon: "/Assest/gifs/package.gif",
                },
                {
                  key: "shipped",
                  label: "In Transit",
                  icon: "/Assest/gifs/truck.gif",
                },
                {
                  key: "delivered",
                  label: "Delivered",
                  icon: "/Assest/gifs/delivered.gif",
                },
              ].map((step, idx, steps) => {
                const currentIndex = steps.findIndex(
                  (s) => s.key === order.status
                );

                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={idx} className={styles.trackStep}>
                    <div className={styles.icon}>
                      <Image
                        src={step.icon}
                        alt={step.label}
                        width={55}
                        height={55}
                        unoptimized
                        style={{
                          opacity: isCompleted ? 1 : 0.3,
                          filter: isCompleted
                            ? "none"
                            : "grayscale(100%)",
                        }}
                      />
                    </div>

                    <p
                      className={styles.label}
                      style={{
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCompleted ? "#000" : "#aaa",
                      }}
                    >
                      {step.label}
                    </p>

                    {isCurrent && (
                      <p
                        className={styles.date}
                        style={{ color: "#d9c169" }}
                      >
                        Current Status
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ✅ ITEMS */}
            <div className={styles.itemsBox}>
              <h3>Items from the order</h3>

              <div className={styles.itemsHeader}>
                <span>Product</span>
                <span>Quantity</span>
                <span>Total Price</span>
              </div>

              {order.items.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className={styles.imgs}
                      unoptimized
                    />
                    <div>
                      <h4>{item.name}</h4>
                      <p>SKU: {item.sku}</p>
                      <p>
                        Size: {item.size} | Colour:{" "}
                        <strong>{item.color}</strong>
                      </p>
                      <p className={styles.expected}>
                        Payment Method:{" "}
                        <strong>{order.paymentMethod}</strong>
                      </p>
                    </div>
                  </div>

                  <div className={styles.qty}>{item.qty}</div>

                  <div className={styles.price}>
                    ${item.price * item.qty}
                    <span>including of Tax</span>
                  </div>
                </div>
              ))}

              {/* ✅ TOTAL */}
              <div className={styles.totalBox}>
                <strong>Total Amount:</strong> ${order.amount}
              </div>

              {/* ✅ SHIPPING ADDRESS */}
              <div className={styles.addressBox}>
                <h4>Shipping Address</h4>
                <p>{order.address?.name}</p>
                <p>{order.address?.phone}</p>
                <p>
                  {order.address?.city} - {order.address?.pincode}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
