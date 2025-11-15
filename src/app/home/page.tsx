'use client';
import React, { CSSProperties, useEffect, useState } from 'react';
import Bannerone from '../components/Bannerone';
import BannerToggle from '../components/BannerToggle';
import Bannertwo from '../components/Bannertwo';
import Stories from '../components/Stories';
import Loading from '../loading';

export default function Home() {

 const [videoUrl, setVideoUrl] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchCMSVideo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`);
        const data = await res.json();
        console.log("🎥 CMS video fetched:", data);

        if (data?.heroVideoUrl) {
          setVideoUrl(data.heroVideoUrl);
        } else {
          console.warn("⚠️ No approved hero video found");
          setVideoUrl(null);
        }
      } catch (err) {
        console.error("❌ Error fetching CMS video:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCMSVideo();
  }, []);

 if (loading) {
    return <Loading />;
  }
  return (
    <>
<section style={styles.heroSection}>
      {loading ? (
        <div style={styles.loader}>Loading video...</div>
      ) : videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          style={styles.video}
          key={videoUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={styles.noVideo}>
          <p>No approved video is currently available.</p>
        </div>
      )}
    </section>

      {/* ✅ Banners Section */}
      <section style={styles.bannerSection}>
        <div style={styles.bannerContainer}>
          <Bannerone />
        </div>
        <div style={styles.bannerContainer}>
          <BannerToggle />
        </div>
        <div style={styles.bannerContainer1}>
          <Bannertwo />
        </div>
      </section>

      {/* ✅ Stories Section */}
      <div style={styles.storyies}>
        <Stories />
      </div>
    </>
  );
}

// ===========================================================
// ✅ Styles (unchanged)
// ===========================================================
const styles: Record<string, CSSProperties> = {
  heroSection: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    marginTop: '69px',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0, 
  },
  loader: {
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '18px',
  },
  overlayText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#fff',
    zIndex: 2,
  },
  heading: {
    fontSize: '48px',
    fontWeight: 700,
    fontFamily: 'Lora, serif',
    textShadow: '0px 2px 10px rgba(0, 0, 0, 0.6)',
  },
  bannerSection: {
    // maxWidth: '1440px',
    width: '100vw',
    marginTop: "90px",
  },
  bannerContainer: {
    marginBottom: '60px',
    paddingLeft: '0px',
    
  },
  bannerContainer1: {
    marginTop: '90px',
  },
  storyies: {
    marginTop: '100px',
    width: '100vw',
  },
};
