'use client';

import { useState } from 'react';
import styles from '../styles/contact.module.css';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  content: string;
};

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!form.firstName.trim()) return 'First Name is required.';
    if (!form.lastName.trim()) return 'Last Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email required.';
    if (!form.country.trim()) return 'Country is required.';
    if (!form.content.trim()) return 'Content is required.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('[Contact] submit clicked');  // ★ 追加
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
      setForm({ firstName: '', lastName: '', email: '', country: '', content: '' });
    } catch (e) {
      setNotice('Sorry, something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.wrap} aria-labelledby="contact-heading">
      <h2 id="contact-heading" className={styles.title}>CONTACT</h2>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.row}>
          <label htmlFor="firstName" className={styles.label}>First Name</label>
          <input
            id="firstName"
            className={styles.input}
            value={form.firstName}
            onChange={onChange('firstName')}
            autoComplete="given-name"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="lastName" className={styles.label}>Last Name</label>
          <input
            id="lastName"
            className={styles.input}
            value={form.lastName}
            onChange={onChange('lastName')}
            autoComplete="family-name"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="email" className={styles.label}>EMail Address</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={form.email}
            onChange={onChange('email')}
            autoComplete="email"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="country" className={styles.label}>Country</label>
          <input
            id="country"
            className={styles.input}
            value={form.country}
            onChange={onChange('country')}
            autoComplete="country-name"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="content" className={styles.label}>Content</label>
          <textarea
            id="content"
            className={`${styles.input} ${styles.textarea}`}
            value={form.content}
            onChange={onChange('content')}
            rows={6}
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
  );
}
