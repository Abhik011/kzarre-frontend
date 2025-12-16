"use client";
import { useEffect, useState } from "react";
import "./about.css";
import Image from "next/image";

type AboutData = {
  heroVideo?: string;
  content: {
    quote: { text: string; highlight: string };
    intro: string;
    body: string;
  };
  grid: {
    text?: string;
    images: string[];
  }[];
  footer: {
    text: string;
    heading: string;
  };
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/about`)
      .then(res => res.json())
      .then(data => setAbout(data.about));
  }, []);

  if (!about) return null;

  return (
    <div className="about-container">
      {/* HERO VIDEO */}
      {about.heroVideo && (
        <section className="hero-section">
          <video className="hero-video" autoPlay loop muted playsInline>
            <source src={about.heroVideo} type="video/mp4" />
          </video>
        </section>
      )}

      {/* TEXT SECTION */}
      <section className="about-content">
        <p className="quote">
          {about.content.quote.text}
          <span> “{about.content.quote.highlight}” </span>
        </p>

        <p className="intro">{about.content.intro}</p>

        <p className="text-block">{about.content.body}</p>
      </section>

      {/* IMAGE GRID */}
      <section className="image-grid">
        {about.grid.map((block, idx) => (
          <div key={idx} className="image-text">
            {block.text && <p>{block.text}</p>}

            {block.images.map((img, i) => (
              <Image key={i} src={img} alt="About image" width={400} height={500} />
            ))}
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <section className="about-footer">
        <p>{about.footer.text}</p>
        <h3>{about.footer.heading}</h3>
      </section>
    </div>
  );
}
