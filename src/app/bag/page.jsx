"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./bagsection.module.css";
import productImg from "../Assest/men.png"; // replace with actual image
import Link from "next/link";

export default function BagSection() {
  const [quantity, setQuantity] = useState(1);
  const price = 779;
  const discount = 0.2;
  const delivery = 15;

  const subtotal = price * 3;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + delivery;

  return (
    <>
      <section className={styles.cartContainer}>
        {/* Left side - Products */}
        <div className={styles.left}>
          {[1, 2, 3].map((item, idx) => (
            <div className={styles.cartItem} key={idx}>
              <div className={styles.itemImg}>
                <Image src={productImg} alt="Product" width={100} height={100} />
              </div>
              <div className={styles.itemInfo}>
                <h3>Womens jacket</h3>
                <p>Women Navy Blue Printed Top</p>
                <p className={styles.price}>
                  ${price} <span className={styles.oldPrice}>$1599</span> 45% OFF
                </p>
                <div className={styles.details}>
                  <span>Size: M</span>
                  <span>
                    Qty:{" "}
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </span>
                </div>
                <span className={styles.returnText}>7-day return available</span>
              </div>
              <button className={styles.deleteBtn}>🗑️</button>
            </div>
          ))}
        </div>

        {/* Right side - Order Summary */}
        <div className={styles.right}>
          <div className={styles.summaryBox}>
            <h3>Order Summary</h3>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className={`${styles.row} ${styles.discountRow}`}>
              <span>Discount (-20%)</span>
              <span>-${discountAmount}</span>
            </div>
            <div className={styles.row}>
              <span>Delivery Fee</span>
              <span>${delivery}</span>
            </div>
            <div className={`${styles.row} ${styles.totalRow}`}>
              <strong>Total</strong>
              <strong>${total}</strong>
            </div>

            <div className={styles.promo}>
              <input type="text" placeholder="Add promo code" />
              <button>Apply</button>
            </div>
<Link href="/checkout">
            <button className={styles.checkoutBtn}>Go to Checkout →</button>
             </Link>
          </div>
        </div>
      </section>

      {/* Share Button */}
      <div className={styles.shareSection}>
        <button className={styles.shareBtn}>Share</button>
      </div>
    </>
  );
}
