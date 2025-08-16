"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/Tutor.module.css";

export default function Tutor() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 一度だけ表示トリガー
 useEffect(() => {
  const el = sectionRef.current;
  if (!el) return;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        io.disconnect();
      }
    },
    { threshold: 0, rootMargin: "30% 0px -60% 0px" } // ← 早めに開始
  );
  io.observe(el);
  return () => io.disconnect();
}, []);

// スクロール進行度に応じて imageWrap の幅を 80%→100%（早め開始・早め終了）
useEffect(() => {
  if (!isVisible) return;
  const section = sectionRef.current!;
  const wrap = imageWrapRef.current!;
  let rafId = 0;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // ===== 調整用パラメータ =====
const START_VH = 1.0;  // セクションが画面下に来たら始める
const END_VH   = 0.1;  // 画面上の10%に来るまで広げる// セクション上端が 35vh まで来たら拡大終了（早め）
  // ==========================

  const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 2); // お好みで

  const update = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // rect.top が vh*START_VH → vh*END_VH の間を 0→1 に正規化
    const startY = vh * START_VH;
    const endY = vh * END_VH;
    const t = clamp((startY - rect.top) / (startY - endY));

    const widthPct = prefersReduced ? 100 : 80 + 20 * easeOut(t); // 80%→100%
    wrap.style.setProperty("--imgW", `${widthPct}%`);

    rafId = requestAnimationFrame(update);
  };

  // 初期値
  wrap.style.setProperty("--imgW", prefersReduced ? "100%" : "80%");
  rafId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(rafId);
}, [isVisible]);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="tutorHeading">
      <div className={styles.inner}>
        {/* 背景画像（幅は --imgW で制御） */}
        <div
          ref={imageWrapRef}
          className={`${styles.imageWrap} ${styles.reveal} ${isVisible ? styles.show : ""} ${styles.delayImage}`}
        >
          <Image
            src="/tutor/tutor2.webp"
            alt="Personal Japanese Tutor"
            width={500}
            height={700}
            className={styles.image}
            priority
          />
        </div>

        {/* かぶせるテキスト */}
        <div className={`${styles.textBox} ${styles.reveal} ${isVisible ? styles.show : ""} ${styles.delayText}`}>
          <h2 id="tutorHeading" className={styles.title}>
            We are “Personal Japanese Tutor”
          </h2>
          <p>“Which materials should I use?” “How can I master grammar?”</p>
          <p>We answer these questions with precise advice backed by expertise in language education.</p>
          <p>Even when you're unsure how to study, we'll be your partner, guiding you toward growth.</p>
        </div>
      </div>
    </section>
  );
}
