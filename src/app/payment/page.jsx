"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Smartphone, CheckCircle, Home, FileText } from "lucide-react";
import styles from "./Payment.module.css";

/**
 * Place product image at /public/images/product.jpg
 * Optional: /public/images/stripe.png /paypal.png /apple.png
 */

const itemsSample = [
  { id: 1, title: "Womens jacket", subtitle: "Women Navy Blue Printed Top", price: 779, oldPrice: 1599, size: "M", qty: 1, img: "/images/product.jpg" },
  { id: 2, title: "Womens jacket", subtitle: "Women Navy Blue Printed Top", price: 779, oldPrice: 1599, size: "M", qty: 1, img: "/images/product.jpg" },
  { id: 3, title: "Womens jacket", subtitle: "Women Navy Blue Printed Top", price: 779, oldPrice: 1599, size: "M", qty: 1, img: "/images/product.jpg" },
  { id: 4, title: "Womens jacket", subtitle: "Women Navy Blue Printed Top", price: 779, oldPrice: 1599, size: "M", qty: 1, img: "/images/product.jpg" },
];

export default function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const discountRate = 0.2;
  const deliveryFee = 15;

  const subtotal = itemsSample.reduce((s, it) => s + it.price * it.qty, 0);
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className={styles.pageWrap}>
      {/* Progress (3rd step active) */}
      <div className={styles.progress}>
        <div className={styles.progressInner}>
          <div className={`${styles.progressStepActive}`}>
            <CheckCircle size={18} />
          </div>
          <div className={`${styles.progressLineActive}`} />
          <div className={`${styles.progressStepActive}`}>
            <Home size={18} />
          </div>
          <div className={`${styles.progressLineActive}`} />
          <div className={`${styles.progressStepActive} ${styles.iconCircle}`}>
            <FileText size={18} />
          </div>
          <div className={styles.progressLine} />
          <div className={styles.progressStep}>
            <CreditCard size={18} />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Left: Payment selection */}
        <div className={styles.left}>
          <div className={styles.card}>
            <h2 className={styles.heading}>Select payment mode</h2>

            <div className={styles.paymentList}>
              <label
                className={`${styles.paymentOption} ${selectedPayment === "stripe" ? styles.paymentSelected : ""}`}
                onClick={() => setSelectedPayment("stripe")}
              >
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={selectedPayment === "stripe"}
                  onChange={() => setSelectedPayment("stripe")}
                />
                <div className={styles.logoWrap}>
                  {/* replace with /images/stripe.png if available */}
                  <div className={styles.placeholderLogo}><span>S</span></div>
                </div>
                <div className={styles.paymentLabel}>Stripe</div>
                <div className={styles.checkbox} />
              </label>

              <label
                className={`${styles.paymentOption} ${selectedPayment === "paypal" ? styles.paymentSelected : ""}`}
                onClick={() => setSelectedPayment("paypal")}
              >
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={selectedPayment === "paypal"}
                  onChange={() => setSelectedPayment("paypal")}
                />
                <div className={styles.logoWrap}>
                  {/* replace with /images/paypal.png if available */}
                  <div className={styles.placeholderLogo}><span>P</span></div>
                </div>
                <div className={styles.paymentLabel}>Paypal</div>
                <div className={styles.checkbox} />
              </label>

              <label
                className={`${styles.paymentOption} ${selectedPayment === "apple" ? styles.paymentSelected : ""}`}
                onClick={() => setSelectedPayment("apple")}
              >
                <input
                  type="radio"
                  name="payment"
                  value="apple"
                  checked={selectedPayment === "apple"}
                  onChange={() => setSelectedPayment("apple")}
                />
                <div className={styles.logoWrap}>
                  {/* replace with /images/apple.png if available */}
                  <div className={styles.placeholderLogo}><span></span></div>
                </div>
                <div className={styles.paymentLabel}>Apple Pay</div>
                <div className={styles.checkbox} />
              </label>
            </div>

            <div className={styles.actionRow}>
            <Link href="/orcon">  <button className={styles.payBtn}>Payment →</button></Link>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <aside className={styles.right}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <h3>Summary</h3>
              <div className={styles.itemsCount}>{itemsSample.length} items in Bag</div>
            </div>

            <div className={styles.summaryList}>
              {itemsSample.map((it) => (
                <div key={it.id} className={styles.summaryItem}>
                  <div className={styles.thumb}>
                    <Image src={it.img} alt={it.title} width={96} height={96} className={styles.productImg} />
                  </div>

                  <div className={styles.summaryInfo}>
                    <div className={styles.itemTitleRow}>
                      <div>
                        <div className={styles.itemTitle}>{it.title}</div>
                        <div className={styles.itemSubtitle}>{it.subtitle}</div>
                      </div>
                      <button className={styles.removeBtn}>Remove</button>
                    </div>

                    <div className={styles.priceRow}>
                      <div className={styles.priceLarge}>${it.price}</div>
                      <div className={styles.priceOld}>${it.oldPrice}</div>
                      <div className={styles.discountSmall}>45% OFF</div>
                    </div>

                    <div className={styles.smallMeta}>
                      <span>Size: {it.size}</span>
                      <span>Qty: {String(it.qty).padStart(2, "0")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalLine}>
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className={`${styles.totalLine} ${styles.discountLine}`}>
                <span>Discount (-20%)</span>
                <span className={styles.discountValue}>-${discountAmount}</span>
              </div>
              <div className={styles.totalLine}>
                <span>Delivery Fee</span>
                <span>${deliveryFee}</span>
              </div>

              <div className={styles.grandTotal}>
                <strong>Total</strong>
                <strong>${total}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
