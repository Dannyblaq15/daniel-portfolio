import { NextResponse } from 'next/server';
import path from 'path';
import { kv } from '@vercel/kv';

const counterFile = path.join(process.cwd(), 'public', 'ebook', 'download-count.json');

function incrementDownloadCount() {
  try {
    let count = 0;
    if (!fs.existsSync(path.dirname(counterFile))) {
      fs.mkdirSync(path.dirname(counterFile), { recursive: true });
    }
    if (fs.existsSync(counterFile)) {
      const data = fs.readFileSync(counterFile, 'utf-8');
      const parsed = JSON.parse(data);
      count = parsed.count || 0;
    }
    const newData = { count: count + 1 };
    fs.writeFileSync(counterFile, JSON.stringify(newData, null, 2));
  } catch (e) {
    console.error('Failed to increment ebook download count', e);
  }
}

export async function POST(request) {
  try {
    const { name, email, bookId } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const isAiStack = bookId === 'ai-stack';
    const bookTitle = isAiStack ? 'AI Stack for Junior Developers' : 'The Marod Tech Handbook';
    const downloadUrl = isAiStack ? '/ebook/ai-stack-for-junior-developers.docx' : '/ebook/marod-tech-handbook.docx';
    const fileName = isAiStack ? 'AI-Stack-for-Junior-Developers-MarodTech.docx' : 'Marod-Tech-Handbook.docx';

    // Store lead in Vercel KV (list) and increment download count
    try {
      await kv.lpush('ebook_leads', JSON.stringify({ name, email, bookId: bookId || 'marod-tech', bookTitle, downloadedAt: new Date().toISOString() }));
      await kv.incr('ebook_downloads');
      await kv.incr(`ebook_downloads_${bookId || 'marod-tech'}`);
    } catch (e) {
      console.warn('KV operation failed:', e);
    }

    // Send notification email via Resend (production)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Ebook Download <onboarding@resend.dev>',
            to: ['lewisdaniel647@gmail.com'],
            subject: `📘 New Ebook Download — ${name} (${bookTitle})`,
            html: `
              <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
                <h2 style="color:#D85A21">New Ebook Lead 🎉</h2>
                <p><strong>Book:</strong> ${bookTitle}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</p>
                <hr/>
                <p style="color:#888;font-size:0.8rem">From your portfolio — ${bookTitle} download</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Resend notification failed:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName,
      message: 'Access granted!',
    });
  } catch (err) {
    console.error('Ebook API error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
export async function GET(request) {
  try {
    const count = await kv.get('ebook_downloads');
    return NextResponse.json({ count: Number(count) || 0 }, { status: 200 });
  } catch (err) {
    console.error('Ebook count fetch error:', err);
    return NextResponse.json({ error: 'Unable to fetch count' }, { status: 500 });
  }
}
