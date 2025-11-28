"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import logo from "../Assest/logo.png";
import searchIcon from "../Assest/icons/search.svg";
import userIcon from "../Assest/icons/user.svg";
import bagIcon from "../Assest/icons/bag.svg";
import menuIcon from "../Assest/icons/menu.svg";
import closeIcon from "../Assest/icons/close.svg";
import { IoClose } from "react-icons/io5";

import "./header.css";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="container">
          {/* LEFT */}
          <div className="nav-left lsp-3">
            <Image
              src={searchIcon}
              alt="Search"
              width={20}
              height={20}
              className="desktop-search hide-mobile"
              onClick={() => setSearchOpen(true)}
              style={{ cursor: "pointer" }}
            />

            <Image
              src={searchIcon}
              alt="Search"
              width={20}
              height={20}
              className="mobile-search"
              onClick={() => setSearchOpen(true)}
              style={{ cursor: "pointer", marginRight: "15px" }}
            />

            <Link href="/heritage" className="hide-mobile">
              HERITAGE
            </Link>
            <Link href="/women" className="hide-mobile">
              WOMEN
            </Link>
            <Link href="/men" className="hide-mobile">
              MEN
            </Link>
            <Link href="/accessories" className="hide-mobile">
              ACCESSORIES
            </Link>
          </div>

          {/* CENTER LOGO */}
          <div className="logo">
            <Link href="/home">
              <Image src={logo} alt="KZARRÈ Logo" className="logo-img" />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="nav-right lsp-3">
            <Link href="/about" className="hide-mobile">
              ORIGIN STORY
            </Link>

            <Link href="/bag" className="hide-mobile">
              <Image src={bagIcon} alt="Bag" width={20} height={20} />
            </Link>

            <Link href="/profile" className="hide-mobile">
              <Image src={userIcon} alt="Profile" width={20} height={20} />
            </Link>

            {/* MOBILE HAMBURGER */}
            <div
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Image
                src={menuOpen ? closeIcon : menuIcon}
                alt="Menu Toggle"
                width={22}
                height={22}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}>
        <div className="mobile-nav-items">
          <Link href="/heritage" onClick={() => setMenuOpen(false)}>
            HERITAGE
          </Link>
          <Link href="/women" onClick={() => setMenuOpen(false)}>
            WOMEN
          </Link>
          <Link href="/men" onClick={() => setMenuOpen(false)}>
            MEN
          </Link>
          <Link href="/accessories" onClick={() => setMenuOpen(false)}>
            ACCESSORIES
          </Link>

          <div className="mobile-lower-links">
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              ORIGIN STORY
            </Link>
            <Link href="/services" onClick={() => setMenuOpen(false)}>
              SERVICES
            </Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              PROFILE
            </Link>
          </div>
        </div>
      </div>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
     <button className="search-close" onClick={() => setSearchOpen(false)}>
  <IoClose size={32} color="#D2BD50" />
</button>
        </div>

        <button
          className="search-submit"
          onClick={() => {
            if (searchQuery.trim().length > 0) {
              window.location.href = `/search?query=${searchQuery}`;
            }
          }}
        >
          Search
        </button>
      </div>
    </>
  );
};

export default Header;
