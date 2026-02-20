"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./maintenance.module.css";
import Image from "next/image";

export default function MaintenancePage() {
  const router = useRouter();
  const [eta, setEta] = useState(null);
  const [countdown, setCountdown] = useState("");


  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>    
            <Image
          src="/Asset/logo.png"
          alt="KZARRĒ"
          width={300}
          height={50}
          priority
        /></div>

        <h1 className={styles.title}>We’ll Be Back Soon</h1>

        <p className={styles.subtitle}>
          Our website is currently undergoing scheduled maintenance.
          We’re improving things behind the scenes.
        </p>

        <div className={styles.divider} />

        {countdown && (
          <p className={styles.countdown}>{countdown}</p>
        )}

        <div className={styles.spinner} />

        <div className={styles.footer}>
          © {new Date().getFullYear()} KZARRĒ
        </div>
      </div>
    </div>
  );
}
