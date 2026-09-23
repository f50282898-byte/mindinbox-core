import { create } from "zustand";
import { User } from "firebase/auth";
import { UserDocument } from "@/types";

interface AuthState {
  user: User | null;
  userDoc: UserDocument | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserDoc: (doc: UserDocument | null) => void;
  setLoading: (loading: boolean) => void;
  getInteractionsLeft: () => number;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userDoc: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserDoc: (userDoc) => set({ userDoc }),
  setLoading: (loading) => set({ loading }),
  
  getInteractionsLeft: () => {
    const { user, userDoc } = get();
    if (!user || !userDoc) return 5; // Unregistered limit
    
    if (userDoc.role === 'awakened' || userDoc.role === 'master' || userDoc.role === 'admin') {
      return Infinity; // Unlimited
    }
    
    if (userDoc.trialStartDate) {
      const trialDuration = 14 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now - userDoc.trialStartDate < trialDuration) {
        return Infinity;
      }
    }
    
    return Math.max(0, 5 - (userDoc.interactionsCount || 0));
  }
}));

