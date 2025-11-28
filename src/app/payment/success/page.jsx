"use client";

export default function SuccessPage() {
  // ✅ Mock order details (you can replace these with real data later)
  const order = {
    id: "KZ-ORD-458921",
    date: new Date().toLocaleDateString(),
    name: "John Doe",
    email: "john@example.com",
    payment: "Cash on Delivery",
    items: [
      { name: "Luxury Leather Jacket", qty: 1, price: 18999 },
      { name: "Premium Cotton Shirt", qty: 2, price: 2999 },
    ],
    subtotal: 24997,
    shipping: 0,
    total: 24997,
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Order Confirmed</h1>
          <p style={styles.subtitle}>
            Thank you for shopping with <strong>KZARRE</strong>
          </p>
        </div>

        {/* ✅ Order Info */}
        <div style={styles.section}>
          <div style={styles.row}>
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>
          <div style={styles.row}>
            <span>Order Date</span>
            <strong>{order.date}</strong>
          </div>
          <div style={styles.row}>
            <span>Payment Method</span>
            <strong>{order.payment}</strong>
          </div>
        </div>

        {/* ✅ Customer Info */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Billing Details</h3>
          <div style={styles.row}>
            <span>Name</span>
            <strong>{order.name}</strong>
          </div>
          <div style={styles.row}>
            <span>Email</span>
            <strong>{order.email}</strong>
          </div>
        </div>

        {/* ✅ Order Items (Bill Style) */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>

          {order.items.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <span>{item.name} × {item.qty}</span>
              <strong>$ {item.price.toLocaleString()}</strong>
            </div>
          ))}

          <hr style={styles.divider} />

          <div style={styles.totalRow}>
            <span>Subtotal</span>
            <strong>$ {order.subtotal.toLocaleString()}</strong>
          </div>
          <div style={styles.totalRow}>
            <span>Shipping</span>
            <strong>Free</strong>
          </div>

          <div style={styles.grandTotal}>
            <span>Total</span>
            <strong>$ {order.total.toLocaleString()}</strong>
          </div>
        </div>

        {/* ✅ Footer Actions */}
        <div style={styles.footer}>
          <a href="/home" style={styles.primaryBtn}>
            Continue Shopping →
          </a>

          <a href="/orders" style={styles.secondaryBtn}>
            View My Orders
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================
   ✅ Luxury Black & White Styles
============================ */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f0f0ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Inter, system-ui, sans-serif",
  },

  card: {
    background: "#fff",
    color: "#000",
    width: "100%",
    maxWidth: 520,
    borderRadius: 14,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },

  header: {
    textAlign: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },

  section: {
    marginTop: 24,
    borderTop: "1px solid #eee",
    paddingTop: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 8,
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 10,
  },

  divider: {
    margin: "16px 0",
    border: "none",
    borderTop: "1px dashed #ccc",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 6,
  },

  grandTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 18,
    fontWeight: 700,
    marginTop: 12,
  },

  footer: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  primaryBtn: {
    background: "#000",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: 8,
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 600,
  },

  secondaryBtn: {
    border: "1px solid #000",
    color: "#000",
    padding: "14px 20px",
    borderRadius: 8,
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 600,
  },
};
