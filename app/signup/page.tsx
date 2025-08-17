'use client';
import { useState } from 'react';
import styles from '../../styles/contact.module.css';
import Footer from '../../components/Footer';
import HeroHeader from '../../components/HeroHeader';

type FormState = {
  fullName: string;
  email: string;
  country: string;
  timeZone: string;
  preferredDateTime1: string;
  preferredDateTime2: string;
  preferredDateTime3: string;
  message: string;
};

type Option = { value: string; label: string };

// Major countries (English)
const countryOptions: Option[] = [
  { value: 'Japan', label: 'Japan' },
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Australia', label: 'Australia' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'India', label: 'India' },
  { value: 'China', label: 'China' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Peru', label: 'Peru' },
];

// Time zones (English)
const timeZoneOptions: Option[] = [
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (Japan Standard Time, UTC+9)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (South Africa Standard Time, UTC+2)' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos (West Africa Time, UTC+1)' },
  { value: 'Africa/Windhoek', label: 'Africa/Windhoek (West Africa Time, UTC+1)' },
  { value: 'America/Adak', label: 'America/Adak (Hawaii-Aleutian Standard Time, UTC-10)' },
  { value: 'America/Anchorage', label: 'America/Anchorage (Alaska Standard Time, UTC-9)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'America/Argentina/Buenos_Aires (Argentina Time, UTC-3)' },
  { value: 'America/Bogota', label: 'America/Bogota (Colombia Time, UTC-5)' },
  { value: 'America/Caracas', label: 'America/Caracas (Venezuela Time, UTC-4:30)' },
  { value: 'America/Chicago', label: 'America/Chicago (Central Standard Time, UTC-6)' },
  { value: 'America/Denver', label: 'America/Denver (Mountain Standard Time, UTC-7)' },
  { value: 'America/Godthab', label: 'America/Godthab (West Greenland Time, UTC-3)' },
  { value: 'America/Guatemala', label: 'America/Guatemala (Central Standard Time, UTC-6)' },
  { value: 'America/Halifax', label: 'America/Halifax (Atlantic Standard Time, UTC-4)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (Pacific Standard Time, UTC-8)' },
  { value: 'America/Montevideo', label: 'America/Montevideo (Uruguay Time, UTC-3)' },
  { value: 'America/New_York', label: 'America/New_York (Eastern Standard Time, UTC-5)' },
  { value: 'America/Noronha', label: 'America/Noronha (Fernando de Noronha Time, UTC-2)' },
  { value: 'America/Phoenix', label: 'America/Phoenix (Mountain Standard Time, UTC-7)' },
  { value: 'America/Santiago', label: 'America/Santiago (Chile Time, UTC-4)' },
  { value: 'America/Santo_Domingo', label: 'America/Santo_Domingo (Atlantic Standard Time, UTC-4)' },
  { value: 'America/St_Johns', label: 'America/St_Johns (Newfoundland Standard Time, UTC-3:30)' },
  { value: 'Asia/Baghdad', label: 'Asia/Baghdad (Arabia Standard Time, UTC+3)' },
  { value: 'Asia/Baku', label: 'Asia/Baku (Azerbaijan Time, UTC+4)' },
  { value: 'Asia/Beirut', label: 'Asia/Beirut (Eastern European Time, UTC+2)' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (Bangladesh Time, UTC+6)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (Gulf Standard Time, UTC+4)' },
  { value: 'Asia/Irkutsk', label: 'Asia/Irkutsk (Irkutsk Time, UTC+9)' },
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta (Western Indonesia Time, UTC+7)' },
  { value: 'Asia/Kabul', label: 'Asia/Kabul (Afghanistan Time, UTC+4:30)' },
  { value: 'Asia/Kamchatka', label: 'Asia/Kamchatka (Kamchatka Time, UTC+12)' },
  { value: 'Asia/Karachi', label: 'Asia/Karachi (Pakistan Time, UTC+5)' },
  { value: 'Asia/Kathmandu', label: 'Asia/Kathmandu (Nepal Time, UTC+5:45)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India Standard Time, UTC+5:30)' },
  { value: 'Asia/Krasnoyarsk', label: 'Asia/Krasnoyarsk (Krasnoyarsk Time, UTC+8)' },
  { value: 'Asia/Omsk', label: 'Asia/Omsk (Omsk Time, UTC+7)' },
  { value: 'Asia/Rangoon', label: 'Asia/Rangoon (Myanmar Time, UTC+6:30)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (China Standard Time, UTC+8)' },
  { value: 'Asia/Tehran', label: 'Asia/Tehran (Iran Standard Time, UTC+3:30)' },
  { value: 'Asia/Vladivostok', label: 'Asia/Vladivostok (Vladivostok Time, UTC+11)' },
  { value: 'Asia/Yakutsk', label: 'Asia/Yakutsk (Yakutsk Time, UTC+10)' },
  { value: 'Asia/Yekaterinburg', label: 'Asia/Yekaterinburg (Yekaterinburg Time, UTC+6)' },
  { value: 'Atlantic/Azores', label: 'Atlantic/Azores (Azores Time, UTC-1)' },
  { value: 'Atlantic/Cape_Verde', label: 'Atlantic/Cape_Verde (Cape Verde Time, UTC-1)' },
  { value: 'Australia/Adelaide', label: 'Australia/Adelaide (Australian Central Standard Time, UTC+9:30)' },
  { value: 'Australia/Brisbane', label: 'Australia/Brisbane (Australian Eastern Standard Time, UTC+10)' },
  { value: 'Australia/Darwin', label: 'Australia/Darwin (Australian Central Standard Time, UTC+9:30)' },
  { value: 'Australia/Eucla', label: 'Australia/Eucla (Australian Central Western Standard Time, UTC+8:45)' },
  { value: 'Australia/Lord_Howe', label: 'Australia/Lord_Howe (Lord Howe Standard Time, UTC+10:30)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (Australian Eastern Standard Time, UTC+10)' },
  { value: 'Etc/GMT+12', label: 'Etc/GMT+12 (GMT-12:00)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (Central European Time, UTC+1)' },
  { value: 'Europe/London', label: 'Europe/London (Greenwich Mean Time, UTC±0)' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (Moscow Standard Time, UTC+4)' },
  { value: 'Pacific/Apia', label: 'Pacific/Apia (Samoa Time, UTC+13)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (New Zealand Standard Time, UTC+12)' },
  { value: 'Pacific/Chatham', label: 'Pacific/Chatham (Chatham Standard Time, UTC+12:45)' },
  { value: 'Pacific/Easter', label: 'Pacific/Easter (Easter Island Time, UTC-6)' },
  { value: 'Pacific/Gambier', label: 'Pacific/Gambier (Gambier Time, UTC-9)' },
  { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (Hawaii Standard Time, UTC-10)' },
  { value: 'Pacific/Kiritimati', label: 'Pacific/Kiritimati (Line Islands Time, UTC+14)' },
  { value: 'Pacific/Majuro', label: 'Pacific/Majuro (Marshall Islands Time, UTC+12)' },
  { value: 'Pacific/Marquesas', label: 'Pacific/Marquesas (Marquesas Time, UTC-9:30)' },
  { value: 'Pacific/Norfolk', label: 'Pacific/Norfolk (Norfolk Time, UTC+11:30)' },
  { value: 'Pacific/Noumea', label: 'Pacific/Noumea (New Caledonia Time, UTC+11)' },
  { value: 'Pacific/Pago_Pago', label: 'Pacific/Pago_Pago (Samoa Standard Time, UTC-11)' },
  { value: 'Pacific/Pitcairn', label: 'Pacific/Pitcairn (Pitcairn Standard Time, UTC-8)' },
  { value: 'Pacific/Tongatapu', label: 'Pacific/Tongatapu (Tonga Time, UTC+13)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time, UTC±0)' },
];

// Lesson time options (10:00–18:00)
const timeOptions = Array.from({ length: 9 }, (_, i) => `${10 + i}:00`);

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    country: '',
    timeZone: '',
    preferredDateTime1: '',
    preferredDateTime2: '',
    preferredDateTime3: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const onChange =
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!form.fullName.trim()) return 'Full Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email required.';
    if (!form.country) return 'Country is required.';
    if (!form.timeZone) return 'Time Zone is required.';
    if (!form.preferredDateTime1) return 'Preferred Date & Time (1st choice) is required.';
    if (!agreed) return 'You must agree to the Privacy Policy.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    const err = validate();
    if (err) {
      alert(err); // show alert explicitly
      return setNotice(err);
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, agreed }),
      });
      if (!res.ok) throw new Error('Request failed');
      setNotice('Thanks! We received your message.');
      setForm({
        fullName: '',
        email: '',
        country: '',
        timeZone: '',
        preferredDateTime1: '',
        preferredDateTime2: '',
        preferredDateTime3: '',
        message: '',
      });
      setAgreed(false);
    } catch {
      setNotice('Sorry, something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <HeroHeader />
      <section className={styles.wrap} aria-labelledby="contact-heading">
        <h2 id="contact-heading" className={styles.title}>Trial Lesson Application Form</h2>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* Full Name (required) */}
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

          {/* Email (required) */}
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

          {/* Country (select, required) */}
          <div className={styles.row}>
            <label htmlFor="country" className={styles.label}>Country</label>
            <select
              id="country"
              className={styles.input}
              value={form.country}
              onChange={onChange('country')}
            >
              <option value="">-- Select Country --</option>
              {countryOptions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Time Zone (select, required) */}
          <div className={styles.row}>
            <label htmlFor="timeZone" className={styles.label}>Time Zone</label>
            <select
              id="timeZone"
              className={styles.input}
              value={form.timeZone}
              onChange={onChange('timeZone')}
            >
              <option value="">-- Select Time Zone --</option>
              {timeZoneOptions.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          {/* Preferred Date & Time (1st~3rd) — only 1st required */}
          {[1, 2, 3].map((n) => (
            <div className={styles.row} key={n}>
              <label className={styles.label}>
                Preferred Date & Time ({n}{n === 1 ? 'st' : n === 2 ? 'nd' : 'rd'} choice){n === 1 ? ' *' : ''}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="date"
                  className={styles.input}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      [`preferredDateTime${n}` as const]: `${e.target.value} ${p[`preferredDateTime${n}` as const]?.split(' ')[1] || ''}`.trim(),
                    }))
                  }
                />
                <select
                  className={styles.input}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      [`preferredDateTime${n}` as const]: `${p[`preferredDateTime${n}` as const]?.split(' ')[0] || ''} ${e.target.value}`.trim(),
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

          {/* Message (optional) */}
          <div className={styles.row}>
            <label htmlFor="message" className={styles.label}>Message (Optional)</label>
            <textarea
              id="message"
              className={`${styles.input} ${styles.textarea}`}
              value={form.message}
              onChange={onChange('message')}
              rows={3}
            />
          </div>

          {/* Privacy Policy Agreement (required) */}
          <div className={styles.row}>
            {/* 左カラムは空ラベルで揃え */}
            <label className={styles.label} htmlFor="agree"></label>

            {/* 右カラム */}
            <label
              htmlFor="agree"
              className={styles.checkboxLabel}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <input
                id="agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                aria-required="true"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.privacyLink}
                >
                  Privacy Policy
                </a>.
              </span>
            </label>
          </div>



          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </div>

          {notice && <p className={styles.notice}>{notice}</p>}
        </form>
      </section>
      <Footer />
    </>
  );
}
