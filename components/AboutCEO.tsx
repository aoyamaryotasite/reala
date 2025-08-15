import React from "react";
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
  return (
    <section className={styles.wrap} aria-labelledby="about-ceo">
      <div className={styles.inner}>
        <div className={styles.textPane}>
          <h2 id="about-ceo" className={styles.title}>
            {heading}
          </h2>

          <div className={styles.copy}>
            {points.map((p, i) => (
              <p key={i} className={styles.paragraph}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.photoPane}>
          <img className={styles.photo} src={imageSrc} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
