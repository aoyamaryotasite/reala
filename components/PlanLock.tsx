"use client";

import { useEffect, useRef, useState } from "react";
import PlanSlide from "./PlanSlide";
import styles from "../styles/PlanLock.module.css";

type Slide = { img: string; title: string; sub?: string; body: string };

export default function PlanLock({
  slides,
  nextAnchorId = "after-plans",
}: { slides: Slide[]; nextAnchorId?: string }) {

  const containerRef = useRef<HTMLDivElement>(null);

  // 表示用の状態
  const [idx,  setIdx ] = useState(0);
  const [show, setShow] = useState(false);
  const [wipe, setWipe] = useState(false);

  // ロジック用の参照（ハンドラ内で最新値を読む）
  const idxRef         = useRef(0);
  const lockEnabledRef = useRef(false);
  const completedRef   = useRef(false);
  const lockedNavRef   = useRef(false);
  const inViewportRef  = useRef(false);

  const last = slides.length - 1;

  // idx の同期
  useEffect(() => { idxRef.current = idx; }, [idx]);

  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;

    let touchY = 0;
    let wheelAccum = 0;
    let lastActionAt = 0;

    const WHEEL_THRESHOLD      = 280;   // 慣性対策：必要スクロール量
    const SWITCH_LOCK_MS       = 1000;  // 切替後クールダウン
    const GESTURE_COOLDOWN_MS  = 400;   // 1ジェスチャー多段抑止

    const el = containerRef.current;
    if (!el) return;

    const clamp = (n: number) => Math.max(0, Math.min(last, n));
    const now   = () => performance.now();

    const fireWipe = () => setWipe(true); // 完了時に PlanSlide 側で false へ

    const to = (n: number) => {
      const cur = idxRef.current;
      if (n === cur || lockedNavRef.current || completedRef.current) return;

      const t = now();
      if (t - lastActionAt < GESTURE_COOLDOWN_MS) return; // 慣性の多段発火を遮断
      lastActionAt = t;

      lockedNavRef.current = true;
      fireWipe();
      setIdx(n);
      wheelAccum = 0;
      setTimeout(() => { lockedNavRef.current = false; }, SWITCH_LOCK_MS);
    };

    const enableLock = () => {
      if (lockEnabledRef.current || completedRef.current) return;
      lockEnabledRef.current = true;
      root.style.overflow = "hidden";
      setShow(true); // テキストだけ表示（画像は覆ったまま）
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey,  { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    };

    const disableLock = () => {
      if (!lockEnabledRef.current) return;
      lockEnabledRef.current = false;
      root.style.overflow = prevOverflow || "auto";
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKey as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      wheelAccum = 0;
    };

    const completeAndScroll = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      disableLock(); // この“入場”ではもうジャック再開しない
      const target = document.getElementById(nextAnchorId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    /* ===== 入力ハンドラ（慣性＆多段抑止） ===== */
    const onWheel = (e: WheelEvent) => {
      if (!lockEnabledRef.current) return;
      e.preventDefault();

      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD || lockedNavRef.current) return;

      const cur = idxRef.current;
      if (wheelAccum > 0) { cur < last ? to(clamp(cur + 1)) : completeAndScroll(); }
      else                { if (cur > 0) to(clamp(cur - 1)); }
      wheelAccum = 0;
    };

    const onKey = (e: KeyboardEvent) => {
      if (!lockEnabledRef.current) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown";
      const up   = e.key === "ArrowUp"   || e.key === "PageUp";
      if (!(down || up)) return;
      e.preventDefault();
      if (lockedNavRef.current) return;

      const cur = idxRef.current;
      if (down) { cur < last ? to(clamp(cur + 1)) : completeAndScroll(); }
      else      { if (cur > 0) to(clamp(cur - 1)); }
    };

    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!lockEnabledRef.current) return;
      const dy = e.touches[0].clientY - touchY;
      if (Math.abs(dy) < 80) return;
      e.preventDefault();
      if (lockedNavRef.current) return;

      const cur = idxRef.current;
      if (dy < 0) { cur < last ? to(clamp(cur + 1)) : completeAndScroll(); }
      else        { if (cur > 0) to(clamp(cur - 1)); }
      touchY = e.touches[0].clientY;
    };

    /* ===== 再武装：本当に“外から入った”時だけ初期化 ===== */
    const resetIO = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (inViewportRef.current) return;   // 小刻みな揺れは無視
          inViewportRef.current = true;

          // 新しい“入場”として初期化
          completedRef.current = false;
          lastActionAt = 0;
          setIdx(0);
          setShow(false);
          setWipe(false);
          requestAnimationFrame(() => setShow(true));
        } else {
          inViewportRef.current = false;
          disableLock(); // 外へ出たらジャック解除
        }
      },
      { threshold: 0.01 } // 1%でも完全に外れたときだけ false に
    );
    resetIO.observe(el);

    /* ===== ロック開始：1枚目画像“下端”が見えたら ===== */
    const firstFigure = el.querySelector<HTMLElement>('[data-first="true"]');
    let ioFig: IntersectionObserver | null = null;

    if (firstFigure) {
      ioFig = new IntersectionObserver(([entry]) => {
        const rect = firstFigure.getBoundingClientRect();
        const bottomReached = rect.bottom <= window.innerHeight;
        if (entry.intersectionRatio >= 0.98 || bottomReached) enableLock();
        else disableLock();
      }, { threshold: [0.98] });
      ioFig.observe(firstFigure);
    } else {
      // フォールバック：セクション可視でロック
      const io = new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? enableLock() : disableLock();
      }, { threshold: 0.6 });
      io.observe(el);
    }

    return () => {
      resetIO.disconnect();
      ioFig?.disconnect();
      disableLock();
      root.style.overflow = prevOverflow;
    };
    // ← ここ重要：idx に依存させない！
  }, [last, nextAnchorId]);

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
