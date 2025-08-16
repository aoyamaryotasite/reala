'use client';
import { useState } from 'react';
import styles from '../../styles/contact.module.css';

import Footer from "../../components/Footer";
import HeroHeader from "../../components/HeroHeader";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enGB from "date-fns/locale/en-GB";

type FormState = {
  fullName: string;
  email: string;
  country: string;
  japaneseLevel: string;
  learningPurpose: string;
  preferredDateTime1: string;
  preferredDateTime2: string;
  preferredDateTime3: string;
  learningHistory: string;
  otherMessage: string;
};

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    country: '',
    japaneseLevel: '',
    learningPurpose: '',
    preferredDateTime1: '',
    preferredDateTime2: '',
    preferredDateTime3: '',
    learningHistory: '',
    otherMessage: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onChange =
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!form.fullName.trim()) return 'Full Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email required.';
    if (!form.country.trim()) return 'Country of Residence / Time Zone is required.';
    if (!form.japaneseLevel) return 'Japanese Level is required.';
    if (!form.learningPurpose) return 'Learning Purpose is required.';
    if (!form.preferredDateTime1) return 'Preferred Date & Time (1st choice) is required.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    const err = validate();
    if (err) return setNotice(err);

    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setNotice('Thanks! We received your message.');
      setForm({
        fullName: '',
        email: '',
        country: '',
        japaneseLevel: '',
        learningPurpose: '',
        preferredDateTime1: '',
        preferredDateTime2: '',
        preferredDateTime3: '',
        learningHistory: '',
        otherMessage: '',
      });
    } catch {
      setNotice('Sorry, something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // 時間選択肢（10:00〜18:00）
  const timeOptions = Array.from({ length: 9 }, (_, i) => {
    const hour = 10 + i;
    return `${hour}:00`;
  });

  return (
    <>
    <HeroHeader/>
    <section className={styles.wrap} aria-labelledby="contact-heading">
      <h2 id="contact-heading" className={styles.title}>Trial Lesson Application Form</h2>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {/* 1. Full Name */}
        <div className={styles.row}>
          <label htmlFor="fullName" className={styles.label}>Full Name</label>
          <input
            id="fullName"
            className={styles.input}
            value={form.fullName}
            onChange={onChange('fullName')}
            autoComplete="name"
          />
        </div>

        {/* 2. Email Address */}
        <div className={styles.row}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={form.email}
            onChange={onChange('email')}
            autoComplete="email"
          />
        </div>

        {/* 3. Country of Residence / Time Zone */}
        <div className={styles.row}>
          <label htmlFor="country" className={styles.label}>Country of Residence / Time Zone</label>
          <input
            id="country"
            className={styles.input}
            value={form.country}
            onChange={onChange('country')}
            autoComplete="country-name"
          />
        </div>

        {/* 4. Japanese Level */}
        <div className={styles.row}>
          <label htmlFor="japaneseLevel" className={styles.label}>Japanese Level</label>
          <select
            id="japaneseLevel"
            className={styles.input}
            value={form.japaneseLevel}
            onChange={onChange('japaneseLevel')}
          >
            <option value="">-- Select Level --</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* 5. Learning Purpose */}
        <div className={styles.row}>
          <label htmlFor="learningPurpose" className={styles.label}>Learning Purpose</label>
          <select
            id="learningPurpose"
            className={styles.input}
            value={form.learningPurpose}
            onChange={onChange('learningPurpose')}
          >
            <option value="">-- Select Purpose --</option>
            <option value="JLPT">JLPT</option>
            <option value="Travel">Travel</option>
            <option value="Work">Work</option>
            <option value="Hobby">Hobby</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* 6. Preferred Date & Time (3 choices) */}
        {[1, 2, 3].map((n) => (
          <div className={styles.row} key={n}>
            <label htmlFor={`preferredDateTime${n}`} className={styles.label}>
              Preferred Date & Time ({n}{n === 1 ? 'st' : n === 2 ? 'nd' : 'rd'} choice)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <DatePicker
                id={`preferredDate${n}`}
                selected={
                  form[`preferredDateTime${n}`]
                    ? new Date(form[`preferredDateTime${n}`].split(" ")[0])
                    : null
                }
                onChange={(date: Date | null) =>
                  setForm((p) => ({
                    ...p,
                    [`preferredDateTime${n}`]:
                      (date ? date.toISOString().split("T")[0] : "") +
                      " " +
                      (p[`preferredDateTime${n}`].split(" ")[1] || ""),
                  }))
                }
                locale={enGB}         
                dateFormat="yyyy-MM-dd" // ← 表示フォーマットも制御
                className={styles.input}
                placeholderText="Select date"
              />

              <select
                className={styles.input}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    [`preferredDateTime${n}`]:
                      (p[`preferredDateTime${n}`].split(" ")[0] || "") +
                      " " +
                      e.target.value,
                  }))
                }
              >
                <option value="">-- Time --</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* 7. Japanese Learning History (Optional) */}
        <div className={styles.row}>
          <label htmlFor="learningHistory" className={styles.label}>Japanese Learning History (Optional)</label>
          <textarea
            id="learningHistory"
            className={`${styles.input} ${styles.textarea}`}
            value={form.learningHistory}
            onChange={onChange('learningHistory')}
            rows={3}
          />
        </div>

        {/* 8. Other Messages / Questions (Optional) */}
        <div className={styles.row}>
          <label htmlFor="otherMessage" className={styles.label}>Other Messages / Questions (Optional)</label>
          <textarea
            id="otherMessage"
            className={`${styles.input} ${styles.textarea}`}
            value={form.otherMessage}
            onChange={onChange('otherMessage')}
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Submit'}
          </button>
        </div>

        {notice && <p className={styles.notice}>{notice}</p>}
      </form>
    </section>
      <Footer/>
    </>
  );
}
