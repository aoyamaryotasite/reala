"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/Tutor.module.css";

export default function Tutor() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect(); // 一度表示したら監視終了
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="tutorHeading"
    >
      <div className={styles.inner}>
        {/* 背景画像 */}
        <div
          className={`${styles.imageWrap} ${styles.reveal} ${
            isVisible ? styles.show : ""
          } ${styles.delayImage}`}
        >
          <Image
            src="/tutor.webp"
            alt="Personal Japanese Tutor"
            width={500}
            height={700}
            className={styles.image}
            priority
          />
        </div>

        {/* かぶせるテキスト */}
        <div
          className={`${styles.textBox} ${styles.reveal} ${
            isVisible ? styles.show : ""
          } ${styles.delayText}`}
        >
          <h2 id="tutorHeading" className={styles.title}>
            We are “Personal Japanese Tutor”
          </h2>
          <p>“Which materials should I use?” “How can I master grammar?”</p>
          <p>
            We answer these questions with precise advice backed by expertise in
            language education.
          </p>
          <p>
            Even when you’re unsure how to study, we’ll be your partner, guiding
            you toward growth.
          </p>
        </div>
      </div>
    </section>
  );
}
