import React, { useEffect, useRef, useState } from "react";
import "./Stories.css";

const DEBUG_IMAGES = [
  "/Assest/g-img-1.png",
  "/Assest/g-img-2.png",
  "/Assest/g-img-3.png",
  "/Assest/g-img-4.png",
  "/Assest/g-img5.png",
  "/Assest/g-img5.png",
];

export default function StoriesSectionDebug() {
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);
  const isInteracting = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const stories = DEBUG_IMAGES.map((img, i) => ({
    id: i + 1,
    title: `Story ${i + 1}`,
    subtitle: "Subtitle",
    image: img,
  }));

  /** ✅ Detect center card */
  const detectCenter = () => {
    const container = containerRef.current;
    if (!container) return;

    const center = container.scrollLeft + container.clientWidth / 2;
    const cards = Array.from(container.querySelectorAll(".story-card"));

    let best = 0;
    let bestDist = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(center - cardCenter);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });

    setActiveIndex(best);
  };

  /** ✅ AUTO SCROLL (MOBILE SAFE) */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let direction = 1;
    const speed = 0.6;

    autoScrollRef.current = setInterval(() => {
      if (!isInteracting.current) {
        container.scrollLeft += speed * direction;

        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 2
        ) {
          direction = -1;
        } else if (container.scrollLeft <= 0) {
          direction = 1;
        }

        detectCenter();
      }
    }, 16); // ~60fps

    return () => clearInterval(autoScrollRef.current);
  }, []);

  /** ✅ PAUSE AUTO SCROLL ON TOUCH / MOUSE */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pause = () => {
      isInteracting.current = true;
    };

    const resume = () => {
      setTimeout(() => {
        isInteracting.current = false;
      }, 500);
    };

    container.addEventListener("touchstart", pause, { passive: true });
    container.addEventListener("touchend", resume);
    container.addEventListener("mousedown", pause);
    container.addEventListener("mouseup", resume);
    container.addEventListener("mouseleave", resume);

    return () => {
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
      container.removeEventListener("mousedown", pause);
      container.removeEventListener("mouseup", resume);
      container.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <section className="stories-sectioni">
      <h2 className="stories-title">Our Stories</h2>

      <div
        ref={containerRef}
        className="stories-scroll"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="stories-grid">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className={`story-card ${idx === activeIndex ? "active" : ""}`}
            >
              <img
                className="story-img"
                src={s.image}
                alt={s.title}
                draggable="false"
              />
              <h3>{s.title}</h3>
              <p>{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
