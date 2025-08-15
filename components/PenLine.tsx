// components/PenSwoosh.tsx
"use client";
import { useEffect, useRef } from "react";

type Props = {
  color?: string;         // 線の色
  strokeWidth?: number;   // 太さ
  duration?: number;      // 描画時間(秒)
  animateOnMount?: boolean; // true: マウント時に描画アニメ
};

export default function PenSwoosh({
  color = "#f9a8d4",          // 淡いピンク
  strokeWidth = 12,
  duration = 1.6,
  animateOnMount = true,
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!animateOnMount) return;
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    // 次フレでトランジション開始
    requestAnimationFrame(() => {
      p.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(.22,1,.36,1)`;
      p.style.strokeDashoffset = "0";
    });
  }, [duration, animateOnMount]);

  return (
    <svg viewBox="0 0 920 100" width="100%" height="100" aria-hidden="true">
      {/* 手書きっぽい“S字〜小さな切り返し”の波線 */}
      <path
        ref={pathRef}
        d="
          M 10 70
          C 190 40, 300 40, 480 70
          C 400 95, 340 95, 560 70
          C 730 45, 830 45, 910 60
        "
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
