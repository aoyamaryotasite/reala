"use client";

import Image from "next/image";
import styles from "../styles/Who.module.css";

export default function Who() {
  return (
    <section className={styles.section} aria-labelledby="whoHeading">
      <div className={styles.wrap}>
        {/* 背景の水色ブロック */}
        <div className={styles.backdrop} aria-hidden />

        {/* 右側のテキスト */}
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

        {/* 左上の写真 */}
        <figure className={`${styles.card} ${styles.cardTL}`}>
          <Image
            src="/who/who1.png"
            alt=""
            width={820}
            height={560}
            className={styles.img}
            priority
          />
        </figure>

        {/* 右側の写真 */}
        <figure className={`${styles.card} ${styles.cardTR}`}>
          <Image
            src="/who/who2.png"
            alt=""
            width={560}
            height={760}
            className={styles.img}
          />
        </figure>

        {/* 左下の横長写真 */}
        <figure className={`${styles.card} ${styles.cardBL}`}>
          <Image
            src="/who/who3.png"
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
