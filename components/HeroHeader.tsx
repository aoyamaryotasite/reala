"use client";

import Link from "next/link";
import Image from "next/image"; // ←追加
import styles from "../styles/Hero.module.css";

export default function HeroHeader() {
  return (
    <div className={styles.topbar}>
      <div className={styles.inner}>
      <p className={styles.brand}>
        <Image
          src="/logo.webp?ver=0816"        // ロゴファイルのパス（public配下）
          alt="REALA Logo"       // 説明文
          width={120}            // 適宜調整
          height={40}            // 適宜調整
          priority               // 表示優先
        />
      </p>
      <Link href="#contact-heading" className={styles.applyBtn}>
        Sign Up
      </Link>
    </div>
    </div>
  );
}
