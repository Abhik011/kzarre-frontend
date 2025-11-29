"use client";
import React from "react";
import "./about.css";
import Image from "next/image";
import PageLayout from "../components/PageLayout";
import img2 from "../Assest/men.png";

export default function AboutPage() {
  return (
    <PageLayout>
    <div className="about-container">
      {/* Fullscreen Video Section */}
      <section className="hero-section">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/v1.mp4" typeof="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Text Section */}
      <section className="about-content">
        <p className="quote">
          Inspired by the sacred wisdom of the Bhagavad Gita,
          <span> “Karmanye vadhikaraste ma phaleshu kadachana” </span> — our
          philosophy embraces purposeful creation.
        </p>

        <p className="intro">
          At KZARRÈ, luxury is not merely a statement—it is a soulful journey
          woven with the threads of India’s rich heritage and timeless artistry.
        </p>

        <p className="text-block">
          Every piece we create is born from the hands of passionate artisans,
          each knot and weave a heartfelt expression of tradition passed down
          through generations. Rooted deeply in <span>Indian culture</span>, yet
          seen through a contemporary, global lens—our collections featuring
          exquisite pashmina shawls, cashmere, silk scarves, and hand-knotted
          rugs—are more than objects; they are stories waiting to be worn, felt,
          and cherished.
        </p>
      </section>

      {/* Image + Text Grid */}
      <section className="image-grid">
        <div className="image-text">
          <p>
            Inspired by the sacred wisdom of the Bhagavad Gita,
            <span> “Karmanye vadhikaraste ma phaleshu kadachana” </span> — we
            focus not on fleeting outcomes but on the devotion embedded in every
            thread.
          </p>
         
            <Image src={img2} alt="Warrior" />
            <Image src={img2} alt="Warrior" />
          
        </div>

        <div className="image-text">
         
            <Image src={img2} alt="Warrior" />
            <Image src={img2} alt="Warrior" />
         
          <p>
            At KZARRÈ, sustainability and uncompromising quality are commitments
            that honor the earth and the spirit of true craftsmanship—connecting
            past and present in soulful luxury.
          </p>
        </div>
      </section>

      {/* Closing Text */}
      <section className="about-footer">
        <p>
          With mindful craftsmanship and modern refinement, each KZARRÈ piece
          invites you to experience beauty beyond form—celebrating the art of
          slowing down, appreciating texture, simplicity, and the stories that
          unite us all.
        </p>
        <h3>Welcome to KZARRÈ — a legacy of art, heart, and heritage.</h3>
      </section>
    </div>
    </PageLayout>
  );
}
