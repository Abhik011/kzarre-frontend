"use client";

import React from "react";
import { User, Package, Settings, ShoppingCart, Lock } from "lucide-react";
import styles from "./Settings.module.css";

export default function SettingsPage() {
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
            <a href="/orders" className={styles.navItem}>
              <Package size={18} /> Orders
            </a>
            <a href="/settings" className={`${styles.navItem} ${styles.active}`}>
              <Settings size={18} /> Settings
            </a>
            <a href="/home" className={styles.navItem}>
              <ShoppingCart size={18} /> Shop
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          <h2 className={styles.sectionTitle}>Settings</h2>

          <div className={styles.card}>
            <div className={styles.cardLeft}>
              <Lock size={20} className={styles.icon} />
              <div>
                <h4 className={styles.cardTitle}>Sign out everywhere</h4>
                <p className={styles.cardText}>
                  If you’ve lost a device or have security concerns, log out
                  everywhere to ensure the security of your account.
                </p>
              </div>
            </div>

            <div className={styles.cardRight}>
              <button className={styles.signOutBtn}>Sign out</button>
              <p className={styles.note}>
                You’ll also be signed out on this device
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
