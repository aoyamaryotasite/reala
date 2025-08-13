"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Hero.module.css";

const rand = (min: number, max: number) => Number((Math.random() * (max - min) + min).toFixed(2));


export default function Hero() {
    return (
        <section className={styles.wrap} aria-label="Hero">
            {/* 装飾ライン */}
            <div className={styles.lines} aria-hidden>
                <span className={styles.lineLeft} />
                <span className={styles.lineRight} />
            </div>

            {/* カラーブロブ */}
            <div className={styles.blobs} aria-hidden>
                <span className={`${styles.blob} ${styles.blobLime}`} />
                <span className={`${styles.blob} ${styles.blobYellow}`} />
                <span className={`${styles.blob} ${styles.blobGreen}`} />
            </div>

            {/* ヘッダー行 */}
            <div className={styles.topbar}>
                <p className={styles.brand}>
                    <strong>REALA</strong>
                    <span className={styles.brandSub}> Japanese Academy</span>
                </p>
                <Link href="#apply" className={styles.applyBtn}>apply</Link>
            </div>

            {/* 見出し */}
            <div className={styles.headings}>
                <h1 className={styles.title}>Your Personalized Japanese Lessons</h1>
                <p className={styles.lead}>
                    From Daily Conversation to Business and JLPT Preparation — Tailored Support for Your Goals
                </p>
            </div>

            {/* 画像コラージュ */}
            <div className={styles.stage}>
                {/* 左下 小カード */}
                <div className={`${styles.card} ${styles.cardLeft}`}>
                    <Image
                        src="/hero/left.jpg"
                        alt="Student learning online"
                        width={320}
                        height={320}
                        className={`${styles.img} ${styles.imgLeft} ${styles.photoAnim}`}
                        priority
                        style={{
                            // 0.2〜0.9sのランダム遅延、0.7〜1.2sのランダム時間
                            // @ts-ignore: CSS Variable
                            '--delay': `${rand(0.2, 0.9)}s`,
                            // @ts-ignore
                            '--dur': `${rand(0.7, 1.2)}s`,
                        } as React.CSSProperties}
                    />
                </div>

                {/* 中央 ワイドカード */}
                <div className={`${styles.card} ${styles.cardCenter}`}>
                    <Image
                        src="/hero/center.jpg"
                        alt="Online lesson in progress"
                        width={640}
                        height={380}
                        className={`${styles.img} ${styles.imgWide} ${styles.photoAnim}`}
                        style={{
                            // @ts-ignore
                            '--delay': `${rand(0.3, 1.1)}s`,
                            // @ts-ignore
                            '--dur': `${rand(0.7, 1.3)}s`,
                        } as React.CSSProperties}
                    />
                </div>

                {/* 右上 小カード */}
                <div className={`${styles.card} ${styles.cardRight}`}>
                    <Image
                        src="/hero/right.jpg"
                        alt="Teacher speaking"
                        width={520}
                        height={520}
                        className={`${styles.img} ${styles.imgRight} ${styles.photoAnim}`}
                        style={{
                            // @ts-ignore
                            '--delay': `${rand(0.4, 1.2)}s`,
                            // @ts-ignore
                            '--dur': `${rand(0.7, 1.3)}s`,
                        } as React.CSSProperties}
                    />
                </div>

                {/* 右下 中カード */}
                <div className={`${styles.card} ${styles.cardBR}`}>
                    <Image
                        src="/hero/bottom-right.jpg"
                        alt="Smiling learner on a call"
                        width={420}
                        height={320}
                        className={`${styles.img} ${styles.imgBRight} ${styles.photoAnim}`}
                        style={{
                            // @ts-ignore
                            '--delay': `${rand(0.5, 1.3)}s`,
                            // @ts-ignore
                            '--dur': `${rand(0.7, 1.3)}s`,
                        } as React.CSSProperties}
                    />
                </div>
            </div >
            <div className={`${styles.circle} ${styles.circle1} ${styles.circleAnim}`}
                style={{ ['--delay' as any]: `${rand(0, 0.8)}s`, ['--dur' as any]: `${rand(0.6, 1.1)}s` }} />
            <div className={`${styles.circle} ${styles.circle2} ${styles.circleAnim}`}
                style={{ ['--delay' as any]: `${rand(0.1, 0.9)}s`, ['--dur' as any]: `${rand(0.6, 1.1)}s` }} />
            <div className={`${styles.circle} ${styles.circle3} ${styles.circleAnim}`}
                style={{ ['--delay' as any]: `${rand(0.2, 1.0)}s`, ['--dur' as any]: `${rand(0.6, 1.1)}s` }} />
            <div className={`${styles.circle} ${styles.circle4} ${styles.circleAnim}`}
                style={{ ['--delay' as any]: `${rand(0.3, 1.1)}s`, ['--dur' as any]: `${rand(0.6, 1.1)}s` }} />
            <div className={`${styles.circle} ${styles.circle5} ${styles.circleAnim}`}
                style={{ ['--delay' as any]: `${rand(0.4, 1.2)}s`, ['--dur' as any]: `${rand(0.6, 1.1)}s` }} />

        </section >
    );
}
