import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs'; // ← Edgeだと一部ライブラリで落ちるため明示

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));

    // 超簡易バリデーション（足りない項目は 400 に）
    const fields = ['firstName', 'lastName', 'email', 'country', 'content'] as const;
    for (const k of fields) {
      if (!b?.[k]?.toString()?.trim()) {
        return NextResponse.json({ ok: false, error: `Missing field: ${k}` }, { status: 400 });
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    const resend = new Resend(need('RESEND_API_KEY'));
    const to = need('CONTACT_TO');
    // Gmail などは From に使えません。未設定なら Resend のデフォルトを使う
    const from = process.env.CONTACT_FROM?.trim() || 'Your Site <onboarding@resend.dev>';

    const subject = `New inquiry from ${b.firstName} ${b.lastName}`;
    const text = [
      `Name: ${b.firstName} ${b.lastName}`,
      `Email: ${b.email}`,
      `Country: ${b.country}`,
      '',
      'Content:',
      b.content,
    ].join('\n');

    // あなた宛
    const r1 = await resend.emails.send({
      from,
      to,
      reply_to: b.email,
      subject,
      text,
    });

    // 自動返信（不要ならこのブロック削除OK）
    const r2 = await resend.emails.send({
      from,
      to: b.email,
      subject: 'Thanks for your inquiry',
      text: `Hi ${b.firstName},\n\nThanks for reaching out!\n\n---\n${text}`,
    });

    return NextResponse.json({ ok: true, r1, r2 }, { status: 200 });
  } catch (err: any) {
    // ここで詳細をログに出す（Vercelの Functions → Logs で見える）
    console.error('[/api/contact] ERROR:', err?.message || err, err);
    // Resend のエラーオブジェクトは details を持つことがある
    return NextResponse.json(
      { ok: false, error: err?.message || 'Server error', details: err?.response || err?.data || null },
      { status: 500 },
    );
  }
}
