import { NextResponse } from 'next/server';

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

    // Completely bypass Stripe
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/sanctum?unlocked=true`;

    return NextResponse.json({ url: inviteUrl });
  } catch (err: any) {
    console.error('Invite API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
