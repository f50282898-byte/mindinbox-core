import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    // 1. Verify Token via REST API (Edge Compatible)
    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token })
    });
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.users || verifyData.users.length === 0) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
    const adminUid = verifyData.users[0].localId;

    // 2. Verify Admin Role via Firestore REST API (Edge Compatible)
    const firestoreRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${adminUid}`
    );
    const firestoreData = await firestoreRes.json();
    
    // Extract role from Firestore Document format: { fields: { role: { stringValue: "admin" } } }
    const role = firestoreData.fields?.role?.stringValue;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin strictly required.' }, { status: 403 });
    }

    // 3. Process the Request
    const { userId, tier } = await req.json();
    if (!userId || tier !== 'inner_sanctum') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Initialize Stripe (Works in Edge in recent versions)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-08-26.dahlia',
      httpClient: Stripe.createFetchHttpClient(), // Crucial for Edge Runtime
    });

    // 4. Create a 24-hour 20% discount coupon
    const coupon = await stripe.coupons.create({
      percent_off: 20,
      duration: 'once',
      max_redemptions: 1,
      redeem_by: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expires in 24h
    });

    // 5. Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_SANCTum || 'price_sanctum_placeholder',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      discounts: [{
        coupon: coupon.id,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/sanctum?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        tier: 'inner_sanctum',
        type: 'elite_invitation'
      },
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Session also expires in 24h
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Invite API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

