import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Send email via Resend if API key is set
    if (process.env.RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: 'lewisdaniel960@gmail.com',
          subject: `New Portfolio Message: ${subject || 'No Subject'}`,
          html: `
            <h3>New Portfolio Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <div style="padding:10px;background:#f3f4f6;border-radius:4px;">${message}</div>
          `,
        }),
      });
      console.log('Resend response status:', emailRes.status);
      const emailResText = await emailRes.text();
      console.log('Resend response body:', emailResText);
      if (!emailRes.ok) {
        console.error('Resend API error:', emailResText);
        return NextResponse.json({ success: false, error: 'Email sending failed' }, { status: 502 });
      }
    }

    return NextResponse.json({ success: true, message: 'Message processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process message' }, { status: 500 });
  }
}
