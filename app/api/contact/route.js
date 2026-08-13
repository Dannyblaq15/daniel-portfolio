import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const buckets = new Map();
const DIRECT_EMAIL = 'dl5357742@gmail.com';

function sanitize(value = '') {
  return String(value)
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildMailto(values) {
  const subject = encodeURIComponent(`Portfolio contact: ${values.subject}`);
  const body = encodeURIComponent(
    `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`
  );

  return `mailto:${DIRECT_EMAIL}?subject=${subject}&body=${body}`;
}

function validate(values) {
  const errors = {};
  if (values.name.length < 2 || values.name.length > 80) errors.name = 'Name must be between 2 and 80 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.subject.length < 3 || values.subject.length > 120) errors.subject = 'Subject must be between 3 and 120 characters.';
  if (values.message.length < 20 || values.message.length > 1200) errors.message = 'Message must be between 20 and 1200 characters.';
  return errors;
}

function rateLimit(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW;
  }

  bucket.count += 1;
  buckets.set(ip, bucket);
  return bucket.count <= MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request) {
  if (!rateLimit(request)) {
    return NextResponse.json(
      { success: false, error: 'Too many messages. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (payload.company) {
    return NextResponse.json({ success: true, message: 'Message processed successfully.' }, { status: 200 });
  }

  const values = {
    name: sanitize(payload.name),
    email: sanitize(payload.email).toLowerCase(),
    subject: sanitize(payload.subject),
    message: String(payload.message || '').replace(/[<>]/g, '').trim(),
  };

  const errors = validate(values);
  if (Object.keys(errors).length) {
    return NextResponse.json({ success: false, error: 'Please fix the highlighted fields.', errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      {
        success: false,
        error: 'Email sending is not configured yet. Opening a prefilled email instead.',
        mailto: buildMailto(values),
      },
      { status: 503 }
    );
  }

  const html = `
    <h2>New Portfolio Message</h2>
    <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(values.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(values.message).replace(/\n/g, '<br />')}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: values.email,
        subject: `Portfolio contact: ${values.subject}`,
        html,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Email provider rejected the message. Please retry or use the direct email link.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Network error while sending. Please retry or use the direct email link.' },
      { status: 502 }
    );
  }
}
