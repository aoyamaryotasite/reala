"use client";

import Image from "next/image";
import styles from "../styles/Tutor.module.css";

export default function Tutor() {
    return (
        <section className={styles.section} aria-labelledby="tutorHeading">
            <div className={styles.inner}>
                {/* 背景画像 */}
                <div className={styles.imageWrap}>
                    <Image
                        src="/tutor.png"
                        alt="Personal Japanese Tutor"
                        width={500}   // 必須
                        height={700}
                        className={styles.image}
                        priority
                    />
                </div>

                {/* かぶせるテキスト */}
                <div className={styles.textBox}>
                    <h2 id="tutorHeading" className={styles.title}>
                        We are “Personal Japanese Tutor”
                    </h2>
                    <p>
                        “Which materials should I use?” “How can I master grammar?”
                    </p>
                    <p>
                        We answer these questions with precise advice backed by expertise in language
                        education.
                    </p>
                    <p>
                        Even when you’re unsure how to study, we’ll be your partner, guiding you toward growth.
                    </p>
                </div>
            </div>
        </section>
    );
}
