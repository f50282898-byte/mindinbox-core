import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2026-08-26.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.userId;
      
      if (userId) {
        // Here we'd map Stripe Price ID to our internal tiers
        // For now, we simulate assuming they bought the 'awakened' tier as a baseline, 
        // but in production, we check session.line_items or metadata to determine the exact tier.
        
        // Let's assume metadata contains the 'tier' or we default to 'awakened'
        const purchasedTier = session.metadata?.tier || 'awakened';

        await adminDb.collection('users').doc(userId).update({
          subscriptionTier: purchasedTier,
          subscriptionId: session.subscription || null,
        });
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      // You'd typically look up the user by Stripe customer ID here.
      // But for simplicity, we assume we stored customerId in the user doc, or we query it.
      const snapshot = await adminDb.collection('users').where('subscriptionId', '==', subscription.id).get();
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
          subscriptionTier: 'freemium',
          subscriptionId: null,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}


