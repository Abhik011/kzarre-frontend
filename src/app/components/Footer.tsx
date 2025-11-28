"use client";
import React from "react";
import "./Footer.css";
import Image from "next/image";
import Link from "next/link"
import logo from "../Assest/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      {/* <div className="footer-top">
        <h1 className="footer-logo">KZARRÈ</h1>
      </div> */}
      <div className="footer-logo logo">
          <Link href="/home">
            <Image
              src={logo}
              alt="KZARRÈ Logo"
             
            />
          </Link>
        </div>

      <div className="footer-content">
        {/* Subscribe Section */}
        <div className="footer-column-input">
          <h3>SUBSCRIBE TO OUR NEWSLETTER</h3>
          <input
            type="email"
            placeholder="Insert Your e-mail address"
            className="footer-input"
          />
          <p className="footer-small-text">
            By clicking on “Subscribe”, you confirm that you have read and
            understood our <span>Privacy Statement</span> and that you agree to
            receive newsletter and other marketing communications.
          </p>
        </div>

        {/* Help Section */}
        <div className="footer-column">
          <h3>DO YOU NEED HELP ?</h3>
          <ul>
       <li><a href="tel:18779977232">Call us 1-877-997-7232</a></li>
            <li>Write us on WhatsApp</li>
            <li>Contacts</li>
            <li>FAQ</li>
            <li>Sitemap</li>
          </ul>
        </div>

        {/* Exclusive Services */}
        <div className="footer-column">
          <h3>EXCLUSIVE SERVICES</h3>
          <ul>
            <li>KZARRE</li>
            <li>Services</li>
            <li>Track your order</li>
            <li>Returns</li>
          </ul>
        </div>

        {/* Legal Terms */}
        <div className="footer-column">
          <h3>LEGAL TERMS AND CONDITIONS</h3>
          <ul>
            <li>Legal Notice</li>
            <li>Privacy</li>
            <li>Statement</li>
            <li>Cookie Policy</li>
            <li>Cookie Setting</li>
            <li>Terms of Sale</li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h3>COMPANY</h3>
          <ul>
            <li>About Kzaare</li>
            <li>Kzaare Group</li>
            <li>Sustainability</li>
            <li>Work with us</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">© KZARRÈ. 2025</div>
        <div className="footer-bottom-center">
          SHIPPING TO: UNITED STATES / ENGLISH
        </div>
        <div className="footer-bottom-right">STORE LOCATION</div>
      </div>
    </footer>
  );
};

export default Footer;
