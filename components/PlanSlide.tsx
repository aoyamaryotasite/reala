"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/PlanLock.module.css";

type Slide = { img: string; title: string; sub?: string; body: string };

export default function PlanSlide({
  slide,
  markFirst,
  show = false,
  wipe = false,
  onWipeDone,
}: {
  slide: Slide;
  markFirst?: boolean;
  show?: boolean;
  wipe?: boolean;
  onWipeDone?: () => void;
}) {
  const figRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    fig.classList.remove(styles.wipe);
    fig.classList.add(styles.opened);
  }, [slide.img]);

  useEffect(() => {
    if (!wipe) return;
    const fig = figRef.current;
    if (!fig) return;

    const cover = fig.querySelector<HTMLElement>(`.${styles.cover}`);
    if (!cover) return;

    fig.classList.remove(styles.opened);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    cover.offsetHeight;

    const onEnd = () => {
      fig.classList.remove(styles.wipe);
      fig.classList.add(styles.opened);
      cover.removeEventListener("animationend", onEnd);
      onWipeDone?.();
    };
    fig.classList.add(styles.wipe);
    cover.addEventListener("animationend", onEnd);

    return () => cover.removeEventListener("animationend", onEnd);
  }, [wipe, onWipeDone]);

  return (
    <div className={`${styles.slide} ${show ? styles.in : ""}`}>
      <div
        ref={figRef}
        className={styles.figure}
        data-first={markFirst ? "true" : undefined}
      >
        <div className={styles.cover} aria-hidden />
        <Image
          src={slide.img}
          alt=""
          width={1200}
          height={800}
          className={styles.img}
        />
      </div>

      {/* 🟢 overflow:hidden を追加 */}
      <div className={styles.textWrapper}>
        <div className={styles.text}>
          <h3 className={styles.h}>
            {slide.title}
            {slide.sub && <small className={styles.sub}> ({slide.sub})</small>}
          </h3>
          <p className={styles.p}>{slide.body}</p>
        </div>
      </div>
    </div>
  );
}
