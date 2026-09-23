import { Resend } from 'resend';
import { ReactElement } from 'react';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy123');

interface LuxuriousEmailOptions {
  to: string;
  subject: string;
  reactComponent: ReactElement;
}

/**
 * Sends an ultra-luxurious HTML email using Resend and React Email.
 */
export async function sendLuxuriousEmail({ to, subject, reactComponent }: LuxuriousEmailOptions) {
  try {
    const data = await resend.emails.send({
      from: 'Mind in a Box <concierge@mindinbox.com>',
      to,
      subject,
      react: reactComponent,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error(`Failed to send email to ${to}:`, error);
    return { success: false, error };
  }
}
