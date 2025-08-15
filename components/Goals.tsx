"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/Goals.module.css";

export default function Goals() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const leadRef    = useRef<HTMLParagraphElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e.isIntersecting) return;

        // 1) 見出しアニメ開始
        titleRef.current?.classList.add(styles.start);

        // 2) 見出し終了 → 段落表示
        const onTitleEnd = () => {
          leadRef.current?.classList.add(styles.show);

          // 3) 段落表示後 → カード順番表示
          const cardEls = cardsRef.current?.querySelectorAll(`.${styles.card}`);
          cardEls?.forEach((el, i) => {
            (el as HTMLElement).style.transitionDelay = `${i * 0.15}s`;
            el.classList.add(styles.show);
          });
        };

        titleRef.current?.addEventListener("animationend", onTitleEnd, { once: true });

        io.unobserve(sec); // 一度だけ発火
      },
      { threshold: 0.1 }
    );

    io.observe(sec);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <h2 ref={titleRef} className={`${styles.title} ${styles.revealLeft}`}>
          Your Goals, Your Japanese
        </h2>

        <p ref={leadRef} className={`${styles.lead} ${styles.slideUp}`}>
       REALA Japanese Academy's lessons are tailored, one-on-one online Japanese lessons, customized to each student's specific goals and objectives. We value the "why" and "how" behind language learning, focusing not just on memorization but on building a practical understanding that you can actually use.
        </p>

        <div ref={cardsRef} className={styles.grid}>
          <figure className={styles.card}>
            <Image src="/cards/4.webp" alt="" width={520} height={520} className={styles.img}/>
          </figure>
          <figure className={styles.card}>
            <Image src="/cards/3.webp" alt="" width={520} height={520} className={styles.img}/>
          </figure>
          <figure className={styles.card}>
            <Image src="/cards/2.webp" alt="" width={520} height={520} className={styles.img}/>
          </figure>
          <figure className={styles.card}>
            <Image src="/cards/1.webp" alt="" width={520} height={520} className={styles.img}/>
          </figure>
        </div>
      </div>
    </section>
  );
}
