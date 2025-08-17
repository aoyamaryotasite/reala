"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingTrialCTA({
  href = "/signup",
  label = "Start Free Trial",
  zIndex = 60,
  showOnMobile = true,
}: {
  href?: string;
  label?: string;
  zIndex?: number;
  showOnMobile?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div className={`cta-root ${mounted ? "in" : ""}`} style={{ zIndex }}>
        <Link href={href} aria-label={label} className="cta-link">
          {/* 吹き出し（横書き）← アイコンの左 */}
          <span className={`cta-bubble ${showOnMobile ? "show" : ""}`} aria-hidden>
            <span className="cta-bubble-text">{label}</span>
          </span>
          {/* 丸アイコン */}
          <span className="cta-fab" role="img">
            <SproutPenIcon />
          </span>
        </Link>
      </div>

      <style jsx>{`
        .cta-root {
          position: fixed;
          right: 18px;
          bottom: 18px;
          transform: translateY(8px);
          opacity: 0;
          pointer-events: none;
        }
        .cta-root.in {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
          transition: transform 420ms cubic-bezier(.22,.61,.36,1), opacity 420ms;
        }

       :global(.cta-link) {
    display: flex;
    align-items: center;
    gap: 20px;
    text-decoration: none;
  }
        /* 吹き出し（横書き） */
        .cta-bubble {
          display: none;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 14px;
          background: #fff;
          font-size: 2rem;
          box-shadow:0 10px 20px rgba(0,0,0,.12),0 3px 6px rgba(0,0,0,.08);
          position: relative;
          white-space: nowrap;
          font-weight: 600;
          color: #222;
        }
        /* 三角（アイコン側） */
        .cta-bubble:after {
          content: "";
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 14px;
          height: 14px;
          background: #fff;
          border-bottom-right-radius: 4px;
          box-shadow: 3px 3px 8px rgba(0,0,0,.06);
        }

        /* アイコン（中の sprout）ホバー */
        :global(.cta-link:hover) :global(.sprout .stem) {
          transform: scaleY(1.35) translateY(-2px);
        }
       :global(.cta-link:hover) :global(.sprout .leaf.left)  {
          transform: translateY(-3px) rotate(-2deg);
        }
      :global(.cta-link:hover) :global(.sprout .leaf.right)  {
          transform: translateY(-3px) rotate(2deg);
        }

        /* モバイル表示可否 */
        .cta-bubble.show { display: inline-flex; }
        @media (min-width: 768px) {
          .cta-bubble { display: inline-flex; }
        }

        .cta-fab {
          display: inline-grid;
          place-items: center;
          width: 64px;
          height: 64px;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .cta-link:hover .cta-fab {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        .cta-link:hover .cta-bubble-text { text-decoration: underline; }

        @media (prefers-reduced-motion: reduce) {
          .cta-root.in, .cta-fab { transition: none; }
        }
      `}</style>
    </>
  );
}

/* ペン先↓＋芽（常時パタパタ、hoverで伸びる）— 万年筆ニブ形状 */
function SproutPenIcon({
  size = 40,
  primary = "#111",
  secondary = "#2eaf3b",
}: {
  size?: number;
  primary?: string;
  secondary?: string;
}) {
  return (
    <>
      <svg
        width={size}
        height={(size * 56) / 48}
        viewBox="0 0 48 56"
        xmlns="http://www.w3.org/2000/svg"
        className="sprout-icon"
        aria-hidden
      >
        {/* ==== 芽（上側） ==== */}
        <g className="sprout" transform="translate(24,18)">
          {/* 茎 */}
          <rect className="stem" x="-1.5" y="-10" width="3" height="20" rx="1.5" fill={secondary} />
          {/* 節 */}
          <rect x="-3.4" y="3.2" width="6.8" height="2.2" rx="1.1" fill={secondary} opacity=".9" />
          {/* 葉（常時パタパタ） */}
          <g className="leaf left">
            <path className="leaf-shape" d="M-2 0 C-10 -6, -16 -8, -22 -6 C-16 -2, -8 2, -2 0 Z" fill={secondary} />
          </g>
          <g className="leaf right">
            <path className="leaf-shape" d="M2 0 C10 -6, 16 -8, 22 -6 C16 -2, 8 2, 2 0 Z" fill={secondary} />
          </g>
        </g>

        {/* ==== 首金（カラー）==== */}
        <rect x="18" y="27" width="12" height="4" rx="2" fill={primary} />

        {/* ==== ニブ（下向きの“くびれ”カイト型）==== */}
        {/* 肩→くびれ→先端 と滑らかなカーブで参照画像に寄せる */}
        <path
          d="
            M24 56
            L33.2 40
            Q24 36.2 24 28
            Q24 36.2 14.8 40
            Z
          "
          fill={primary}
        />

        {/* 呼吸穴＋スリット（白） */}
        <circle cx="24" cy="46.2" r="2" fill="#fff" />
        <rect x="23.2" y="46.2" width="1.6" height="9.5" rx="0.8" fill="#fff" />
      </svg>

      <style jsx>{`
        .sprout-icon { display: block; }

        /* 芽アニメ（常時パタパタ） */
        .sprout .stem { transform-origin: 0px 6px; transition: transform 260ms cubic-bezier(.22,.61,.36,1); }
        .sprout .leaf { transform-origin: 0px 0px; transition: transform 260ms cubic-bezier(.22,.61,.36,1); }

        .sprout .leaf-shape {
          transform-origin: 0px 0px;
          animation: flap 2.2s ease-in-out infinite alternate;
        }
        .sprout .left .leaf-shape  { animation-delay: 0s; }
        .sprout .right .leaf-shape { animation-delay: 1.1s; }

        @keyframes flap {
          0%   { transform: rotate(-5deg) translateY(0); }
          50%  { transform: rotate(0deg)  translateY(-0.5px); }
          100% { transform: rotate(5deg)  translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sprout .stem, .sprout .leaf { transition: none; }
          .sprout .leaf-shape { animation: none; }
        }
      `}</style>
    </>
  );
}
