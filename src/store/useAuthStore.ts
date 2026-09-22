import { create } from "zustand";
import { User } from "firebase/auth";

export type SubscriptionTier = "none" | "awakened" | "pro";

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isTrialActive: boolean;
  subscriptionTier: SubscriptionTier;
  setUser: (user: User | null) => void;
  setTrialStatus: (isActive: boolean) => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  isTrialActive: false,
  subscriptionTier: "none",
  setUser: (user) => set({ user, isInitialized: true }),
  setTrialStatus: (isActive) => set({ isTrialActive: isActive }),
  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
}));

