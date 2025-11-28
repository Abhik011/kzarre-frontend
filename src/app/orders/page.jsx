"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Package, Settings, ShoppingCart } from "lucide-react";
import styles from "./Orders.module.css";

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [orders, setOrders] = useState([]); // ✅ FIXED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Orders Dynamically
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data.orders || data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);


  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <div className={styles.pageWrap}>
      <div className={styles.container}>
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className={styles.content}>
          <h2 className={styles.sectionTitle}>Orders</h2>

          {/* ✅ Loading */}
          {loading && <p>Loading orders...</p>}

          {/* ✅ Error */}
          {error && <p className={styles.error}>{error}</p>}

          {!loading && orders.length === 0 ? (
            <div className={styles.emptyBox}>
              <p className={styles.emptyTitle}>No orders yet</p>
              <p className={styles.emptyText}>Go to store to place an order.</p>
            </div>
          ) : (
            <div className={styles.ordersWrap}>
              {/* Filters */}
              <div className={styles.filterRow}>
                {["All", "In Progress", "Delivered", "Cancelled"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`${styles.filterBtn} ${
                      activeFilter === f ? styles.activeFilter : ""
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {/* Orders List */}
<div className={styles.ordersList}>
  {filteredOrders.map((order) => {
    const firstItem = order.items?.[0]; // ✅ get first product safely

    return (
      <Link
        key={order._id}
        href={`/orders/${order.orderId}`}
        className={styles.orderCard}
      >
        <div className={styles.statusRow}>
          <span
            className={`${styles.statusTag} ${
              styles[order.status?.replace(" ", "")]
            }`}
          >
            {order.status}
          </span>

          <span className={styles.date}>
            {new Date(order.createdAt).toDateString()}
          </span>
        </div>

        <div className={styles.orderContent}>
          <div className={styles.imageWrap}>
            <Image
              src={
                firstItem?.image ||
                "https://via.placeholder.com/100"
              }
              alt={firstItem?.name || "Product"}
              width={80}
              height={80}
              className={styles.imgs}
              unoptimized
            />
          </div>

          <div className={styles.orderInfo}>
            <p className={styles.orderId}>
              Order ID: <span>{order.orderId}</span>
            </p>

            <h4 className={styles.title}>
              {firstItem?.name}
            </h4>

            <p className={styles.desc}>
              Colour: {firstItem?.color} | Size: {firstItem?.size}
            </p>

            <p className={styles.price}>
              ${order.amount}
            </p>
          </div>
        </div>

        <div className={styles.arrow}>›</div>
      </Link>
    );
  })}
</div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
