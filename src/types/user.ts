import { Timestamp, FieldValue } from "firebase/firestore";

export type UserRole = 'user' | 'admin';
export type SubscriptionTier = 'freemium' | 'trial' | 'awakened' | 'inner_sanctum';

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  trialStartDate: Timestamp | FieldValue;
  trialEndDate: Timestamp | FieldValue;
  dailyAIInteractions: number;
  createdAt: Timestamp | FieldValue;
  referralCode?: string;
  referralsCount?: number;
  totalEarnings?: number;
  solvedEnigmas?: string[];
  subscriptionId?: string | null;
}
