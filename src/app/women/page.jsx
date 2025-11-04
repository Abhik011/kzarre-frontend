"use client";
import React from "react";
import "./Styles.css";
import Link from 'next/link';

const images = [
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
  "/Assest/W-img.png",
];

const WomenPage = () => {
  return (
    <section className="gallery">
      {/* 1st Row of 3 images */}
      {images.slice(0, 3).map((src, index) => (
        <div key={index} className="gallery-item">
          <Link href="/product">
          <img src={src} alt={`Gallery ${index}`} />
          <p>There are many variations of passages of Lorem</p>
          </Link>
        </div>
      ))}

      {/* --- Video Section --- */}
      <div className="gallery-video">
        <video
          src="/v1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="heritage-video"
        ></video>
      </div>

      {/* Remaining Images */}
      {images.slice(3).map((src, index) => (
        <div key={index + 3} className="gallery-item">
          <Link href="/product">
          <img src={src} alt={`Gallery ${index + 3}`} />
          <p>There are many variations of passages of Lorem</p>
          </Link>
        </div>
      ))}
    </section>
  );
};

export default WomenPage;
