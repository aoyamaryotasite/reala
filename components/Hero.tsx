"use client";

import Image from "next/image";
import { useRef, useEffect, useState, type CSSProperties } from "react";
import styles from "../styles/Hero.module.css";
import HeroHeader from "./HeroHeader";

const rand = (min: number, max: number) =>
  Number((Math.random() * (max - min) + min).toFixed(2));

type Slide = { id: string; src: string; alt?: string; caption?: string; speed?: number };

export default function Hero() {
  // /public 配下の画像を指定
  const slides: Slide[] = [
    { id: "1", src: "/hero/1.webp", alt: "student", speed: 0.18 },
    { id: "2", src: "/hero/4.webp", alt: "close up", speed: 0.28 },
    { id: "3", src: "/hero/3.webp", alt: "at home", speed: 0.12 },
    { id: "4", src: "/hero/2.webp", alt: "at home", speed: 0.22 },
  ];

  // ====== “流れるスライド”の制御 ======
  const setRef = useRef<HTMLDivElement>(null);  // 1セットのラッパー
  const beltRef = useRef<HTMLDivElement>(null); // ベルト全体（2セット横並び）
  const [beltW, setBeltW] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = Math.round(setRef.current?.offsetWidth ?? 0);
      setBeltW(w);
      if (beltRef.current) {
        const SPEED_PX_PER_SEC = 80;
        beltRef.current.style.setProperty("--beltW", `${w}px`);
        beltRef.current.style.setProperty("--dur", `${w / SPEED_PX_PER_SEC}s`);
      }
    };
    update();

    const ro = new ResizeObserver(update);
    if (setRef.current) ro.observe(setRef.current);
    return () => ro.disconnect();
  }, []);

  // ====== スクロール・パララックス（上下にふわっと） ======
  useEffect(() => {
    if (!beltRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return; // 動きが苦手なユーザー配慮

    const slidesEls = beltRef.current.querySelectorAll<HTMLElement>("[data-parallax='1']");
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        slidesEls.forEach((el) => {
          const speed = Number(el.dataset.speed || "0.2"); // 0.0〜0.5くらいが自然
          // 上下移動量（px）を控えめに
          const offset = Math.max(-40, Math.min(40, y * speed * 0.2));
          el.style.setProperty("--parY", `${offset.toFixed(2)}px`);
        });
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // 初期反映
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HeroHeader />
      <section className={styles.wrap} aria-label="Hero">
        {/* 見出し */}
        <div className={styles.headings}>
          <h1 className={styles.title}>Your Personalized Japanese Lessons</h1>
          <p className={styles.lead}>
            From Daily Conversation to Business and JLPT Preparation{" "}
            <span className={styles.break}></span> — Tailored Support for Your Goals
          </p>
        </div>

        {/* 自動で右→左にループするスライド（＋スクロール・パララックス） */}
        <div className={styles.slider}>
          <div className={styles.viewport}>
            <div ref={beltRef} className={styles.belt} aria-hidden={false}>
              {/* セットA（計測用） */}
              <div ref={setRef} className={styles.set}>
                {slides.map((s, i) => (
                  <article
                    key={`A-${s.id}`}
                    className={styles.slide}
                    data-parallax="1"
                    data-speed={String(s.speed ?? rand(0.12, 0.28))}
                    style={{ "--delay": `${i * 0.06}s` } as CSSProperties}
                  >
                    <Image
                      src={s.src}
                      alt={s.alt ?? ""}
                      fill
                      sizes="(max-width:768px) 85vw, 36vw"
                      className={styles.media}
                      priority
                    />
                    {s.caption && <p className={styles.cap}>{s.caption}</p>}
                  </article>
                ))}
              </div>

              {/* セットB（複製）：切れ目なくループ */}
              <div className={styles.set} aria-hidden>
                {slides.map((s, i) => (
                  <article
                    key={`B-${s.id}`}
                    className={styles.slide}
                    data-parallax="1"
                    data-speed={String((s.speed ?? 0.2) * 0.9)} // ほんの少しだけ差をつける
                    style={{ "--delay": `${i * 0.06}s` } as CSSProperties}
                  >
                    <Image
                      src={s.src}
                      alt=""
                      fill
                      sizes="(max-width:768px) 85vw, 36vw"
                      className={styles.media}
                      priority={false}
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
