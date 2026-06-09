import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // ── 1. Log to local file (always works) ───────────────────────────────────
    const logsDir = path.join(process.cwd(), 'ebook-leads');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

    const logFile = path.join(logsDir, 'leads.json');
    let leads = [];
    if (fs.existsSync(logFile)) {
      try { leads = JSON.parse(fs.readFileSync(logFile, 'utf-8')); } catch {}
    }
    leads.push({ name, email, downloadedAt: new Date().toISOString() });
    fs.writeFileSync(logFile, JSON.stringify(leads, null, 2));

    // ── 2. Send notification email via Resend (production) ───────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Ebook Download <onboarding@resend.dev>',
            to: ['lewisdaniel647@gmail.com'],
            subject: `📘 New Ebook Download — ${name}`,
            html: `
              <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
                <h2 style="color:#D85A21">New Ebook Lead 🎉</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</p>
                <hr/>
                <p style="color:#888;font-size:0.8rem">From your portfolio — Marod Tech Handbook download</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Resend notification failed:', emailErr);
        // Non-fatal — lead is already saved locally
      }
    }

    return NextResponse.json({
      success: true,
      downloadUrl: '/ebook/marod-tech-handbook.pdf',
      message: 'Access granted!',
    });
  } catch (err) {
    console.error('Ebook API error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
