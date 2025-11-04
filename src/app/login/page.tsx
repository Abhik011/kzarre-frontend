"use client";
import React from "react";
import Image from "next/image"
import "./login.css";
import Loginimg from "../Assest/Login.png"

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <Image src={Loginimg} alt="Login Banner" className="login-image" priority/>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>
            Log in to <span>KZARRÈ</span>
          </h2>
          <p>Enter your details below</p>

          <form>
            <div className="input-group">
              <input type="text" placeholder="Email or Phone Number" />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" />
            </div>

            <div className="form-links">
              <a href="/singup">New here? <strong>Create an account</strong></a>
              <a href="/forgot-password">Forget Password ?</a>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
