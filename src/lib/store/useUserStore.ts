import { create } from "zustand";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { UserDocument } from "@/types/user";

interface UserState {
  user: User | null;
  userDoc: UserDocument | null;
  loading: boolean;
  isTrialExpired: boolean;
  initializeAuth: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  userDoc: null,
  loading: true,
  isTrialExpired: false,

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ user: firebaseUser });
        
        // Sync token to cookie for Edge Middleware
        firebaseUser.getIdToken().then(token => {
          document.cookie = `authToken=${token}; path=/; max-age=3600; SameSite=Lax`;
        });
        
        // Listen to Firestore document changes in real-time
        const userRef = doc(db, "users", firebaseUser.uid);
        
        onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserDocument;
            
            // DEV MODE: Force Premium
            data.subscriptionTier = 'inner_sanctum';
            let expired = false;

            set({ 
              userDoc: data, 
              isTrialExpired: expired,
              loading: false 
            });
          } else {
            set({ userDoc: null, loading: false });
          }
        });
      } else {
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, userDoc: null, isTrialExpired: false, loading: false });
      }
    });
  }
}));
