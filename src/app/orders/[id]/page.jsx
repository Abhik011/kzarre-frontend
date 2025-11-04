"use client";

import React from "react";
import Image from "next/image";
import { User, Package, Settings, ShoppingCart } from "lucide-react";
import styles from "./OrderDetails.module.css";

export default function OrderDetailsPage() {
  const order = {
    id: "ABC-6457325",
    trackingId: "#2235879872",
    date: "10 May 2025",
    itemsCount: 4,
    status: "In Progress",
    product: {
      title: "Womens Jacket",
      desc: "Women Navy Blue Printed Top",
      size: "M",
      color: "Black",
      qty: 2,
      price: 600,
      img: "/Assest/Men.png",
      expected: "May 13th 2025 10:00PM",
    },
  };

  const trackingSteps = [
    {
      label: "Order Placed",
      date: "May 10th 2025",
      time: "09:00 AM",
      icon: "/Assest/gifs/order-placed.gif",
    },
    {
      label: "Order Packed",
      date: "May 10th 2025",
      time: "09:30 AM",
      icon: "/Assest/gifs/package.gif",
    },
    {
      label: "In Transit",
      date: "May 11th 2025",
      time: "02:00 PM",
      icon: "/Assest/gifs/truck.gif",
    },
    {
      label: "Out for Delivery",
      date: "May 13th 2025",
      time: "05:00 PM",
      icon: "/Assest/gifs/delivery.gif",
    },
    {
      label: "Delivered",
      date: "May 13th 2025",
      time: "08:00 PM",
      icon: "/Assest/gifs/delivered.gif",
    },
  ];

  return (
    <div className={styles.pageWrap}>
      {/* Layout */}
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
          <h2 className={styles.sectionTitle}>Order Details</h2>

          <div className={styles.detailsCard}>
            {/* Top Info */}
            <div className={styles.topRow}>
              <div>
                <strong>Order ID</strong>
                <p>{order.id}</p>
              </div>
              <div>
                <strong>Order Placed</strong>
                <p>{order.date}</p>
              </div>
              <div>
                <strong>No of items</strong>
                <p>{order.itemsCount} items</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>{order.status}</p>
              </div>
            </div>

            {/* Tracking Section */}
            <div className={styles.trackingHeader}>
              <h3>Order Tracking</h3>
              <p>Tracking ID: {order.trackingId}</p>
            </div>

            <div className={styles.trackingBox}>
              {trackingSteps.map((step, idx) => (
                <div key={idx} className={styles.trackStep}>
                  <div className={styles.icon}>
                    <Image
                      src={step.icon}
                      alt={step.label}
                      width={55}
                      height={55}
                      unoptimized
                    />
                  </div>
                  <p className={styles.label}>{step.label}</p>
                  <p className={styles.date}>{step.date}</p>
                  <p className={styles.time}>{step.time}</p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div className={styles.itemsBox}>
              <h3>Items from the order</h3>
              <div className={styles.itemsHeader}>
                <span>Product</span>
                <span>Quantity</span>
                <span>Total Price</span>
              </div>

              <div className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <Image
                    src={order.product.img}
                    alt={order.product.title}
                    width={100}
                    height={100} 
                    className={styles.imgs}
                  />
                  <div>
                    <h4>{order.product.title}</h4>
                    <p>{order.product.desc}</p>
                    <p>
                      Size: {order.product.size} | Colour:{" "}
                      <strong>{order.product.color}</strong>
                    </p>
                    <p className={styles.expected}>
                      Expected Delivery:{" "}
                      <strong>{order.product.expected}</strong>
                    </p>
                  </div>
                </div>
                <div className={styles.qty}>{order.product.qty}</div>
                <div className={styles.price}>
                  ${order.product.price}
                  <span>including of Tax</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
