import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/email-template';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || 'lewisdaniel960@gmail.com';

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

  const emailReact = <EmailTemplate firstName={firstName} message={message} />;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [CONTACT_RECEIVER],
      replyTo: email,
      subject: `New contact from ${firstName}`,
      react: emailReact,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(error, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
