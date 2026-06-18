import { NextResponse } from 'next/server';
import path from 'path';
import { kv } from '@vercel/kv';
import fs from 'fs';

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
    const downloadUrl = isAiStack ? '/ebook/AI-Stack-for-Junior-Developers-MarodTech.pdf' : '/ebook/marod-tech-handbook.docx';
    const fileName = isAiStack ? 'AI-Stack-for-Junior-Developers-MarodTech.pdf' : 'Marod-Tech-Handbook.docx';

    // Store lead in Vercel KV (list) and increment download count
    try {
      await kv.lpush('ebook_leads', JSON.stringify({ name, email, bookId: bookId || 'marod-tech', bookTitle, downloadedAt: new Date().toISOString() }));
      await kv.incr('ebook_downloads');
      await kv.incr(`ebook_downloads_${bookId || 'marod-tech'}`);
      incrementDownloadCount();
    } catch (e) {
      console.warn('KV operation failed:', e);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'Ebook Download <onboarding@resend.dev>';
    const receiverEmail = process.env.CONTACT_RECEIVER || 'lewisdaniel647@gmail.com';

    if (apiKey) {
      // 1. Read the local file and convert it to Base64 for Resend attachment
      let base64Content = null;
      try {
        const filePath = path.join(process.cwd(), 'public', downloadUrl);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          base64Content = fileBuffer.toString('base64');
        } else {
          console.error('Ebook file not found for email attachment:', filePath);
        }
      } catch (fsErr) {
        console.error('Failed to read ebook file for attachment:', fsErr);
      }

      // 2. Send email to the User containing the book (attached + message)
      try {
        const userEmailBody = {
          from: senderEmail,
          to: [email],
          subject: `📚 Your Copy: ${bookTitle}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #333; line-height: 1.6;">
              <h2 style="color: #D85A21; border-bottom: 2px solid #D85A21; padding-bottom: 8px;">Your Handbook is Here! 🎉</h2>
              <p>Hello ${name},</p>
              <p>Thank you for your interest in my handbook, <strong>${bookTitle}</strong>. I'm excited for you to read it!</p>
              <p>I have attached a copy of the handbook directly to this email for your convenience.</p>
              <p>If you don't see the attachment, you can also download it directly from the link below:</p>
              <p style="margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://dannyblaq.com'}${downloadUrl}" style="background-color: #D85A21; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Direct Download Link
                </a>
              </p>
              <p>If you have any feedback or would like to chat about custom software or AI integrations, feel free to reply directly to this email.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p>Warm regards,</p>
              <p><strong>Daniel Lewis</strong><br /><span style="color: #666; font-size: 0.85rem;">Software Engineer & Tech Innovator</span></p>
            </div>
          `,
        };

        if (base64Content) {
          userEmailBody.attachments = [
            {
              content: base64Content,
              filename: fileName,
            }
          ];
        }

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(userEmailBody),
        });
      } catch (userEmailErr) {
        console.error('Failed to send delivery email to user:', userEmailErr);
      }

      // 3. Send lead notification email to the owner
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: senderEmail,
            to: [receiverEmail],
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
      } catch (ownerEmailErr) {
        console.error('Failed to send notification email to owner:', ownerEmailErr);
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
