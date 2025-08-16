"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/Who.module.css";

export default function Who() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const backdrop = section.querySelector(`.${styles.backdrop}`);
    const textBox = section.querySelector(`.${styles.textBox}`);
    const cards = section.querySelectorAll(`.${styles.card}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 順番にクラス付与
            setTimeout(() => backdrop.classList.add(styles.in), 100);
            setTimeout(() => textBox.classList.add(styles.in), 400);
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add(styles.in), 200 + i * 300);
            });
            observer.disconnect(); // 1回だけ実行
          }
        });
      },
      { threshold: 0.3 } // セクションの50%が見えたら発動
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} aria-labelledby="whoHeading" ref={sectionRef}>
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
          <Image src="/who/who1.webp" alt="" width={820} height={560} className={styles.img} priority />
        </figure>

        <figure className={`${styles.card} ${styles.cardTR}`}>
          <Image src="/who/who2.webp" alt="" width={560} height={760} className={styles.img} />
        </figure>

        <figure className={`${styles.card} ${styles.cardBL}`}>
          <Image src="/who/who3.webp" alt="" width={1120} height={620} className={styles.img} />
        </figure>
      </div>
    </section>
  );
}
