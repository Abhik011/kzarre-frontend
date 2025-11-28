"use client";

import React, { useState, useEffect } from "react";
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

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit login
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.emailOrPhone,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("kzarre_token", data.token || "");
      localStorage.setItem("kzarre_user", JSON.stringify(data.user));
      localStorage.setItem("kzarre_user_id", data.user.id);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/home"), 1000);
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

            {/* Email / Phone */}
            <div className="input-group">
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Email or Phone Number"
                value={formData.emailOrPhone}
                onChange={handleChange}
              />
            </div>

            {/* Password + Show/Hide */}
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

            {/* Links */}
            <div className="form-links">
              <a href="/singup">New here? <strong>Create an account</strong></a>
              <a href="/forgot-password">Forget Password ?</a>
            </div>

            {/* Messages */}
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            {/* Button */}
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
