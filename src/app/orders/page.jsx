"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Package, Settings, ShoppingCart } from "lucide-react";
import styles from "./Orders.module.css";

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const orders = [
    {
      id: "ABC-6457325",
      status: "In Progress",
      date: "10 May 2025",
      title: "Womens Jacket",
      desc: "Women Navy Blue Printed Top | Printed black & white jacket",
      moreItems: 2,
      total: 600,
      img: "/Assest/products/Men.png",
    },
    {
      id: "ABC-6457326",
      status: "Delivered",
      date: "10 May 2025",
      title: "Womens Jacket",
      desc: "Women Navy Blue Printed Top",
      total: 200,
      img: "/Assest/products/Men.png",
    },
    {
      id: "ABC-6457327",
      status: "Cancelled",
      date: "10 May 2025",
      title: "Womens Jacket",
      desc: "Women Navy Blue Printed Top",
      total: 200,
      img: "/Assest/products/Men.png",
    },
  ];

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
            <a href="#" className={styles.navItem}>
              <Settings size={18} /> Settings
            </a>
            <a href="#" className={styles.navItem}>
              <ShoppingCart size={18} /> Shop
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          <h2 className={styles.sectionTitle}>Orders</h2>

          {orders.length === 0 ? (
            <div className={styles.emptyBox}>
              <p className={styles.emptyTitle}>No orders yet</p>
              <p className={styles.emptyText}>Go to store to place an order.</p>
            </div>
          ) : (
            <div className={styles.ordersWrap}>
              {/* Filter Tabs */}
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
                <button className={styles.dateFilter}>
                  Select date range ▾
                </button>
              </div>

              {/* Orders List */}
              <div className={styles.ordersList}>
                {filteredOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className={styles.orderCard}
                  >
                    <div className={styles.statusRow}>
                      <span
                        className={`${styles.statusTag} ${
                          styles[order.status.replace(" ", "")]
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className={styles.date}>{order.date}</span>
                    </div>

                    <div className={styles.orderContent}>
                      <div className={styles.imageWrap}>
                        <Image
                          src={order.img}
                          alt={order.title}
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className={styles.orderInfo}>
                        <p className={styles.orderId}>
                          Order ID: <span>{order.id}</span>
                        </p>
                        <h4 className={styles.title}>{order.title}</h4>
                        <p className={styles.desc}>
                          {order.desc}{" "}
                          {order.moreItems && (
                            <span className={styles.moreItems}>
                              & {order.moreItems} more items
                            </span>
                          )}
                        </p>
                        <p className={styles.price}>${order.total}</p>
                      </div>
                    </div>
                    <div className={styles.arrow}>›</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
