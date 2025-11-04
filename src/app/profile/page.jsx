"use client";

import React, { useState } from "react";
import { User, Package, Settings, ShoppingCart, Edit } from "lucide-react";
import Link from "next/link";
import styles from "./Profile.module.css";

export default function ProfilePage() {
  const [user] = useState({
    name: "Abhijeet Kulkarni",
    email: "kulkarni@gmail.com",
  });

  const [address] = useState({
    title: "Default Address",
    name: "Abhijeet Kulkarni",
    street: "Indiabulls Green Aster CHS LTD, Swala Apta Road Panvel, Aster",
    city: "410221 Navi Mumbai, Maharashtra",
    country: "India",
    phone: "+91 7498722304",
  });

  return (
    <div className={styles.pageWrap}>
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <a href="#" className={`${styles.navItem} ${styles.active}`}>
              <User size={18} /> My Profile
            </a>
            <Link href="/orders" className={styles.navItem}>
              <Package size={18} /> Orders
            </Link>
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
          <h2 className={styles.sectionTitle}>Profile</h2>

          {/* Profile Card */}
          <div className={styles.card}>
            <div className={styles.cardRow}>
              <span className={styles.label}>
                Name <Edit size={14} className={styles.editIcon} />
              </span>
              <span className={styles.value}>{user.name}</span>
            </div>

            <div className={styles.cardRow}>
              <span className={styles.label}>
                Email <Edit size={14} className={styles.editIcon} />
              </span>
              <span className={styles.value}>{user.email}</span>
            </div>
          </div>

          {/* Address Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.label}>Addresses</span>
              <button className={styles.addBtn}>+ Add</button>
            </div>

            <div className={styles.addressSection}>
              <div className={styles.subLabel}>{address.title}</div>
              <button className={styles.editBtn}>
                <Edit size={14} />
              </button>
              <div className={styles.addressText}>
                <p>{address.name}</p>
                <p>{address.street}</p>
                <p>{address.city}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
