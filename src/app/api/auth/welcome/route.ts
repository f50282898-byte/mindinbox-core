import { NextResponse } from 'next/server';
import { sendLuxuriousEmail } from '@/lib/services/emailService';
import WelcomeEmail from '@/components/emails/WelcomeEmail';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // In a production app, verify the request originates from your authenticated client
    // via Firebase Auth tokens before sending to prevent spam.

    await sendLuxuriousEmail({
      to: email,
      subject: 'مرحباً بك في رحلة الوعي | Mind in a Box',
      reactComponent: WelcomeEmail({ userName: name || 'أيها المستنير' }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Welcome Email API Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}


