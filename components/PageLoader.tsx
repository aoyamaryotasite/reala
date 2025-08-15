"use client";
import { useEffect, useState } from "react";
import SproutLoader from "./SproutLoader";

export default function PageLoader({
  children,
  minDurationMs = 1600,
  slideMs = 600,
}: {
  children: React.ReactNode;
  minDurationMs?: number;
  slideMs?: number;
}) {
  const [visible, setVisible] = useState(true);
  const [slide, setSlide] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSlide(true), minDurationMs);
    const t2 = setTimeout(() => setVisible(false), minDurationMs + slideMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [minDurationMs, slideMs]);

  const baseStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0eae2",
    zIndex: 9999,
    // ★ transform は書かない！（class で制御）
    willChange: "transform",
  };

  return (
    <>
      {visible && (
        <div
          className={slide ? "page-loader-overlay slide-up" : "page-loader-overlay"}
          style={baseStyle}
        >
          <SproutLoader
            size={120}
            duration={1.6}
            primary="#111"
            secondary="#2eaf3b"
            showWord
            wordDelayMs={600}
          />
        </div>
      )}

      {children}

      <style jsx>{`
        .page-loader-overlay {
          transform: translateY(0%); /* 初期位置 */
          transition: transform ${slideMs}ms cubic-bezier(.22,.61,.36,1);
        }
        .page-loader-overlay.slide-up {
          transform: translateY(-100%); /* 上に幕が上がる */
        }

        /* お好み：低速端末でカクつくなら opacity も併用
        .page-loader-overlay { opacity: 1; }
        .page-loader-overlay.slide-up { opacity: 0; }
        */
        
        /* 配慮：動きを減らす設定のユーザー */
        @media (prefers-reduced-motion: reduce) {
          .page-loader-overlay,
          .page-loader-overlay.slide-up {
            transition: none;
            transform: translateY(-100%);
          }
        }
      `}</style>
    </>
  );
}
