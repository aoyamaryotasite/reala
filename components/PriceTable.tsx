"use client";

import React, { useEffect } from "react";
import ScrollHint from "scroll-hint";
import "scroll-hint/css/scroll-hint.css"; // CSSを必ず読み込む
import styles from "../styles/PriceTable.module.css";

type Plan = {
  name: string;
  priceJPY: string;
  priceUSD: string;
  isAlt?: boolean;
};

const plansNoFee: Plan[] = [
  { name: "Trial Lesson", priceJPY: "¥2,000", priceUSD: "$14" },
  { name: "Spot Lesson", priceJPY: "¥4,700", priceUSD: "$32", isAlt: true },
  { name: "Intensive Study Pack (5)", priceJPY: "¥22,000", priceUSD: "$150" },
  { name: "Intensive Study Pack (10)", priceJPY: "¥43,000", priceUSD: "$292", isAlt: true },
  { name: "Weekly Plan", priceJPY: "¥16,800", priceUSD: "$114" },
  { name: "Standard Plan", priceJPY: "¥32,000", priceUSD: "$217", isAlt: true },
];

const plansWithFee: Plan[] = [
  { name: "Trial Lesson", priceJPY: "¥2,134", priceUSD: "$15" },
  { name: "Spot Lesson", priceJPY: "¥4,907", priceUSD: "$34", isAlt: true },
  { name: "Intensive Study Pack (5)", priceJPY: "¥23,016", priceUSD: "$157" },
  { name: "Intensive Study Pack (10)", priceJPY: "¥44,936", priceUSD: "$305", isAlt: true },
  { name: "Weekly Plan", priceJPY: "¥17,537", priceUSD: "$119" },
  { name: "Standard Plan", priceJPY: "¥33,409", priceUSD: "$227", isAlt: true },
];

function PriceTableBlock({ title, plans }: { title: string; plans: Plan[] }) {
  return (
    <div className={styles.tableCard}>
      <h3 className={styles.subtitle}>{title}</h3>

      {/* scroll-hint ターゲット */}
      <div className="tableScroll scroll-hint">
        <div className={styles.headerRow} role="row">
          <div className={`${styles.headerCell} ${styles.leftRadius}`} role="columnheader">Plan Name</div>
          <div className={styles.headerCell} role="columnheader">Price (JPY)</div>
          <div className={`${styles.headerCell} ${styles.rightRadius}`} role="columnheader">Price (USD)</div>
        </div>
        <div className={styles.body} role="rowgroup">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`${styles.row} ${p.isAlt ? styles.rowAlt : ""}`}
              role="row"
            >
              <div className={`${styles.cell} ${styles.cellLabel}`} role="cell">{p.name}</div>
              <div className={styles.cell} role="cell">{p.priceJPY}</div>
              <div className={styles.cell} role="cell">{p.priceUSD}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PriceTable() {
  useEffect(() => {
    if (window.innerWidth <= 768) {
      // 描画後に実行
      setTimeout(() => {
        new ScrollHint(".tableScroll", {
          suggestiveShadow: true,
          remainingTime: 3000,
          i18n: {
            scrollable: "Scroll →"
          }
        });
      }, 0);
    }
  }, []);

  return (
    <section className={styles.wrap} aria-labelledby="price-heading">
      <h2 id="price-heading" className={styles.title}>PRICE</h2>
      <PriceTableBlock title="Price List" plans={plansNoFee} />
      <PriceTableBlock title="Price List (PayPal fees included)" plans={plansWithFee} />
    </section>
  );
}
