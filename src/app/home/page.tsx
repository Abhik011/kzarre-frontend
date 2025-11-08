
'use client';

import React, { CSSProperties } from 'react';
import Bannerone from '../components/Bannerone';
import BannerToggle from '../components/BannerToggle';
import Bannertwo from '../components/Bannertwo';
import Stories from '../components/Stories';


export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={styles.video}
        >
          <source src="/v1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Optional overlay content */}
        <div style={styles.overlayText}>
          {/* <h1 style={styles.heading}>Welcome to Our Collection</h1> */}
        </div>
      </section>

      {/* Spacer */}
      <div style={{ height: '80px' }}></div>

      {/* Banners Section */}
      <section style={styles.bannerSection}>
        <div style={styles.bannerContainer}>
          <Bannerone />
        </div>
        <div style={styles.bannerContainer}>
          <BannerToggle />
        </div>
            <div style={styles.bannerContainer}>
          <Bannertwo />
        </div>
      </section>
      
              <div style={styles.storyies}>
          <Stories />
        </div>
    </>
  );
}



const styles: Record<string, CSSProperties> = {
  heroSection: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    paddingTop: '69px',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  overlayText: {
    position: 'absolute',
    top: '50%',
    left: '0%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#fff',
  },
  heading: {
    fontSize: '48px',
    fontWeight: 700,
    fontFamily: 'Lora, serif',
  },
  bannerSection: {
    maxWidth: '1440px',
    margin: '0 auto',
    // padding: '0 40px',
  },
  bannerContainer: {
    margin: '0px',
  },
  storyies: {
    width: '100vw',
  },
};

