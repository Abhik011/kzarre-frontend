// utils/trafficTracker.js

// Fallback UUID generator (works everywhere)
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const trackVisit = () => {
  if (typeof window === "undefined") return;

  try {
    // Generate visitor ID if not exists
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      visitorId = generateUUID(); // ✅ Replaced crypto.randomUUID()
      localStorage.setItem("visitorId", visitorId);
    }

    const userId = localStorage.getItem("userId") || null;

    // Debug log (optional)
    console.log("📡 TRACKING VISIT:", {
      visitorId,
      userId,
      url: window.location.pathname,
    });

    // Send event to backend
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        userId,
        url: window.location.pathname,
        userAgent: navigator.userAgent,
      }),
    }).catch((err) => console.error("❌ Tracking request failed", err));

  } catch (err) {
    console.error("Traffic tracking failed:", err);
  }
};
