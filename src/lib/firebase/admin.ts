import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

// Use Proxies to defer execution until runtime (prevents Next.js build crashes)
export const adminDb = new Proxy({}, {
  get: (_, prop) => {
    const db = getFirestore();
    const val = (db as any)[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  }
}) as Firestore;

export const adminAuth = new Proxy({}, {
  get: (_, prop) => {
    const auth = getAuth();
    const val = (auth as any)[prop];
    return typeof val === 'function' ? val.bind(auth) : val;
  }
}) as Auth;
