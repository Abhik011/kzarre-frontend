"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { User, Package, Settings, ShoppingCart } from "lucide-react";
import styles from "./OrderDetails.module.css";
import PageLayout from "../../components/PageLayout";
import Link from "next/link";


export default function OrderDetailsPage() {
  const { id } = useParams(); // /orders/[id] → orderId

const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

      setOrder(data.order);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [id]);


  // ✅ CANCEL ORDER
const handleCancelOrder = async () => {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    setActionLoading(true);
    setSuccessMsg("");

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const res = await fetch(`${API_URL}/api/orders/cancel/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to cancel order");

    setOrder(data.order);
    setSuccessMsg("✅ Order cancelled successfully");
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Cancel failed");
    }
  } finally {
    setActionLoading(false);
  }
};

interface OrderItem {
  image: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  qty: number;
  price: number;
}

interface Order {
  orderId: string;
  createdAt: string;
  status: string;
  barcode?: string;
  paymentMethod: string;
  amount: number;
  items: OrderItem[];
  address?: {
    name: string;
    phone: string;
    city: string;
    pincode: string;
  };
}


  // ✅ RETURN ORDER
const handleReturnOrder = async () => {
  if (!confirm("Do you want to return this order?")) return;

  try {
    setActionLoading(true);
    setSuccessMsg("");

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const res = await fetch(`${API_URL}/api/orders/return/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to return order");

    setOrder(data.order);
    setSuccessMsg("✅ Return request placed successfully");
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Return failed");
    }
  } finally {
    setActionLoading(false);
  }
};


  // ✅ STATES
  if (loading) return <p className={styles.loading}>Loading order...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!order) return null;

  return (
    <PageLayout>
      <div className={styles.pageWrap}>
        <div className={styles.container}>
          {/* ===== SIDEBAR ===== */}
        <aside className={styles.sidebar}>
  <nav className={styles.nav}>
    <Link href="/profile" className={styles.navItem}>
      <User size={18} /> My Profile
    </Link>

    <Link href="/orders" className={`${styles.navItem} ${styles.active}`}>
      <Package size={18} /> Orders
    </Link>

    <Link href="/settings" className={styles.navItem}>
      <Settings size={18} /> Settings
    </Link>

    <Link href="/home" className={styles.navItem}>
      <ShoppingCart size={18} /> Shop
    </Link>
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
                  <p>
                    {order.status?.charAt(0).toUpperCase() +
                      order.status?.slice(1)}
                  </p>
                </div>
              </div>

              {/* ✅ ACTION BUTTONS */}
              {successMsg && (
                <p style={{ color: "green", fontWeight: 600, marginBottom: "10px" }}>
                  {successMsg}
                </p>
              )}

              <div style={{ marginBottom: "20px" }}>
                {[
                  "pending",
                  "paid",
                  "shipped",
                ].includes(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={actionLoading}
                    style={{
                      padding: "10px 18px",
                      background: "#d9534f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "10px",
                      opacity: actionLoading ? 0.6 : 1,
                    }}
                  >
                    {actionLoading ? "Processing..." : "Cancel Order"}
                  </button>
                )}

                {order.status === "delivered" && (
                  <button
                    onClick={handleReturnOrder}
                    disabled={actionLoading}
                    style={{
                      padding: "10px 18px",
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      opacity: actionLoading ? 0.6 : 1,
                    }}
                  >
                    {actionLoading ? "Processing..." : "Return Order"}
                  </button>
                )}
              </div>

              {/* ✅ ORDER TRACKING */}
              <div className={styles.trackingHeader}>
                <h3>Order Tracking</h3>
                <p>Tracking ID: {order.barcode || "Not assigned"}</p>
              </div>

              {order.status === "cancelled" && (
                <p style={{ color: "red", fontWeight: 600, marginBottom: "10px" }}>
                   This order has been cancelled
                </p>
              )}

              <div className={styles.trackingBox}>
                {[ 
                  { key: "pending", label: "Order Placed", icon: "/Assest/gifs/order-placed.gif" },
                  { key: "paid", label: "Order Packed", icon: "/Assest/gifs/package.gif" },
                  { key: "shipped", label: "In Transit", icon: "/Assest/gifs/truck.gif" },
                  { key: "delivered", label: "Delivered", icon: "/Assest/gifs/delivered.gif" },
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
                            filter: isCompleted ? "none" : "grayscale(100%)",
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
                        <p className={styles.date} style={{ color: "#d9c169" }}>
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
                          Size: {item.size} | Colour: <strong>{item.color}</strong>
                        </p>
                        <p className={styles.expected}>
                          Payment Method: <strong>{order.paymentMethod}</strong>
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
    </PageLayout>
  );
}
