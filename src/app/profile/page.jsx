"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Package,
  Settings,
  ShoppingCart,
  Edit,
  MapPin,
  Trash2,
  X,
  PlusCircle
} from "lucide-react";
import styles from "./Profile.module.css";
import PageLayout from "../components/PageLayout";


/**
 * Helper: convert ISO country code to emoji flag
 * "US" -> 🇺🇸
 */
function isoToFlagEmoji(iso) {
  if (!iso) return "";
  // Ensure uppercase, 2 letters
  const code = iso.toUpperCase();
  return code
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt()))
    .join("");
}

/**
 * Countries list: name, iso (2-letter), dial_code, phone length hints [min,max]
 * This list includes common + most countries. Use search box to find.
 * (If you want me to add more countries or change validation lengths, say so.)
 */
const COUNTRIES = [
  { name: "United States", iso: "US", dial_code: "+1", min: 10, max: 11 },
  { name: "India", iso: "IN", dial_code: "+91", min: 10, max: 10 },
  { name: "United Kingdom", iso: "GB", dial_code: "+44", min: 10, max: 10 },
  { name: "Canada", iso: "CA", dial_code: "+1", min: 10, max: 11 },
  { name: "Australia", iso: "AU", dial_code: "+61", min: 9, max: 9 },
  { name: "Germany", iso: "DE", dial_code: "+49", min: 7, max: 13 },
  { name: "France", iso: "FR", dial_code: "+33", min: 9, max: 9 },
  { name: "Spain", iso: "ES", dial_code: "+34", min: 9, max: 9 },
  { name: "Italy", iso: "IT", dial_code: "+39", min: 9, max: 10 },
  { name: "Netherlands", iso: "NL", dial_code: "+31", min: 9, max: 9 },
  { name: "Sweden", iso: "SE", dial_code: "+46", min: 9, max: 9 },
  { name: "Norway", iso: "NO", dial_code: "+47", min: 8, max: 8 },
  { name: "Denmark", iso: "DK", dial_code: "+45", min: 8, max: 8 },
  { name: "Brazil", iso: "BR", dial_code: "+55", min: 10, max: 11 },
  { name: "Mexico", iso: "MX", dial_code: "+52", min: 10, max: 10 },
  { name: "Japan", iso: "JP", dial_code: "+81", min: 9, max: 10 },
  { name: "South Korea", iso: "KR", dial_code: "+82", min: 9, max: 11 },
  { name: "China", iso: "CN", dial_code: "+86", min: 11, max: 11 },
  { name: "South Africa", iso: "ZA", dial_code: "+27", min: 9, max: 9 },
  { name: "New Zealand", iso: "NZ", dial_code: "+64", min: 8, max: 9 },
  { name: "Pakistan", iso: "PK", dial_code: "+92", min: 10, max: 10 },
  { name: "Bangladesh", iso: "BD", dial_code: "+880", min: 10, max: 10 },
  { name: "Nepal", iso: "NP", dial_code: "+977", min: 9, max: 10 },
  { name: "Sri Lanka", iso: "LK", dial_code: "+94", min: 9, max: 9 },
  { name: "United Arab Emirates", iso: "AE", dial_code: "+971", min: 9, max: 9 },
  { name: "Saudi Arabia", iso: "SA", dial_code: "+966", min: 9, max: 9 },
  { name: "Turkey", iso: "TR", dial_code: "+90", min: 10, max: 10 },
  { name: "Poland", iso: "PL", dial_code: "+48", min: 9, max: 9 },
  { name: "Portugal", iso: "PT", dial_code: "+351", min: 9, max: 9 },
  { name: "Belgium", iso: "BE", dial_code: "+32", min: 8, max: 9 },
  { name: "Switzerland", iso: "CH", dial_code: "+41", min: 9, max: 9 },
  { name: "Austria", iso: "AT", dial_code: "+43", min: 9, max: 9 },
  { name: "Greece", iso: "GR", dial_code: "+30", min: 10, max: 10 },
  { name: "Ireland", iso: "IE", dial_code: "+353", min: 9, max: 9 },
  { name: "Indonesia", iso: "ID", dial_code: "+62", min: 9, max: 12 },
  { name: "Philippines", iso: "PH", dial_code: "+63", min: 10, max: 10 },
  { name: "Malaysia", iso: "MY", dial_code: "+60", min: 9, max: 10 },
  { name: "Singapore", iso: "SG", dial_code: "+65", min: 8, max: 8 },
  { name: "Israel", iso: "IL", dial_code: "+972", min: 9, max: 9 },
  { name: "Romania", iso: "RO", dial_code: "+40", min: 9, max: 10 },
  { name: "Czech Republic", iso: "CZ", dial_code: "+420", min: 9, max: 9 },
  { name: "Hungary", iso: "HU", dial_code: "+36", min: 9, max: 9 },
  { name: "Argentina", iso: "AR", dial_code: "+54", min: 10, max: 10 },
  { name: "Chile", iso: "CL", dial_code: "+56", min: 9, max: 9 },
  { name: "Colombia", iso: "CO", dial_code: "+57", min: 10, max: 10 },
  { name: "Peru", iso: "PE", dial_code: "+51", min: 9, max: 9 },
  { name: "Venezuela", iso: "VE", dial_code: "+58", min: 10, max: 10 },
  { name: "Egypt", iso: "EG", dial_code: "+20", min: 9, max: 10 },
  { name: "Kenya", iso: "KE", dial_code: "+254", min: 9, max: 9 },
  { name: "Nigeria", iso: "NG", dial_code: "+234", min: 10, max: 10 },
  { name: "Ghana", iso: "GH", dial_code: "+233", min: 9, max: 9 },
  { name: "Morocco", iso: "MA", dial_code: "+212", min: 9, max: 9 },
  { name: "Tunisia", iso: "TN", dial_code: "+216", min: 8, max: 8 },
  { name: "Algeria", iso: "DZ", dial_code: "+213", min: 9, max: 9 },
  { name: "Ukraine", iso: "UA", dial_code: "+380", min: 9, max: 9 },
  { name: "Russia", iso: "RU", dial_code: "+7", min: 10, max: 10 },
  { name: "Kazakhstan", iso: "KZ", dial_code: "+7", min: 10, max: 10 },
  { name: "Vietnam", iso: "VN", dial_code: "+84", min: 9, max: 10 },
  { name: "Thailand", iso: "TH", dial_code: "+66", min: 9, max: 9 },
  { name: "Ireland (Northern)", iso: "GB-NI", dial_code: "+44", min: 10, max: 10 }, // fallback
  { name: "Other", iso: "", dial_code: "", min: 6, max: 15 }
  // If you want every single United Nations country added explicitly, I can expand this list —
  // current list covers most countries and provides fallbacks.
];

