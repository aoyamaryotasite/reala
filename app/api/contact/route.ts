

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
    console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);
  console.log("CONTACT_TO:", process.env.CONTACT_TO);
  try {
    const b = await req.json().catch(() => ({}));

    // 必須項目チェック（フォーム仕様に合わせて変更）
    const requiredFields = [
      'fullName',
      'email',
      'country',
      'japaneseLevel',
      'learningPurpose',
      'preferredDateTime1'
    ] as const;

    for (const k of requiredFields) {
      if (!b?.[k]?.toString()?.trim()) {
        return NextResponse.json({ ok: false, error: `Missing field: ${k}` }, { status: 400 });
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    const resend = new Resend(need('RESEND_API_KEY'));
    const to = need('CONTACT_TO');
    const from = process.env.CONTACT_FROM?.trim() || 'Your Site <onboarding@resend.dev>';

    const subject = `New inquiry from ${b.fullName}`;

    // メール本文にすべての項目を整形して入れる
    const text = [
      `Full Name: ${b.fullName}`,
      `Email: ${b.email}`,
      `Country/Timezone: ${b.country}`,
      `Japanese Level: ${b.japaneseLevel}`,
      `Learning Purpose: ${b.learningPurpose}`,
      `Preferred Date & Time (1st): ${b.preferredDateTime1}`,
      `Preferred Date & Time (2nd): ${b.preferredDateTime2 || '-'}`,
      `Preferred Date & Time (3rd): ${b.preferredDateTime3 || '-'}`,
      `Learning History: ${b.learningHistory || '-'}`,
      `Other Message: ${b.otherMessage || '-'}`
    ].join('\n');

    // 管理者宛メール
    const r1 = await resend.emails.send({
      from,
      to,
      replyTo: b.email,
      subject,
      text,
    });

     console.log('Resend admin mail response:', r1);

    // 自動返信
    const r2 = await resend.emails.send({
      from,
      to: b.email,
      subject: 'Thanks for your inquiry',
      text: `Hi ${b.fullName},\n\nThanks for reaching out!\n\nWe received the following details:\n\n${text}`,
    });

    console.log('Resend auto-reply response:', r2);

    return NextResponse.json({ ok: true, r1, r2 }, { status: 200 });
  } catch (err: any) {
    console.error('[/api/contact] ERROR:', err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Server error', details: err?.response || err?.data || null },
      { status: 500 }
    );
  }
}
