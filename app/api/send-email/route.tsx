import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/email-template';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { firstName = 'Friend', email, message } = body as {
    firstName?: string;
    email?: string;
    message?: string;
  };

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
    return NextResponse.json({ error: 'Email is not configured.' }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailReact = <EmailTemplate firstName={firstName} message={message} />;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `New contact from ${firstName}`,
      react: emailReact,
    });

    if (error) {
      return NextResponse.json({ error: 'Email provider rejected the message.' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
