"use client";

import { useEffect, useRef, useState } from "react";
import PlanSlide from "./PlanSlide";
import styles from "../styles/PlanLock.module.css";

type Slide = { img: string; title: string; sub?: string; body: string };

export default function PlanLock({
  slides,
  nextAnchorId = "after-plans",
  triggerOffsetPx = 20,
  enterRatio = 0.72,
  exitRatio = 0.55,
  rootMarginPx = 0,
  escapeUpPx = 48,
}: {
  slides: Slide[];
  nextAnchorId?: string;
  triggerOffsetPx?: number;
  enterRatio?: number;
  exitRatio?: number;
  rootMarginPx?: number;
  escapeUpPx?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // モバイル判定
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

    // モバイル判定
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

    // ===== モバイル時のふわっと表示 =====
  const [visibleSlides, setVisibleSlides] = useState<boolean[]>(() =>
    slides.map(() => false)
  );
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleSlides((prev) => {
              if (prev[index]) return prev; // すでに表示済み
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(`.${styles.mobileSlide}`);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isMobile]);


  // PC用のロック機能
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const [wipe, setWipe] = useState(false);

  const idxRef = useRef(0);
  const lockEnabledRef = useRef(false);
  const completedRef = useRef(false);
  const lockedNavRef = useRef(false);
  const inViewportRef = useRef(false);
  const lockedScrollYRef = useRef(0);

  const last = slides.length - 1;
  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    if (isMobile) return; // モバイルはロック機能を動かさない

    const root = document.documentElement;
    const body = document.body;

    const prevOverflowRoot = root.style.overflow;
    const prevOverflowBody = body.style.overflow;

    let touchY = 0;
    let wheelAccum = 0;
    let lastActionAt = 0;

    const WHEEL_THRESHOLD = 280;
    const SWITCH_LOCK_MS = 1000;
    const GESTURE_COOLDOWN_MS = 400;

    const el = containerRef.current;
    if (!el) return;

    const clamp = (n: number) => Math.max(0, Math.min(last, n));
    const now = () => performance.now();

    const fireWipe = () => setWipe(true);

    const to = (n: number) => {
      const cur = idxRef.current;
      if (n === cur || lockedNavRef.current || completedRef.current) return;
      const t = now();
      if (t - lastActionAt < GESTURE_COOLDOWN_MS) return;
      lastActionAt = t;
      lockedNavRef.current = true;
      fireWipe();
      setIdx(n);
      wheelAccum = 0;
      setTimeout(() => {
        lockedNavRef.current = false;
      }, SWITCH_LOCK_MS);
    };

    const enableLock = () => {
      if (lockEnabledRef.current || completedRef.current) return;
      lockEnabledRef.current = true;
      lockedScrollYRef.current = window.scrollY;
      body.style.top = `-${lockedScrollYRef.current}px`;
      body.style.position = "fixed";
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      root.style.overflow = "hidden";
      body.style.overflow = "hidden";

      setShow(true);
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
    };

    const disableLock = () => {
      if (!lockEnabledRef.current) return;
      lockEnabledRef.current = false;
      root.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.top = "";
      window.scrollTo(0, lockedScrollYRef.current || 0);
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKey as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      wheelAccum = 0;
    };

    const escapeUp = () => {
      if (!lockEnabledRef.current) return;
      disableLock();
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      const targetY = Math.max(0, elTop - escapeUpPx);
      window.scrollTo(0, targetY);
    };

    const completeAndScroll = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      disableLock();
      const target = document.getElementById(nextAnchorId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onWheel = (e: WheelEvent) => {
      if (!lockEnabledRef.current) return;
      e.preventDefault();
      if (e.deltaY < 0 && idxRef.current === 0) {
        escapeUp();
        return;
      }
      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD || lockedNavRef.current) return;
      const cur = idxRef.current;
      if (wheelAccum > 0) {
        cur < last ? to(clamp(cur + 1)) : completeAndScroll();
      } else {
        if (cur > 0) to(clamp(cur - 1));
      }
      wheelAccum = 0;
    };

    const onKey = (e: KeyboardEvent) => {
      if (!lockEnabledRef.current) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown";
      const up = e.key === "ArrowUp" || e.key === "PageUp";
      if (!(down || up)) return;
      e.preventDefault();
      if (up && idxRef.current === 0) {
        escapeUp();
        return;
      }
      if (lockedNavRef.current) return;
      const cur = idxRef.current;
      if (down) {
        cur < last ? to(clamp(cur + 1)) : completeAndScroll();
      } else {
        if (cur > 0) to(clamp(cur - 1));
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!lockEnabledRef.current) return;
      const dy = e.touches[0].clientY - touchY;
      if (dy > 0 && idxRef.current === 0) {
        e.preventDefault();
        escapeUp();
        return;
      }
      if (Math.abs(dy) < 80) return;
      e.preventDefault();
      if (lockedNavRef.current) return;
      const cur = idxRef.current;
      if (dy < 0) {
        cur < last ? to(clamp(cur + 1)) : completeAndScroll();
      } else {
        if (cur > 0) to(clamp(cur - 1));
      }
      touchY = e.touches[0].clientY;
    };

    // 監視してロック発動
    const firstFigure = el.querySelector<HTMLElement>('[data-first="true"]');
    let ioFig: IntersectionObserver | null = null;
    if (firstFigure) {
      const thresholds = Array.from(
        new Set([0, 0.25, 0.5, exitRatio, enterRatio, 0.75, 1])
      ).sort();
      const check = (entry?: IntersectionObserverEntry) => {
        const rect = firstFigure.getBoundingClientRect();
        const ratio =
          entry?.intersectionRatio ??
          (Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0)) /
            Math.min(rect.height, innerHeight));
        const bottomNear =
          rect.bottom <= innerHeight - triggerOffsetPx;
        if ((ratio >= enterRatio || bottomNear) && !completedRef.current) {
          enableLock();
          return;
        }
        if (ratio <= exitRatio && lockEnabledRef.current && !completedRef.current) {
          disableLock();
        }
      };
      ioFig = new IntersectionObserver(([entry]) => check(entry), {
        threshold: thresholds,
        rootMargin: `0px 0px ${-rootMarginPx}px 0px`,
      });
      ioFig.observe(firstFigure);
      requestAnimationFrame(() => check());
    }

    return () => {
      ioFig?.disconnect();
      disableLock();
      root.style.overflow = prevOverflowRoot;
      body.style.overflow = prevOverflowBody;
    };
  }, [isMobile, last, nextAnchorId, enterRatio, exitRatio, rootMarginPx, triggerOffsetPx, escapeUpPx]);

  // モバイル時は全スライド縦並び
  if (isMobile) {
    return (
      <div className={styles.lockStage}>
        {slides.map((slide, i) => (
          <div
            key={i}
            data-index={i}
            className={`${styles.mobileSlide} ${
              visibleSlides[i] ? styles.in : ""
            }`}
          >
            <PlanSlide slide={slide} markFirst={false} show={true} wipe={false} />
          </div>
        ))}
      </div>
    );
  }

  // PC時はロック機構で1枚ずつ
 return (
    <div ref={containerRef} className={styles.lockStage}>
      <PlanSlide
        key={idx}
        slide={slides[idx]}
        markFirst={idx === 0}
        show={show}
        wipe={wipe}
        onWipeDone={() => setWipe(false)}
      />
    </div>
  );
}