"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Hero.module.css";

function Wavy({ text }: { text: string }) {
  // アクセシビリティ: 全体に aria-label、子文字は aria-hidden
  return (
    <span className={styles.wavy} role="text" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ ["--i" as any]: i }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function HeroHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.inner}>
          <p className={styles.brand}>
            <Link href="/" aria-label="Home">
              <Image src="/logo.webp?ver=0816" alt="REALA Logo" width={120} height={40} priority />
            </Link>
          </p>

          <div className={styles.rightControls}>
            <button
              type="button"
              className={`${styles.menuBtn} ${open ? styles.menuBtnOpen : ""}`}
              aria-label="グローバルメニューを開閉"
              aria-expanded={open}
              aria-controls="global-nav"
              onClick={() => setOpen(v => !v)}
            >
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
            </button>

            <Link href="/signup" className={styles.applyBtn}>
              <img src="/mail_icon.svg" alt="" className={styles.iconImg} />
              <span className={styles.applyBtnText}>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        id="global-nav"
        role="dialog"
        aria-modal="true"
        className={`${styles.gnav} ${open ? styles.gnavOpen : ""}`}
        onClick={closeMenu}
      >
        <div className={styles.gnavInner} onClick={(e) => e.stopPropagation()}>
          <button type="button" className={styles.gnavClose} aria-label="メニューを閉じる" onClick={closeMenu}>×</button>

          {/* 1行目：横並びのメインメニュー */}
          <nav className={styles.mainRow} aria-label="グローバルメニュー">
            <ul className={styles.mainLinks}>
              <li><Link href="/" onClick={closeMenu}><Wavy text="TOP" /></Link></li>
              <li><Link href="/signup" onClick={closeMenu}><Wavy text="SIGN UP" /></Link></li>
              <li><Link href="/columns" onClick={closeMenu}><Wavy text="COLUMNS" /></Link></li>
              <li><Link href="/privacy-policy" onClick={closeMenu}><Wavy text="PRIVACY POLICY" /></Link></li>
            </ul>
          </nav>

          <div className={styles.snsCol}>
            <p className={styles.colTtl}>SNS</p>
            <div className={styles.snsRow}>
              <p>COMMING SOON</p>
              {/* <a href="#" aria-label="Instagram" onClick={closeMenu}><Wavy text="IG" /></a>
              <a href="#" aria-label="TikTok" onClick={closeMenu}><Wavy text="TK" /></a> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