/* ------------------------------
   Toast component (internal)
   ------------------------------ */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      aria-live="polite"
      className={`${styles.toast} ${toast.type === "success" ? styles.toastSuccess : styles.toastError}`}
      role="status"
    >
      {toast.message}
      <button className={styles.toastClose} onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}

/* ------------------------------
   Phone formatting / validation
   - addCountryDial: returns combined phone with dial if user typed local number
   - validatePhone: basic per-country length check, strips non-digits
   ------------------------------ */
function stripNumber(s = "") {
  return (s || "").replace(/[^\d]/g, "");
}

function combineDial(dial, number) {
  if (!dial) return number;
  const n = stripNumber(number);
  const d = dial.replace(/\D/g, "");
  // If user already included dial, prefer it
  if (n.startsWith(d)) return `+${n}`;
  return `+${d}${n}`;
}

function validatePhoneForCountry(country, rawNumber) {
  const digits = stripNumber(rawNumber);
  if (!digits) return { ok: false, message: "Phone is required" };

  const min = country?.min || 6;
  const max = country?.max || 15;
  if (digits.length < min) return { ok: false, message: `Too short for ${country?.name || "selected country"}` };
  if (digits.length > max) return { ok: false, message: `Too long for ${country?.name || "selected country"}` };

  return { ok: true, message: "" };
}

