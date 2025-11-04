"use client";
import React from "react";
import "./singup.css";
import RegisterImg from "../Assest/Singup.png";
import Image from "next/image"
const SingupPage = () => {
  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-box">
          <h2>
            Register to <span>KZARRÈ</span>
          </h2>
          <p>Enter your details below</p>

          <form>
            <div className="input-group">
              <input type="text" placeholder="Name" />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Email or Phone Number" />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Confirm Password" />
            </div>

            <div className="form-links">
              <p>
                Already have an account?{" "}
                <a href="/login">
                  <strong>Login</strong>
                </a>
              </p>
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
        </div>
      </div>

      <div className="register-right">
        <Image src={RegisterImg} alt="Register" className="register-image" />
      </div>
    </div>
  );
};

export default SingupPage;
