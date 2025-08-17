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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  // ===== モバイル判定（SSR/CSR差分回避のため初期は null） =====
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===== PC用アニメーション =====
  useEffect(() => {
    if (isMobile === null || isMobile || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.slide}`);
      if (!panels.length) return;

      panels.forEach((panel, i) => {
        const text = panel.querySelector<HTMLElement>(`.${styles.text}`);
        gsap.set(panel, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 0 });
        if (text) gsap.set(text, { yPercent: i === 0 ? 0 : 100, autoAlpha: i === 0 ? 1 : 0 });
      });

      let lastIndex = 0;
      const st = ScrollTrigger.create({
        id: "planLock",
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${(slides.length - 1) * window.innerHeight + 2}`,
        pin: true,
        scrub: false,
        snap: {
          snapTo: 1 / (slides.length - 1),
          duration: 0.45,
          ease: "power2.out",
        },
        onUpdate(self) {
          const idx = Math.min(
            slides.length - 1,
            Math.round(self.progress * (slides.length - 1) + 0.001)
          );
          if (idx !== lastIndex) switchTo(idx);
        },
        onToggle(self) {
          if (titleRef.current) {
            titleRef.current.classList.toggle(styles.show, self.isActive);
          }
        },
      });

      if (titleRef.current) {
        titleRef.current.classList.toggle(styles.show, st.isActive);
      }

      function switchTo(index: number) {
        const panels = gsap.utils.toArray<HTMLElement>(`.${styles.slide}`);
        panels.forEach((panel, i) => {
          const cover = panel.querySelector<HTMLElement>(`.${styles.cover}`);
          const text = panel.querySelector<HTMLElement>(`.${styles.text}`);
          gsap.killTweensOf([panel, cover, text]);
          gsap.set(panel, { opacity: i === index ? 1 : 0, zIndex: i === index ? 2 : 0 });
          if (cover) gsap.set(cover, { xPercent: 0, zIndex: 2 });
          if (text) gsap.set(text, { yPercent: 100, autoAlpha: 0 });
        });

        const active = panels[index];
        const activeCover = active.querySelector<HTMLElement>(`.${styles.cover}`);
        const activeText = active.querySelector<HTMLElement>(`.${styles.text}`);

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
              onComplete: () => gsap.set(activeCover, { zIndex: 1 }),
            }
          );
        }

        if (activeText) {
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

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      setTimeout(refresh, 0);
      switchTo(0);

      return () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
      };
    }, containerRef);

    return () => {
      ctx.revert(); // ScrollTrigger/gsap を一括解除
      if (titleRef.current) titleRef.current.classList.remove(styles.show);
    };
  }, [isMobile, slides.length]);

  // ===== モバイル用アニメーション =====
  const mobileRefs = useRef<HTMLDivElement[]>([]);
  mobileRefs.current = [];

  const setMobileRef = (el: HTMLDivElement | null) => {
    if (el && !mobileRefs.current.includes(el)) mobileRefs.current.push(el);
  };

  useEffect(() => {
    if (isMobile !== true) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLDivElement;
          if (entry.isIntersecting) {
            el.classList.add(styles.in);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    mobileRefs.current.forEach((el, i) => {
      el.style.setProperty("--delay", `${i * 120}ms`);
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, [isMobile, slides.length]);

  // ===== レンダリング =====
  if (isMobile === null) {
    // SSR時のプレースホルダー
    return <div style={{ minHeight: "100vh" }} />;
  }

  if (isMobile) {
    return (
      <>
        <h2 className="plan-title">PLAN</h2>
        <div className={styles.lockStage}>
          {slides.map((slide) => (
            <div key={slide.title} ref={setMobileRef} className={styles.mobileSlide}>
              <PlanSlide slide={slide} show />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div ref={containerRef} className={styles.lockStage}>
        <h2 className="plan-title" ref={titleRef}>
          PLAN
        </h2>
        {slides.map((s) => (
          <PlanSlide key={s.title} slide={s} />
        ))}
      </div>
    </>
  );
}
