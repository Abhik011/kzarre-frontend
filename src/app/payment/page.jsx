"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import styles from "./Payment.module.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("order"); // passed from checkout: /payment?order=ORDER_123

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  function showPopup(message, type = "success") {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2600);
  }

  const [loadingStripe, setLoadingStripe] = useState(false);
  const [loadingCOD, setLoadingCOD] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingPaypal, setLoadingPaypal] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        showPopup("Missing order id", "error");
        setLoadingOrder(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/checkout/order/${orderId}`);
        const data = await res.json();
        if (!data.success) {
          showPopup(data.message || "Order not found", "error");
        } else {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("loadOrder err:", err);
        showPopup("Failed to load order", "error");
      } finally {
        setLoadingOrder(false);
      }
    }
    loadOrder();
  }, [orderId]);

  // Popup Component
  const Popup = ({ message, type, onClose }) => (
    <div className={styles.popupOverlay}>
      <div className={`${styles.popupBox} ${type === "error" ? styles.error : styles.success}`}>
        <p>{message}</p>
        <button className={styles.closePopup} onClick={onClose}>✕</button>
      </div>
    </div>
  );

  // COD - use orderId (server will already have order items)
  async function placeCodOrder() {
    try {
      setLoadingCOD(true);
      const userId = localStorage.getItem("kzarre_user_id") || undefined;
      const email = localStorage.getItem("kzarre_remember_email") || undefined;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/orders/cod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userId, email }),
      });

      const data = await res.json();
      if (!data.success) {
        showPopup(data.message || "COD failed", "error");
        return;
      }

      router.push(`/payment/success?order=${orderId}`);
    } catch (err) {
      console.error("placeCodOrder err:", err);
      showPopup("COD Error Occurred", "error");
    } finally {
      setLoadingCOD(false);
    }
  }

  // Stripe flow
  async function startStripePayment() {
    try {
      if (!orderId) { showPopup("Order missing", "error"); return; }
      setLoadingStripe(true);

      // ask backend to create PaymentIntent for this order
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/checkout/stripe/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!data.success || !data.clientSecret) {
        showPopup(data.message || "Stripe creation failed", "error");
        setLoadingStripe(false);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        showPopup("Stripe not configured", "error");
        setLoadingStripe(false);
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret);
      if (result.error) {
        showPopup(result.error.message || "Payment failed", "error");
        setLoadingStripe(false);
        return;
      }

      // if succeeded -> inform backend to mark order paid
      const confirmRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/checkout/stripe/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentIntentId: result.paymentIntent?.id }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmData.success) {
        showPopup(confirmData.message || "Payment confirmation failed", "error");
        setLoadingStripe(false);
        return;
      }

      router.push(`/payment/success?order=${orderId}`);
    } catch (err) {
      console.error("startStripePayment err:", err);
      showPopup("Stripe Error", "error");
    } finally {
      setLoadingStripe(false);
    }
  }

  function applePayHandler() {
    setLoadingApple(true);
    setTimeout(() => {
      showPopup("Apple Pay Coming Soon", "success");
      setLoadingApple(false);
    }, 1000);
  }

  function paypalPayHandler() {
    setLoadingPaypal(true);
    setTimeout(() => {
      showPopup("PayPal Coming Soon", "success");
      setLoadingPaypal(false);
    }, 1000);
  }

  if (loadingOrder) return <div className={styles.loading}>Loading order…</div>;
  if (!order) return <div className={styles.loading}>Order not found.</div>;

  return (
    <div className={styles.pageWrap}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2>Select Payment Method</h2>

          <div className={styles.paymentButtonsColumn}>

            {/* STRIPE BUTTON */}
            <button onClick={startStripePayment} disabled={loadingStripe}
              className={`${styles.payButtonBase} ${styles.stripeBtn}`}>
              {loadingStripe ? "Processing…" : "Pay with Stripe"}
            </button>

            {/* APPLE */}
            <button onClick={applePayHandler} disabled={loadingApple}
              className={`${styles.payButtonBase} ${styles.appleBtn}`}>
              {loadingApple ? "Loading…" : "Apple Pay"}
            </button>

            {/* PAYPAL */}
            <button onClick={paypalPayHandler} disabled={loadingPaypal}
              className={`${styles.payButtonBase} ${styles.paypalBtn}`}>
              {loadingPaypal ? "Loading…" : "PayPal"}
            </button>

            {/* COD */}
            <button onClick={placeCodOrder} disabled={loadingCOD}
              className={`${styles.payButtonBase} ${styles.codBtn}`}>
              {loadingCOD ? "Placing Order…" : "Cash On Delivery"}
            </button>
          </div>
        </div>
      </div>

      {popup.show && <Popup message={popup.message} type={popup.type} onClose={() => setPopup({ show: false, message: "", type: "" })} />}
    </div>
  );
}
