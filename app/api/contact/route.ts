import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().trim().min(1),
  lastName:  z.string().trim().min(1),
  email:     z.string().trim().email(),
  country:   z.string().trim().min(1),
  content:   z.string().trim().min(1),
});

function transporter() {
  // Gmail SMTP
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,              // 587 を使うなら secure: false にして TLS
    secure: true,           // 465: true / 587: false (+requireTLS: true推奨)
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const t = transporter();

    const subject = `New inquiry from ${data.firstName} ${data.lastName}`;
    const plainText = [
      `Name: ${data.firstName} ${data.lastName}`,
      `Email: ${data.email}`,
      `Country: ${data.country}`,
      '',
      'Content:',
      data.content,
    ].join('\n');

    // あなた宛に通知
    await t.sendMail({
      from: process.env.CONTACT_FROM || process.env.GMAIL_USER!,
      to: process.env.CONTACT_TO!,
      replyTo: data.email, // 返信で送信者に届く
      subject,
      text: plainText,
    });

    // 送信者へ自動返信（不要なら削除）
    await t.sendMail({
      from: process.env.CONTACT_FROM || process.env.GMAIL_USER!,
      to: data.email,
      subject: 'Thanks for your inquiry',
      text:
        `Hi ${data.firstName},\n\nThanks for reaching out! We received your message and will get back to you shortly.\n\n---\n${plainText}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[contact] error:', err);
    // zod のバリデーションエラー
    if (err?.issues) {
      return NextResponse.json({ ok: false, error: 'Bad Request', detail: err.issues }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