/* ------------------------------
   MAIN PROFILE PAGE COMPONENT
   ------------------------------ */
export default function ProfilePage() {
  /* ---------- state & refs ---------- */
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", countryIso: "US", dial_code: "+1" });

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: "Home",
    name: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    countryIso: "US",
    dial_code: "+1"
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [toast, setToast] = useState(null);

  // country search state
  const [countryQuery, setCountryQuery] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("kzarre_token") : "";

  /* ---------- derived country list ---------- */
  const countryOptions = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.iso && c.iso.toLowerCase().includes(q)) ||
        (c.dial_code && c.dial_code.includes(q))
    );
  }, [countryQuery]);

  /* ---------- load profile from backend ---------- */
  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        // not logged in
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) {
          setToast({ type: "error", message: data.message || "Failed to load profile" });
          return;
        }

        const u = data.user;
        setUser(u);
        // if user stored phone with country prefix, try to detect country
        let countryIso = "US";
        let dial_code = "+1";
        // naive detection: find a country whose dial_code matches prefix of phone
        if (u?.phone) {
          const digits = stripNumber(u.phone);
          for (const c of COUNTRIES) {
            const cleanDial = (c.dial_code || "").replace(/\D/g, "");
            if (cleanDial && digits.startsWith(cleanDial)) {
              countryIso = c.iso || countryIso;
              dial_code = c.dial_code || dial_code;
              break;
            }
          }
        } else {
          // fallback to local default
          countryIso = "US";
          dial_code = "+1";
        }

        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          countryIso,
          dial_code,
        });

        // also fetch addresses
        await loadAddresses();
      } catch (err) {
        console.error(err);
        setToast({ type: "error", message: "Error loading profile" });
      }
    }

    // loadAddresses used below; define inside to avoid hoisting issues
    async function loadAddresses() {
      if (!token) return;
      setLoadingAddresses(true);
      try {
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/address/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d2 = await res2.json();
        if (d2.success && Array.isArray(d2.addresses)) setAddresses(d2.addresses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadProfile();
    // we intentionally do not add loadAddresses into dependencies here; all handled in function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ---------- handlers for profile form ---------- */
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleCountrySelect(country) {
    setForm((s) => ({ ...s, countryIso: country.iso, dial_code: country.dial_code }));
    setCountryDropdownOpen(false);
    setCountryQuery("");
  }

  async function saveProfileToServer() {
    // validate phone for selected country
    const country = COUNTRIES.find((c) => c.iso === form.countryIso) || { min: 6, max: 15, dial_code: form.dial_code };
    const validate = validatePhoneForCountry(country, form.phone);
    if (!validate.ok) {
      setToast({ type: "error", message: validate.message });
      return;
    }

    setSavingProfile(true);
    try {
      const body = {
        name: form.name,
        email: form.email,
        phone: combineDial(country.dial_code, form.phone)
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!data.success) {
        setToast({ type: "error", message: data.message || "Failed to save profile" });
      } else {
        setUser(data.user);
        setForm((s) => ({ ...s, phone: data.user.phone }));
        localStorage.setItem("kzarre_user", JSON.stringify(data.user));
        setToast({ type: "success", message: "Profile updated" });
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Network error when saving profile" });
    } finally {
      setSavingProfile(false);
    }
  }

  /* ---------- Address modal & handlers ---------- */
  function openAddModal() {
    setModalMode("add");
    setCurrentAddress(null);
    setAddressForm({
      title: "Home",
      name: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      countryIso: form.countryIso || "US",
      dial_code: form.dial_code || "+1"
    });
    setShowModal(true);
  }

  function openEditModal(addr) {
    setModalMode("edit");
    setCurrentAddress(addr);
    setAddressForm({
      title: addr.title || "Home",
      name: addr.name || "",
      line1: addr.line1 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      phone: addr.phone || "",
      countryIso: addr.countryIso || (form.countryIso || "US"),
      dial_code: addr.dial_code || (form.dial_code || "+1")
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setCurrentAddress(null);
  }

  function handleAddressFieldChange(e) {
    const { name, value } = e.target;
    setAddressForm((s) => ({ ...s, [name]: value }));
  }

  function handleAddressCountrySelect(country) {
    setAddressForm((s) => ({ ...s, countryIso: country.iso, dial_code: country.dial_code }));
  }

  async function submitAddAddress() {
    // validate basic required fields
    if (!addressForm.title || !addressForm.line1) {
      setToast({ type: "error", message: "Please provide title and address line." });
      return;
    }
    // validate phone
    const c = COUNTRIES.find((c) => c.iso === addressForm.countryIso) || { min: 6, max: 15, dial_code: addressForm.dial_code };
    const v = validatePhoneForCountry(c, addressForm.phone);
    if (!v.ok) {
      setToast({ type: "error", message: v.message });
      return;
    }

    setAddressSaving(true);
    try {
      const payload = {
        ...addressForm,
        phone: combineDial(addressForm.dial_code || c.dial_code, addressForm.phone),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/address/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const d = await res.json();
      if (!d.success) {
        setToast({ type: "error", message: d.message || "Failed to add address" });
      } else {
        setAddresses((prev) => [d.address, ...prev]);
        setToast({ type: "success", message: "Address added" });
        closeModal();
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Network error when adding address" });
    } finally {
      setAddressSaving(false);
    }
  }

  async function submitUpdateAddress() {
    if (!currentAddress) return;
    // validation similar to add
    const c = COUNTRIES.find((c) => c.iso === addressForm.countryIso) || { min: 6, max: 15, dial_code: addressForm.dial_code };
    const v = validatePhoneForCountry(c, addressForm.phone);
    if (!v.ok) {
      setToast({ type: "error", message: v.message });
      return;
    }

    setAddressSaving(true);
    try {
      const payload = {
        ...addressForm,
        phone: combineDial(addressForm.dial_code || c.dial_code, addressForm.phone)
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/address/update/${currentAddress._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const d = await res.json();
      if (!d.success) {
        setToast({ type: "error", message: d.message || "Failed to update address" });
      } else {
        setAddresses((prev) => prev.map((a) => (a._id === currentAddress._id ? d.address : a)));
        setToast({ type: "success", message: "Address updated" });
        closeModal();
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Network error when updating address" });
    } finally {
      setAddressSaving(false);
    }
  }

  async function handleDeleteAddress(id) {
    if (!confirm("Delete this address? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/address/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (!d.success) {
        setToast({ type: "error", message: d.message || "Failed to delete address" });
      } else {
        setAddresses((p) => p.filter((a) => a._id !== id));
        setToast({ type: "success", message: "Address deleted" });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Network error when deleting address" });
    } finally {
      setDeletingId(null);
    }
  }

  /* ---------- small UI helpers ---------- */
  function closeToast() {
    setToast(null);
  }

  /* ---------- mobile-friendly: make sure bottom nav unaffected ---------- */
  // No code required here – ensure your page CSS leaves room for bottom nav (Profile.module.css).
  // If bottom nav overlays content, apply padding-bottom to .content or .pageWrap in CSS.

  /* ---------- render ---------- */
  if (!user) return <div className={styles.loading}>Loading profile…</div>;

  const selectedCountry = COUNTRIES.find((c) => c.iso === form.countryIso) || { name: "Other", iso: "", dial_code: "" };

  return (
    <PageLayout>
    <div className={styles.pageWrap}>
      {/* Toast */}
      <Toast toast={toast} onClose={closeToast} />

      <div className={styles.container}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <a href="#" className={`${styles.navItem} ${styles.active}`}>
              <User size={18} /> My Profile
            </a>
            <a href="/orders" className={styles.navItem}>
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

        {/* MAIN */}
        <main className={styles.content}>
          <h2 className={styles.sectionTitle}>My Profile</h2>

          {/* Profile card */}
          <div className={styles.card}>
            <div className={styles.cardRow}>
              <span className={styles.label}>
                Name <Edit size={14} className={styles.editIcon} onClick={() => setEditing(true)} />
              </span>
              {!editing ? (
                <span className={styles.value}>{user.name}</span>
              ) : (
                <input
                  className={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                />
              )}
            </div>

            <div className={styles.cardRow}>
              <span className={styles.label}>
                Email <Edit size={14} className={styles.editIcon} onClick={() => setEditing(true)} />
              </span>
              {!editing ? (
                <span className={styles.value}>{user.email}</span>
              ) : (
                <input
                  className={styles.input}
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                />
              )}
            </div>

            <div className={styles.cardRow} style={{ alignItems: "center" }}>
              <span className={styles.label}>
                Phone{" "}
                <Edit size={14} className={styles.editIcon} onClick={() => setEditing(true)} />
              </span>

              {!editing ? (
                <span className={styles.value}>{user.phone || "Not added"}</span>
              ) : (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {/* Country selector (compact) */}
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setCountryDropdownOpen((s) => !s)}
                      className={styles.input}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}
                    >
                      <span>{isoToFlagEmoji(selectedCountry.iso)}</span>
                      <span style={{ minWidth: 52 }}>{selectedCountry.dial_code}</span>
                      <span style={{ opacity: 0.6 }}>{selectedCountry.iso}</span>
                    </button>

                    {countryDropdownOpen && (
                      <div style={{
                        position: "absolute",
                        zIndex: 3000,
                        background: "#fff",
                        border: "1px solid #eee",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                        width: 320,
                        maxHeight: 280,
                        overflow: "auto",
                        marginTop: 8,
                        borderRadius: 8,
                        padding: 8
                      }}>
                        <input
                          placeholder="Search country or dial code"
                          value={countryQuery}
                          onChange={(e) => setCountryQuery(e.target.value)}
                          style={{ width: "100%", padding: 8, marginBottom: 8, boxSizing: "border-box" }}
                        />
                        <div>
                          {countryOptions.map((c) => (
                            <button
                              key={c.iso + c.dial_code}
                              onClick={() => {
                                handleCountrySelect(c);
                                setCountryDropdownOpen(false);
                              }}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 6px",
                                border: "none",
                                textAlign: "left",
                                background: "transparent",
                                cursor: "pointer"
                              }}
                            >
                              <span style={{ fontSize: 18 }}>{isoToFlagEmoji(c.iso)}</span>
                              <span style={{ flex: 1 }}>{c.name}</span>
                              <span style={{ color: "#666" }}>{c.dial_code}</span>
                            </button>
                          ))}
                          {countryOptions.length === 0 && <div style={{ padding: 8, color: "#666" }}>No results</div>}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="Mobile number (local format)"
                    className={styles.input}
                    style={{ minWidth: 200 }}
                  />
                </div>
              )}
            </div>

            {editing && (
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button
                  className={styles.saveBtn}
                  onClick={saveProfileToServer}
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving…" : "Save Changes"}
                </button>
                <button
                  className={styles.addBtn}
                  onClick={() => {
                    // cancel editing - reset form to user values
                    setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", countryIso: form.countryIso, dial_code: form.dial_code });
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.label}>Saved addresses</span>

              <button className={styles.addBtn} onClick={openAddModal}>
                <PlusCircle size={16} /> Add
              </button>
            </div>

            {loadingAddresses && <p className={styles.note}>Loading addresses…</p>}
            {!loadingAddresses && addresses.length === 0 && <p className={styles.note}>No addresses found.</p>}

            {addresses.map((addr) => {
              // Derive flag from addr.countryIso if present
              const addrFlag = isoToFlagEmoji(addr.countryIso || "");
              return (
                <div className={styles.addressItem} key={addr._id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className={styles.addrIcon}>
                      <MapPin size={18} />
                    </div>
                  </div>

                  <div className={styles.addrText}>
                    <strong>{addr.title} {addrFlag && <span style={{ marginLeft: 8 }}>{addrFlag}</span>}</strong>
                    <p>{addr.name}</p>
                    <p>{addr.line1}</p>
                    <p>{addr.city}, {addr.state}</p>
                    <p>Pincode: {addr.pincode}</p>
                    <p>Phone: {addr.phone}</p>
                  </div>

                  <div className={styles.addrActions}>
                    <button className={styles.addrEdit} onClick={() => openEditModal(addr)}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.addrDelete} onClick={() => handleDeleteAddress(addr._id)} disabled={deletingId === addr._id}>
                      {deletingId === addr._id ? "Deleting…" : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Modal for add/edit address */}
      {showModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{modalMode === "add" ? "Add new address" : "Edit address"}</h3>
              <button className={styles.modalClose} onClick={closeModal}><X size={18} /></button>
            </div>

            <div className={styles.modalBody}>
              {/* Small country selector for address */}
              <label>
                Country
                <select
                  name="countryIso"
                  value={addressForm.countryIso}
                  onChange={(e) => {
                    const iso = e.target.value;
                    const c = COUNTRIES.find((c) => c.iso === iso) || { dial_code: "" };
                    setAddressForm((s) => ({ ...s, countryIso: iso, dial_code: c.dial_code || "" }));
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.iso + c.dial_code} value={c.iso}>
                      {isoToFlagEmoji(c.iso)} {c.name} {c.dial_code}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Title
                <input name="title" value={addressForm.title} onChange={handleAddressFieldChange} />
              </label>

              <label>
                Name
                <input name="name" value={addressForm.name} onChange={handleAddressFieldChange} />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                Address line
                <input name="line1" value={addressForm.line1} onChange={handleAddressFieldChange} />
              </label>

              <label>
                City
                <input name="city" value={addressForm.city} onChange={handleAddressFieldChange} />
              </label>

              <label>
                State
                <input name="state" value={addressForm.state} onChange={handleAddressFieldChange} />
              </label>

              <label>
                Pincode
                <input name="pincode" value={addressForm.pincode} onChange={handleAddressFieldChange} />
              </label>

              <label>
                Phone
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressFieldChange}
                    placeholder="Local number"
                  />
                </div>
              </label>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={closeModal}>Cancel</button>

              {modalMode === "add" ? (
                <button className={styles.modalSave} onClick={submitAddAddress} disabled={addressSaving}>
                  {addressSaving ? "Saving…" : "Add Address"}
                </button>
              ) : (
                <button className={styles.modalSave} onClick={submitUpdateAddress} disabled={addressSaving}>
                  {addressSaving ? "Saving…" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </PageLayout>
  );
}

/* ---------- Toast CSS placeholders (if your Profile.module.css does not include) ----------
   If your CSS already contains toast classes (toast, toastSuccess, toastError, toastClose),
   you can skip — otherwise add small styles to your module to match the design:
   .toast { position: fixed; right: 20px; top: 20px; padding: 10px 14px; border-radius: 8px; z-index: 99999 }
   .toastSuccess { background: #0b3; color: #fff; }
   .toastError { background: #b02a2a; color: #fff; }
   .toastClose { background: transparent; border: none; color: #fff; margin-left: 8px; }
------------------------------------------------------------------------------------- */