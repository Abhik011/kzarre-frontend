import React, { useEffect, useRef, useState } from "react";
import "./Stories.css"; // your CSS

const DEBUG_IMAGES = [
  "/Assest/g-img-1.png",
  "/Assest/g-img-2.png",
  "/Assest/g-img-3.png",
  "/Assest/g-img-4.png",
  "/Assest/g-img5.png",
];

export default function StoriesSectionDebug() {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const isInteracting = useRef(false);
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const stories = DEBUG_IMAGES.map((img, i) => ({
    id: i + 1,
    title: `Story ${i + 1}`,
    subtitle: "Subtitle",
    image: img,
  }));

  // Basic center detection (for visual scaling)
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

  // Pointer drag handlers (mouse + touch)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e) => {
      isPointerDown.current = true;
      isInteracting.current = true;
      startX.current = (e.clientX ?? (e.touches && e.touches[0].clientX)) || 0;
      startScroll.current = container.scrollLeft;
      container.style.cursor = "grabbing";
    };
    const onPointerMove = (e) => {
      if (!isPointerDown.current) return;
      const clientX = (e.clientX ?? (e.touches && e.touches[0].clientX)) || 0;
      const walk = (clientX - startX.current) * 1.2;
      container.scrollLeft = startScroll.current - walk;
      detectCenter();
    };
    const onPointerUp = () => {
      isPointerDown.current = false;
      container.style.cursor = "grab";
      // resume auto-scroll after short delay
      setTimeout(() => (isInteracting.current = false), 700);
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointermove", onPointerMove);

    // touch fallbacks
    container.addEventListener("touchstart", onPointerDown, { passive: true });
    container.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("touchstart", onPointerDown);
      container.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, []);

  // Auto-scroll loop (simple back-and-forth). Logs sizes for debugging.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let direction = 1;
    const speed = 0.6; // px per frame

    // Debug log once at start
    console.log("[ScrollDebug] container width:", container.clientWidth, " content width:", container.scrollWidth);

    const step = () => {
      // If content not overflowing, nothing to scroll — log and stop
      if (container.scrollWidth <= container.clientWidth + 1) {
        // helpful debug
        // console.warn("[ScrollDebug] content fits container; auto-scroll disabled");
        cancelAnimationFrame(rafRef.current);
        return;
      }

      if (!isInteracting.current) {
        container.scrollLeft += speed * direction;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
          direction = -1;
        } else if (container.scrollLeft <= 0) {
          direction = 1;
        }
        detectCenter();
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Pause auto-scroll when hovering to allow user to interact
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onEnter = () => (isInteracting.current = true);
    const onLeave = () => setTimeout(() => (isInteracting.current = false), 500);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="stories-section">
      <h2>Our Stories</h2>

      <div
        ref={containerRef}
        className="stories-scroll"
        style={{ cursor: "grab", WebkitOverflowScrolling: "touch" }}
      >
        <div className="stories-grid">
          {stories.map((s, idx) => (
            <div key={s.id} className={`story-card ${idx === activeIndex ? "active" : ""}`}>
              <img
                className="story-img"
                src={s.image}
                alt={s.title}
                onLoad={() =>
                  console.log(`[ScrollDebug] image loaded idx:${idx} naturalWidth:${event?.target?.naturalWidth}`)
                }
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
