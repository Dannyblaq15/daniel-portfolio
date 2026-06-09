import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // 1. If RESEND_API_KEY is configured (on Vercel), send an email
    if (process.env.RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: 'dl5357742@gmail.com',
          subject: `New Portfolio Message: ${subject || 'No Subject'}`,
          html: `
            <h3>New Portfolio Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <div style="padding: 10px; background: #f3f4f6; border-radius: 4px;">${message}</div>
          `,
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error('Resend API failed:', errText);
      }
    }

    // 2. Always fallback to/keep local logging to contacts.json for record-keeping
    const filePath = path.join(process.cwd(), 'data', 'contacts.json');

    // Ensure the data directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Read existing contacts if any
    let contacts = [];
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      if (fileData) {
        contacts = JSON.parse(fileData);
      }
    } catch (err) {
      // File does not exist yet
    }

    // Append the new submission
    contacts.push({
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Write back to the file
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));

    return NextResponse.json(
      { success: true, message: 'Message processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
