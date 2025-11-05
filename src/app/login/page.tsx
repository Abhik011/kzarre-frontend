"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./login.css";
import Loginimg from "../Assest/Login.png";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // ✅ Save token & user
      localStorage.setItem("kzarre_token", data.token);
      localStorage.setItem("kzarre_user", JSON.stringify(data.user));

      // ✅ If "Remember Me" checked, store email in localStorage
      if (formData.remember) {
        localStorage.setItem("kzarre_remember_email", formData.email);
      } else {
        localStorage.removeItem("kzarre_remember_email");
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/home"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-fill remembered email (if saved)
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("kzarre_remember_email");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail, remember: true }));
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-left">
        <Image src={Loginimg} alt="Login Banner" className="login-image" priority />
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>
            Log in to <span>KZARRÈ</span>
          </h2>
          <p>Enter your details below</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="input-group" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {/* Show/Hide password toggle */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "14px",
                  color: "#999",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* Remember Me */}
            <div
              className="input-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  style={{ accentColor: "#d9c169", cursor: "pointer" }}
                />
                <span style={{ fontSize: "14px", color: "#888" }}>Remember Me</span>
              </label>
            </div>

            {/* Error & Success Messages */}
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <div className="form-links">
              <a href="/singup">
                New here? <strong>Create an account</strong>
              </a>
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
