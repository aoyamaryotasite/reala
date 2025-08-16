"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/AboutCEO.module.css";

// 画像は Next.js の <Image> を使いたければ差し替えてOK
type Props = {
  heading?: string;
  imageSrc: string;
  imageAlt?: string;
  points: string[];
};

export default function AboutCEO({
  heading = "About the CEO",
  imageSrc,
  imageAlt = "CEO photo",
  points,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // 一度だけ発火
        }
      },
      {
        // 下方向に少し余裕を持って発火
        rootMargin: "0px 0px -20% 0px",
        threshold: 0.2,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.wrap} ${inView ? styles.isIn : ""}`}
      aria-labelledby="about-ceo"
    >
      <div className={styles.inner}>
        <div className={`${styles.textPane}`}>
          <h2 id="about-ceo" className={`${styles.title} ${styles.reveal}`} style={{ transitionDelay: "0ms" }}>
            {heading}
          </h2>

          <div className={styles.copy}>
            {points.map((p, i) => (
              <p
                key={i}
                className={`${styles.paragraph} ${styles.reveal}`}
                // 段階的にディレイ（テキストを順番に表示）
                style={{ transitionDelay: `${120 + i * 80}ms` }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.photoPane}>
          <img
            className={`${styles.photo} ${styles.reveal}`}
            src={imageSrc}
            alt={imageAlt}
            // テキストの後に写真がくっきり
            style={{ transitionDelay: `${120 + points.length * 80 + 120}ms` }}
          />
        </div>
      </div>
    </section>
  );
}
