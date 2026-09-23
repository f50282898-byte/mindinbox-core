import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store/useUserStore";

const MAX_FREE_INTERACTIONS = 5;

export function useFreemium() {
  const user = useUserStore((state) => state.user);
  const userDoc = useUserStore((state) => state.userDoc);
  const isTrialExpired = useUserStore((state) => state.isTrialExpired);
  
  const subscriptionTier = userDoc?.subscriptionTier || "none";
  const isTrialActive = !isTrialExpired;
  
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
    if (subscriptionTier !== "none" && subscriptionTier !== "trial" && subscriptionTier !== "freemium") return true;
    if (user && subscriptionTier === "trial" && isTrialActive) return true;
    if (!user && freeInteractions < MAX_FREE_INTERACTIONS) return true;
    return false;
  };

  return { canInteract, recordInteraction, freeInteractions, maxFree: MAX_FREE_INTERACTIONS };
}

