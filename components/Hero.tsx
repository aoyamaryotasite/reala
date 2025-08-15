"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import styles from "../styles/Hero.module.css";
import HeroHeader from "./HeroHeader";

const rand = (min: number, max: number) =>
    Number((Math.random() * (max - min) + min).toFixed(2));

type Slide = { id: string; src: string; alt?: string; caption?: string };

export default function Hero() {
    // ここに画像リストを入れてください（/public 配下）
    const slides: Slide[] = [
        { id: "1", src: "/hero/1.webp", alt: "student" },
        { id: "2", src: "/hero/4.webp", alt: "close up" },
        { id: "3", src: "/hero/3.webp", alt: "at home" },
        { id: "4", src: "/hero/2.webp", alt: "at home" },
        // 追加OK
    ];

    // ====== ここから“流れるスライド”の制御 ======
    const setRef = useRef<HTMLDivElement>(null);   // スライド1セットのラッパ
    const beltRef = useRef<HTMLDivElement>(null);  // 全体（2セット並び）
    const [beltW, setBeltW] = useState(0);

    useEffect(() => {
        // 1セット分の実幅を計測 → CSS変数でアニメ距離＆所要時間に反映
        const update = () => {
            const w = setRef.current?.getBoundingClientRect().width ?? 0;
            setBeltW(w);
            if (beltRef.current) {
                const SPEED_PX_PER_SEC = 140; // ←流れる速さ（px/s）好みで調整
                beltRef.current.style.setProperty("--beltW", `${w}px`);
                beltRef.current.style.setProperty("--dur", `${w / SPEED_PX_PER_SEC}s`);
            }
        };
        update();
        // リサイズ時も追従
        const ro = new ResizeObserver(update);
        if (setRef.current) ro.observe(setRef.current);
        return () => ro.disconnect();
    }, []);

    return (
         <>
         <HeroHeader />
  <section className={styles.wrap} aria-label="Hero">
  

            {/* 見出し */}
            <div className={styles.headings}>
                <h1 className={styles.title}>Your Personalized Japanese Lessons</h1>
                <p className={styles.lead}>
                    From Daily Conversation to Business and JLPT Preparation — Tailored Support for Your Goals
                </p>
            </div>

            {/* ====== 大きめ・自動で右→左に永続ループするスライド ====== */}
            <div className={styles.slider}>
                <div className={styles.viewport}>
                    <div ref={beltRef} className={styles.belt} aria-hidden={false}>
                        {/* セットA（計測用） */}
                        <div ref={setRef} className={styles.set}>
                            {slides.map((s) => (
                                <article key={`A-${s.id}`} className={styles.slide}>
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
                        {/* セットB（複製）：切れ目なくループさせるため */}
                        <div className={styles.set} aria-hidden>
                            {slides.map((s) => (
                                <article key={`B-${s.id}`} className={styles.slide}>
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
