import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../Assest/logo.png';
import searchIcon from '../Assest/icons/search.svg';
import userIcon from '../Assest/icons/user.svg';
import bagIcon from '../Assest/icons/bag.svg';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        {/* Left: Search + Navigation */}
        <div className="nav-left lsp-3">
          <Link href="/search">
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </Link>
          <Link href="/heritage" >HERITAGE</Link>
          <Link href="/women">WOMEN</Link>
          <Link href="/men">MEN</Link>
          <Link href="/accessories">ACCESSORIES</Link>
        </div>

        {/* Center: Logo */}
        <div className="logo">
          <Link href="/home">
            <Image
              src={logo}
              alt="KZARRÈ Logo"
              width={167}
              height={26}
            />
          </Link>
        </div>

        {/* Right: Profile, Bag, About Us */}
        <div className="nav-right lsp-3">
          <Link href="/about">ORIGIN STORY</Link>
          <Link href="/cart">
            <Image src={bagIcon} alt="Bag" width={24} height={24} />
          </Link>
          <Link href="/profile">
            <Image src={userIcon} alt="Profile" width={24} height={24} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
