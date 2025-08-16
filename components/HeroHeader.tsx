"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Hero.module.css";

export default function HeroHeader() {
  return (
    <div className={styles.topbar}>
      <div className={styles.inner}>
        <p className={styles.brand}>
          <Link href="/">
            <Image
              src="/logo.webp?ver=0816"
              alt="REALA Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </p>

        <Link href="/signup" className={styles.applyBtn}>
          <img src="/mail_icon.svg" alt="" className={styles.iconImg} />
          <span className={styles.applyBtnText}>Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
