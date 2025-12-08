'use client';

import React, { useEffect, useState } from 'react';
import Bannerone from '../components/Bannerone';
import BannerToggle from '../components/BannerToggle';
import Bannertwo from '../components/Bannertwo';
import Stories from '../components/Stories';
import Loading from '../loading';
import Cookies from "js-cookie";
import Bannergridwomens from "../components/Bannergridwomens";
import './home.css';
import PageLayout from "../components/PageLayout";



interface BannersData {
  bannerOne?: any;
  bannerTwo?: any;
  [key: string]: any;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [banners, setBanners] = useState<BannersData>({});
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  const fetchCMSData = async () => {
    try {
      // ✅ 1. Instant load from cookie (fastest)
      const cachedVideo = Cookies.get("hero_video");
      const cachedBanners = Cookies.get("home_banners");

      if (cachedVideo) setVideoUrl(cachedVideo);
      if (cachedBanners) setBanners(JSON.parse(cachedBanners));

      // ✅ 2. Fetch fresh data from CMS (background)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cms-content/public`,
        { cache: "no-store" }
      );

      const data = await res.json();

      console.log("🎥 CMS PUBLIC DATA:", data);

      // ✅ 3. Update state
      if (data?.heroVideoUrl) {
        setVideoUrl(data.heroVideoUrl);

        // ✅ Store in cookie for next visit (1 day)
        Cookies.set("hero_video", data.heroVideoUrl, { expires: 1 });
      }

      if (data?.banners) {
        setBanners(data.banners);
        Cookies.set("home_banners", JSON.stringify(data.banners), {
          expires: 1,
        });
      }
    } catch (err) {
      console.error("❌ Error fetching CMS public data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCMSData();
}, []);


  if (loading) return <Loading />;

  return (
    <PageLayout>
    <>
      {/* =============================
          HERO VIDEO
      ============================== */}
      <section className="hero-section">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
             preload="auto"        // ✅ NOT metadata
            fetchPriority="high" 
            {...({ fetchPriority: "high" } as any)} 
            className="hero-video"
            key={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="no-video">
            <p>No approved video is currently available.</p>
          </div>
        )}
      </section>
        <div className="banner-container banner-1">
          <Bannerone />
        </div>

        <div className="banner-container1 banner-toggle">
          <BannerToggle />
        </div>
         <div className="banner-container3 ">
         <Bannergridwomens/>
        </div>

        <div className="banner-container banner-2">
          <Bannertwo />
        </div>
     

      <div className="stories-section">
        <Stories />
      </div>
   
    </>
    </PageLayout>
  );
}
