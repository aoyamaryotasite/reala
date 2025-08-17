// /app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

// 受理するプラットフォーム（サーバー側でもホワイトリスト）
const ALLOWED_PLATFORMS = ['Zoom', 'Google Meet', 'Either is fine'] as const;

// --- util ---
function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

// "YYYY-MM-DD HH:MM" / "YYYY-MM-DDTHH:MM" / その他を安全に分割
function splitDateTime(input: string | undefined | null) {
  if (!input) return null;
  const s = String(input).trim();
  if (!s) return null;
  const sep = s.includes('T') ? 'T' : ' ';
  const [date, timeRaw] = s.split(sep);
  const time = (timeRaw || '').slice(0, 5); // HH:MM まで
  if (!date || !time) return null;
  return { date, time };
}

export async function POST(req: Request) {
  // --- Debug envs（本番は削除推奨） ---
  console.log('[contact] RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);
  console.log('[contact] CONTACT_TO:', process.env.CONTACT_TO);

  try {
    const body = await req.json().catch(() => ({}));
    console.log('[contact] raw body:', body);

    // ---- 希望日時（配列 or 旧キー）----
    let choices: Array<{ date: string; time: string }> = [];
    if (Array.isArray(body.choices)) {
      choices = body.choices
        .map((c: any) => (c?.date && c?.time ? { date: String(c.date), time: String(c.time) } : null))
        .filter(Boolean) as Array<{ date: string; time: string }>;
    } else {
      const c1 = splitDateTime(body.preferredDateTime1);
      const c2 = splitDateTime(body.preferredDateTime2);
      const c3 = splitDateTime(body.preferredDateTime3);
      choices = [c1, c2, c3].filter(Boolean) as Array<{ date: string; time: string }>;
    }

    // ---- プラットフォーム（配列推奨／単一文字列も後方互換）----
    const rawPlatforms: string[] = Array.isArray(body.preferredPlatforms)
      ? body.preferredPlatforms
      : (typeof body.preferredPlatform === 'string' && body.preferredPlatform
          ? [body.preferredPlatform]
          : []);

    // 正規化 + 重複除去 + ホワイトリスト
    const platforms = Array.from(
      new Set(
        rawPlatforms
          .map((v) => String(v).trim())
          .filter(Boolean)
      )
    ).filter((v) => (ALLOWED_PLATFORMS as readonly string[]).includes(v));

    // ---- 必須フィールド検証 ----
    const required = {
      fullName: String(body.fullName || '').trim(),
      email: String(body.email || '').trim(),
      country: String(body.country || '').trim(),
      timeZone: String(body.timeZone || '').trim(), // IANA想定
    };

    for (const [k, v] of Object.entries(required)) {
      if (!v) {
        return NextResponse.json({ ok: false, error: `Missing field: ${k}` }, { status: 400 });
      }
    }

    // メール形式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(required.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    // 希望日時は最低1件
    if (!choices.length) {
      return NextResponse.json({ ok: false, error: 'At least one preferred date/time is required' }, { status: 400 });
    }

    // プラットフォームは最低1つ（必須）
    if (platforms.length === 0) {
      return NextResponse.json({ ok: false, error: 'Preferred platform is required' }, { status: 400 });
    }

    // 任意
    const message = (body.message ?? body.otherMessage ?? '').toString();

    // ---- 送信用本文（不要項目は含めない）----
    const lines = [
      `New trial lesson inquiry`,
      `--------------------------------`,
      `Full Name: ${required.fullName}`,
      `Email: ${required.email}`,
      `Country: ${required.country}`,
      `Time Zone: ${required.timeZone}`,
      `Preferred Platform: ${platforms.join(', ')}`,
      `Preferred Date & Time:`,
      ...choices.map((c, i) => `  ${i + 1}) ${c.date} ${c.time}`),
      ``,
      `Message:`,
      message || '(none)',
    ];
    const text = lines.join('\n');

    // ---- Resend ----
    const resend = new Resend(need('RESEND_API_KEY'));
    const to = need('CONTACT_TO');
    const from = (process.env.CONTACT_FROM || 'Your Site <onboarding@resend.dev>').trim();
    const subject = `New inquiry from ${required.fullName}`;

    // 管理者宛
    const r1 = await resend.emails.send({
      from,
      to,
      cc: process.env.CONTACT_CC || undefined,
      replyTo: required.email,
      subject,
      text,
    });
    console.log('[contact] resend admin result:', r1);

    // 自動返信（ユーザー宛）
    const autoText = `Hi ${required.fullName},

Thank you for your trial lesson inquiry!
We have received your details:

- Name: ${required.fullName}
- Email: ${required.email}
- Country: ${required.country}
- Time Zone: ${required.timeZone}
- Preferred Platform: ${platforms.join(', ')}

Preferred Date & Time:
${choices.map((c, i) => `  ${i + 1}) ${c.date} ${c.time}`).join('\n')}

Message:
${message || '(none)'}

We will contact you shortly to confirm the schedule.

Best regards,
Reala Academy Team
`;
    const r2 = await resend.emails.send({
      from,
      to: required.email,
      subject: 'Thank you for your trial lesson inquiry',
      text: autoText,
    });
    console.log('[contact] resend autoreply result:', r2);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('[/api/contact] ERROR:', err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Server error', details: err?.response || err?.data || null },
      { status: 500 }
    );
  }
}
