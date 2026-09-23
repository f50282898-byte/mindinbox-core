import { adminDb } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as crypto from "crypto";

export interface AffiliateReward {
  id: string;
  referredUserId: string;
  rewardType: 'commission' | 'free_month';
  amount?: number;
  createdAt: Timestamp;
}

export interface AffiliateStats {
  referralCode: string;
  referralsCount: number;
  totalEarnings: number;
}

/**
 * Generates a unique referral code based on UID
 */
export function generateReferralCode(uid: string): string {
  // Use first 6 chars of sha256 hash of uid + a secret salt to make it unique and short
  const hash = crypto.createHash('sha256').update(uid + 'ELITE_SALT_MIND').digest('hex');
  return `MIND-${hash.substring(0, 6).toUpperCase()}`;
}

/**
 * Validates a referral code and returns the referrer's UID
 */
export async function getReferrerByCode(code: string): Promise<string | null> {
  try {
    const snapshot = await adminDb
      .collection('users')
      .where('referralCode', '==', code)
      .limit(1)
      .get();
      
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    return null;
  } catch (err) {
    console.error("Error fetching referrer by code:", err);
    return null;
  }
}

/**
 * Credits a successful premium subscription to the referrer
 */
export async function creditReferral(referrerUid: string, newSubscriberUid: string, tier: 'awakened' | 'inner_sanctum'): Promise<void> {
  try {
    const referrerRef = adminDb.collection('users').doc(referrerUid);
    const rewardsRef = referrerRef.collection('rewards').doc();
    
    // Determine reward based on the purchased tier
    const rewardAmount = tier === 'inner_sanctum' ? 20 : 10;
    
    await adminDb.runTransaction(async (transaction) => {
      const referrerDoc = await transaction.get(referrerRef);
      if (!referrerDoc.exists) throw new Error("Referrer does not exist");
      
      const currentCount = referrerDoc.data()?.referralsCount || 0;
      const currentEarnings = referrerDoc.data()?.totalEarnings || 0;
      
      // Update User Document
      transaction.update(referrerRef, {
        referralsCount: currentCount + 1,
        totalEarnings: currentEarnings + rewardAmount
      });
      
      // Add record to Rewards subcollection
      transaction.set(rewardsRef, {
        id: rewardsRef.id,
        referredUserId: newSubscriberUid,
        rewardType: 'commission',
        amount: rewardAmount,
        createdAt: FieldValue.serverTimestamp()
      });
    });
    
    console.log(`Successfully credited referral to ${referrerUid}`);
  } catch (err: any) {
    console.error("Error crediting referral:", err);
    throw err;
  }
}

