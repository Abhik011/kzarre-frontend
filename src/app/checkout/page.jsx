"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Checkout.module.css";
import { CheckCircle, Home, FileText, Package } from "lucide-react";
import Link from "next/link"

/**
 * Place a product image at public/images/product.jpg
 * or change src to your existing asset path (e.g. /assest/men.png).
 */

const sampleItems = [
  {
    id: 1,
    title: "Womens jacket",
    subtitle: "Women Navy Blue Printed Top",
    price: 779,
    oldPrice: 1599,
    size: "M",
    qty: 1,
    img: "/images/product.jpg",
  },
  {
    id: 2,
    title: "Womens jacket",
    subtitle: "Women Navy Blue Printed Top",
    price: 779,
    oldPrice: 1599,
    size: "M",
    qty: 1,
    img: "/images/product.jpg",
  },
  {
    id: 3,
    title: "Womens jacket",
    subtitle: "Women Navy Blue Printed Top",
    price: 779,
    oldPrice: 1599,
    size: "M",
    qty: 1,
    img: "/images/product.jpg",
  },
  {
    id: 4,
    title: "Womens jacket",
    subtitle: "Women Navy Blue Printed Top",
    price: 779,
    oldPrice: 1599,
    size: "M",
    qty: 1,
    img: "/images/product.jpg",
  },
];

const sampleAddresses = [
  {
    id: 1,
    title: "My Home",
    name: "Abhijeet kulkarni",
    address:
      "997 Jalan steff jobs street, Rawalumbu, Bekasi City, West Java 171xx Indonesia",
    postal: "92102",
    phone: "+62 1234567890",
    etaText: "Get it before 12th August",
  },
  {
    id: 2,
    title: "Office",
    name: "Abhijeet kulkarni",
    address:
      "123 Corporate Ave, Suite 45, Jakarta, Indonesia",
    postal: "90001",
    phone: "+62 987654321",
    etaText: "Get it before 13th August",
  },
  {
    id: 3,
    title: "Parents",
    name: "Abhijeet kulkarni",
    address:
      "45 Family Lane, Bandung, West Java",
    postal: "90210",
    phone: "+62 1122334455",
    etaText: "Get it before 14th August",
  },
];

export default function CheckoutPage() {
  const [items] = useState(sampleItems);
  const [addresses] = useState(sampleAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0].id);
  const discountRate = 0.2;
  const deliveryFee = 15;

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className={styles.pageWrap}>
  <div className={styles.progress}>
    {/* Progress Bar */}
    <div className={styles.progressInner}>
      <div className={styles.progressStepActive}>
        <CheckCircle size={20} />
      </div>
      <div className={styles.progressLineActive} />

      <div className={styles.progressStepActive}>
        <Home size={20} />
      </div>
      <div className={styles.progressLineActive} />

      <div className={styles.progressStep}>
        <FileText size={20} />
      </div>
      <div className={styles.progressLine} />

      <div className={styles.progressStep}>
        <Package size={20} />
      </div>
    </div>
  </div>



      <div className={styles.container}>
        {/* Left: Address selection */}
        <div className={styles.left}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Select delivery address</h2>
              <button className={styles.addNew}>+ Add new</button>
            </div>

            <div className={styles.addressList}>
              {addresses.map((addr) => {
                const selected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    className={`${styles.addressCard} ${
                      selected ? styles.addressCardSelected : ""
                    }`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <div className={styles.addressTitleRow}>
                      <div className={styles.addressTitle}>{addr.title}</div>
                      <button className={styles.editBtn}>Edit</button>
                    </div>
                    <div className={styles.addressName}>{addr.name}</div>
                    <div className={styles.addressText}>{addr.address}</div>
                    <div className={styles.addressMeta}>
                      <div>Postal Code: {addr.postal}</div>
                      <div>Phone: {addr.phone}</div>
                    </div>
                    <div className={styles.etaRow}>
                      <div className={styles.etaText}>{addr.etaText}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.nextRow}>
              <Link href="/payment"><button className={styles.nextBtn}>Next →</button></Link>
            </div>
          </div>
        </div>

        {/* Right: Summary / Cart */}
        <aside className={styles.right}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <h3>Summary</h3>
              <div className={styles.itemsCount}>{items.length} items in Bag</div>
            </div>

            <div className={styles.summaryList}>
              {items.map((it) => (
                <div key={it.id} className={styles.summaryItem}>
                  <div className={styles.thumb}>
                    <Image
                      src={it.img}
                      alt={it.title}
                      width={96}
                      height={96}
                      className={styles.productImg}
                    />
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
