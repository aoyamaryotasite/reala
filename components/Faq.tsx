"use client";

import React, { useState } from "react";
import styles from "../styles/Faq.module.css";

type QA = { q: string; a: React.ReactNode; id?: string };
type Section = { title: string; items: QA[] };

const data: Section[] = [
  {
    title: "About Lessons",
    items: [
      {
        q: "What kind of lessons do you offer?",
        a: <>Lessons are customized based on each student's goals and level. Options include free conversation, structured grammar lessons, JLPT preparation, and short-term intensive lessons.</>,
      },
      {
        q: "I’m a complete beginner in Japanese. Is that okay?",
        a: <>Absolutely. We provide friendly, step-by-step support starting from greetings and basic grammar, so beginners can feel comfortable and confident.</>,
      },
      {
        q: "Can lessons be conducted in English?",
        a: <>Yes. we can explain grammar, answer questions, and offer learning advice in English as needed. English support is available throughout the learning process.</>,
      },
      {
        q: "What teaching materials do you use?",
        a: <>Mainly popular textbooks like "Minna no Nihongo" and "Genki", depending on your level and learning style.</>,
      },
      {
        q: "How long are the lessons?",
        a: <>You can choose either 25-minute or 50-minute lessons. We recommend starting with a 25-minute trial.</>,
      },
      {
        q: "Can I ask questions outside of lesson time?",
        a: <>As a general rule, we do not offer one-on-one support outside lesson hours. However, questions asked during lessons will be followed up carefully in future sessions.</>,
      },
      {
        q: "Can I take lessons with a friend or family member?",
        a: <>Currently, lessons are offered one-on-one, but feel free to inquire if you’d like to study with someone else.</>,
      },
      {
        q: "I’d like to take intensive lessons in a short period. Is that possible?",
        a: <>Yes. we offer flexible short-term plans tailored to specific goals like travel or exams. Feel free to contact us to discuss your needs.</>,
      },
      {
        q: "What happens in a trial lesson?",
        a: <>During the trial, we’ll talk about your goals and level, and then try a short lesson. we’ll also explain how future lessons would be structured if you decide to continue.</>,
      },
    ],
  },
  {
    title: "Booking & Payment",
    items: [
      {
        q: "How do I schedule a lesson?",
        a: <>You can schedule by contacting us through LINE or email. Please let us know your preferred date and time.</>,
      },
      {
        q: "What payment methods do you accept?",
        a: (
          <ul className={styles.list}>
            <li>PayPal (recommended for overseas learners)</li>
            <li>Bank transfer to Rakuten Bank (for residents in Japan)</li>
            <li>PayPay (for those in Japan who prefer it)</li>
          </ul>
        ),
      },
      {
        q: "Can I cancel a lesson?",
        a: <>Yes, cancellations are free up to 24 hours before the lesson. After that, the full lesson fee will be charged.</>,
      },
      {
        q: "How does payment work for fixed plans like weekly lessons?",
        a: <>For weekly plans, we offer a monthly subscription system.</>,
      },
    ],
  },
  {
    title: "Technical Requirements",
    items: [
      {
        q: "What do I need to prepare for the lesson?",
        a: <>Please have a stable internet connection, a computer or tablet, a webcam, and a microphone. we use Zoom or Google Meet for lessons.</>,
      },
      {
        q: "I don’t know how to use Zoom. Is that okay?",
        a: <>No problem. Zoom is free and easy to use. We’ll send you a quick guide after booking.</>,
      },
    ],
  },
];

export default function Faq() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section className={styles.wrap} aria-labelledby="faq-title">
      <h2 id="faq-title" className={styles.title}>FAQ</h2>

      {data.map((sec, sIdx) => (
        <div className={styles.section} key={sec.title}>
          <h3 className={styles.sectionTitle}>{sec.title}</h3>

          <div className={styles.items} role="list">
            {sec.items.map((qa, qIdx) => {
              const key = `${sIdx}:${qIdx}`;
              const isOpen = openKey === key;
              return (
                <div className={styles.item} key={key} role="listitem">
                  <button
                    className={styles.question}
                    aria-expanded={isOpen}
                    onClick={() => setOpenKey(isOpen ? null : key)}
                  >
                    <span className={styles.qLabel}>Q{qIdx + 1}.</span>
                    <span className={styles.qText}>{qa.q}</span>
                    <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} aria-hidden />
                  </button>

                  <div
                    className={`${styles.answerWrap} ${isOpen ? styles.open : ""}`}
                    role="region"
                  >
                    <div className={styles.answerInner}>
                      <span className={styles.aLabel}>A{qIdx + 1}.</span>
                      <div className={styles.aText}>{qa.a}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
