"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/Who.module.css";

export default function Who() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const backdrop = section.querySelector<HTMLDivElement>(`.${styles.backdrop}`);
    const textBox = section.querySelector<HTMLDivElement>(`.${styles.textBox}`);
    const cards = section.querySelectorAll<HTMLElement>(`.${styles.card}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (backdrop) setTimeout(() => backdrop.classList.add(styles.in), 100);
            if (textBox) setTimeout(() => textBox.classList.add(styles.in), 400);
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add(styles.in), 200 + i * 300);
            });
            observer.disconnect(); // 1回だけ実行
          }
        });
      },
      { threshold: 0.3 } // セクションの30%が見えたら発動
    );

    observer.observe(section);

    // ===== スクロール時ズーム処理 =====
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const imgs = document.querySelectorAll<HTMLImageElement>(`.${styles.img}`);
        imgs.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // 画像が画面中央に近いほど ratio が 1 に近づく
          const visibleRatio = Math.max(
            0,
            Math.min(
              1,
              1 -
                Math.abs(rect.top + rect.height / 2 - windowHeight / 2) /
                  (windowHeight / 2)
            )
          );

          // スケールを 1 ~ 1.1 の範囲で調整
          const scale = 1 + visibleRatio * 0.1;
          img.style.transform = `scale(${scale})`;
        });
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初期実行

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      className={styles.section}
      aria-labelledby="whoHeading"
      ref={sectionRef}
    >
      <div className={styles.wrap}>
        <div className={styles.backdrop} aria-hidden />
        <div className={styles.textBox}>
          <h2 id="whoHeading" className={styles.title}>
            Perfect for learners who…
          </h2>
          <ul className={styles.list}>
            <li>Live in Japan or plan to move here</li>
            <li>Need Japanese for work or daily life</li>
            <li>Aim to pass the JLPT (N5–N2)</li>
            <li>Prefer clear explanations in English</li>
          </ul>
        </div>

        <figure className={`${styles.card} ${styles.cardTL}`}>
          <Image
            src="/who/who1.webp"
            alt=""
            width={820}
            height={560}
            className={styles.img}
            priority
          />
        </figure>

        <figure className={`${styles.card} ${styles.cardTR}`}>
          <Image
            src="/who/who2.webp"
            alt=""
            width={560}
            height={760}
            className={styles.img}
          />
        </figure>

        <figure className={`${styles.card} ${styles.cardBL}`}>
          <Image
            src="/who/who3.webp"
            alt=""
            width={1120}
            height={620}
            className={styles.img}
          />
        </figure>
      </div>
    </section>
  );
}
