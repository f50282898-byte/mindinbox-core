export type UserRole = 'seeker' | 'awakened' | 'master' | 'admin';

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  interactionsCount: number;
  trialStartDate: number | null;
  subscriptionId: string | null;
  createdAt: number;
  lastLogin: number;
}

