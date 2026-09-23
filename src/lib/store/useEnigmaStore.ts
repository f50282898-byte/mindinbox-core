import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface EnigmaState {
  solvedEnigmas: string[];
  activeEnigma: string | null;
  solveEnigma: (id: string, uid?: string) => Promise<void>;
  clearActiveEnigma: () => void;
  hasSolved: (id: string) => boolean;
}

export const useEnigmaStore = create<EnigmaState>()(
  persist(
    (set, get) => ({
      solvedEnigmas: [],
      activeEnigma: null,

      solveEnigma: async (id: string, uid?: string) => {
        const { solvedEnigmas } = get();
        if (solvedEnigmas.includes(id)) return;

        set({
          solvedEnigmas: [...solvedEnigmas, id],
          activeEnigma: id,
        });

        // Sync to Firestore if authenticated
        if (uid) {
          try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
              solvedEnigmas: arrayUnion(id),
            });
          } catch (err) {
            console.error("Error syncing enigma to Firestore:", err);
          }
        }
      },

      clearActiveEnigma: () => set({ activeEnigma: null }),
      
      hasSolved: (id: string) => get().solvedEnigmas.includes(id),
    }),
    {
      name: 'enigma-storage',
    }
  )
);

