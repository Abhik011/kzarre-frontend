"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../Assest/logo.png";
import searchIcon from "../Assest/icons/search.svg";
import userIcon from "../Assest/icons/user.svg";
import bagIcon from "../Assest/icons/bag.svg";
import './header.css' 


const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <div className="container">
        {/* Left Section */}
        <div className="nav-left lsp-3">
          {/* ✅ Single Toggle Button (Menu / Close) */}

          <Link href="/search" className="hide-mobile">
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </Link>
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

        {/* Center: Logo */}
        <div className="logo">
          <Link href="/home">
            <Image src={logo} alt="KZARRÈ Logo" className="logo-img" />
          </Link>
        </div>

        {/* Right Section */}
        <div className="nav-right lsp-3">
          <Link href="/about" className="hide-mobile">
            ORIGIN STORY
          </Link>
          <Link href="/bag">
            <Image src={bagIcon} alt="Bag" width={24} height={24} />
          </Link>
          <Link href="/profile">
            <Image src={userIcon} alt="Profile" width={24} height={24} />
          </Link>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
 
    </header>
  );
};

export default Header;
