"use client";

import { useEffect, useRef, useState } from "react";
import PlanSlide from "./PlanSlide";
import styles from "../styles/PlanLock.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Slide = { img: string; title: string; sub?: string; body: string };

export default function PlanLock({ slides }: { slides: Slide[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ===== モバイル判定 =====
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===== PC用: プレゼン風スナップ切替 =====
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.slide}`);
      if (!panels.length) return;

      // 初期状態：1枚目だけ見せる
      panels.forEach((panel, i) => {
        const text = panel.querySelector<HTMLElement>(`.${styles.text}`);
        gsap.set(panel, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 0 });
        if (text) gsap.set(text, { yPercent: i === 0 ? 0 : 100, autoAlpha: i === 0 ? 1 : 0 });
      });

      let lastIndex = 0;

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${(slides.length - 1) * window.innerHeight + 2}`, // ← 終端+1pxで取りこぼし防止
        pin: true,
        scrub: false, // 慣性カット
        snap: {
          snapTo: 1 / (slides.length - 1),
          duration: 0.45,
          ease: "power2.out",
        },
        onUpdate(self) {
          // 丸め誤差ケアのため ε を加えてから丸める
          const idx = Math.min(
            slides.length - 1,
            Math.round(self.progress * (slides.length - 1) + 0.001)
          );
          if (idx !== lastIndex) switchTo(idx);
        },
      });

      function switchTo(index: number) {
        console.log("switchTo", index);

        // 1) まず全パネルを即座にリセット（競合を絶対に残さない）
        panels.forEach((panel, i) => {
          const cover = panel.querySelector<HTMLElement>(`.${styles.cover}`);
          const text = panel.querySelector<HTMLElement>(`.${styles.text}`);

          gsap.killTweensOf([panel, cover, text]); // 競合殺す

          // パネルの表示状態を即セット（非アクティブは完全に消す）
          gsap.set(panel, { opacity: i === index ? 1 : 0, zIndex: i === index ? 2 : 0 });

          // cover は非アクティブは閉じた状態に戻しておく
          if (cover) gsap.set(cover, { xPercent: i === index ? 0 : 0, zIndex: 2 });

          // テキストは非アクティブを下に退避
          if (text) gsap.set(text, { yPercent: i === index ? 100 : 100, autoAlpha: i === index ? 0 : 0 });
        });

        // 2) アクティブだけ“見せるアニメ”を実行
        const activePanel = panels[index];
        const activeCover = activePanel.querySelector<HTMLElement>(`.${styles.cover}`);
        const activeText = activePanel.querySelector<HTMLElement>(`.${styles.text}`);

        // パネルはすでに opacity:1 なのでフェードは不要（競合を避けるためあえて to しない）

        // cover：左→右 wipe（immediateRender:false で初期フレームの食い違いを防ぐ）
        if (activeCover) {
          gsap.fromTo(
            activeCover,
            { xPercent: 0 },
            {
              xPercent: 100,
              duration: 0.6,
              ease: "power2.inOut",
              overwrite: true,
              immediateRender: false,
              onComplete: () => gsap.set(activeCover, { zIndex: 1 }), // テキストより下げる
            }
          );
        }

        // テキスト：下から上へ
        if (activeText) {
          // 開始値を強制してから上げる（fromTo の immediateRender 罠を避ける）
          gsap.set(activeText, { yPercent: 100, autoAlpha: 0 });
          gsap.to(activeText, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        lastIndex = index;
      }


      // 画像・レイアウト確定後に再計測（Next/Image対策 & リサイズ対策）
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      setTimeout(refresh, 0);

      // 初期確定（復帰時のズレ防止）
      switchTo(0);

      return () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
        st.kill();
      };
    });

    return () => ctx.revert();
  }, [isMobile, slides.length]);

  // ===== モバイル：縦積み =====
  if (isMobile) {
    return (
      <div className={styles.lockStage}>
        {slides.map((slide, i) => (
          <div key={i} className={`${styles.mobileSlide} ${styles.in}`}>
            <PlanSlide slide={slide} show />
          </div>
        ))}
      </div>
    );
  }

  // ===== PC：重ねて切替 =====
return (
  <div ref={containerRef} className={styles.lockStage}>
    {slides.map((s, i) => (
      <PlanSlide key={i} slide={s} />
    ))}
  </div>
);
}
