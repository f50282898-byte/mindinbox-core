import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const MAX_FREE_INTERACTIONS = 5;

export function useFreemium() {
  const user = useAuthStore((state) => state.user);
  const isTrialActive = useAuthStore((state) => state.isTrialActive);
  const subscriptionTier = useAuthStore((state) => state.subscriptionTier);
  
  const [freeInteractions, setFreeInteractions] = useState(0);

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("mib_free_interactions");
      if (stored) setFreeInteractions(parseInt(stored, 10));
    }
  }, [user]);

  const recordInteraction = () => {
    if (!user) {
      const newCount = freeInteractions + 1;
      setFreeInteractions(newCount);
      localStorage.setItem("mib_free_interactions", newCount.toString());
    }
  };

  const canInteract = () => {
    if (subscriptionTier !== "none") return true;
    if (user && isTrialActive) return true;
    if (!user && freeInteractions < MAX_FREE_INTERACTIONS) return true;
    return false;
  };

  return { canInteract, recordInteraction, freeInteractions, maxFree: MAX_FREE_INTERACTIONS };
}

