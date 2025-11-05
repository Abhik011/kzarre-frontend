"use client";
import React, { useState, useRef } from "react";
import "./singup.css";
import RegisterImg from "../Assest/Singup.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SingupPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle OTP input changes
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only 1 char
    setOtp(newOtp);

    // Move focus to next box automatically
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // STEP 1 — Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
      } else {
        setSuccess("OTP sent to your email. Please check your inbox.");
        setShowOtpStep(true);
        setEditEmail(false);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const otpCode = otp.join("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: otpCode,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
      } else {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-box">
          <h2>
            Register to <span>KZARRÈ</span>
          </h2>
          <p>Enter your details below</p>

          {/* STEP 1 — REGISTRATION FORM */}
          {!showOtpStep ? (
            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="error-text">{error}</p>}
              {success && <p className="success-text">{success}</p>}

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            /* STEP 2 — OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp}>
              {!editEmail ? (
                <p>
                  OTP sent to <strong>{formData.email}</strong>{" "}
                  <button
                    type="button"
                    onClick={() => setEditEmail(true)}
                    className="edit-email-btn"
                  >
                    Edit
                  </button>
                </p>
              ) : (
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter correct email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="otp-box">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el as HTMLInputElement;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    className="otp-input"
                  />
                ))}
              </div>

              {error && <p className="error-text">{error}</p>}
              {success && <p className="success-text">{success}</p>}

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                className="register-btn resend-btn"
                onClick={handleSendOtp}
                disabled={loading}
                style={{ marginTop: "10px" }}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="register-right">
        <Image src={RegisterImg} alt="Register" className="register-image" />
      </div>
    </div>
  );
};

export default SingupPage;
