"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./login.css";
import Loginimg from "../Assest/Login.png";

interface LoginForm {
  emailOrPhone: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginForm>({
    emailOrPhone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ ✅ ✅ FINAL FIXED LOGIN HANDLER (VERCEL SAFE)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.emailOrPhone || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
     const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // ✅ keeps frontend cookie
  body: JSON.stringify({
    email: formData.emailOrPhone,
    password: formData.password,
  }),
});


      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      // ✅ ✅ ✅ SAVE TOKEN (FOR ALL OLD FUNCTIONS)
      if (data.token) {
        localStorage.setItem("kzarre_token", data.token);
      }

      // ✅ ✅ ✅ SAVE USER DATA
      localStorage.setItem("kzarre_user", JSON.stringify(data.user));
      localStorage.setItem("kzarre_user_id", data.user.id);

      // ✅ ✅ ✅ GLOBAL AUTH SYNC (FIXES VERCEL FLASH LOGOUT)
      window.dispatchEvent(new Event("auth-change"));

      setSuccess("Login successful! Redirecting...");

      // ✅ ✅ ✅ SAFE REDIRECT (NO setTimeout)
      router.replace("/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
            {/* ✅ Email / Phone */}
            <div className="input-group">
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Email or Phone Number"
                value={formData.emailOrPhone}
                onChange={handleChange}
              />
            </div>

            {/* ✅ Password */}
            <div className="input-group" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* ✅ Links */}
            <div className="form-links">
              <a href="/singup">New here? <strong>Create an account</strong></a>
              <a href="/forgot-password">Forget Password ?</a>
            </div>

            {/* ✅ Messages */}
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            {/* ✅ Submit Button */}
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
