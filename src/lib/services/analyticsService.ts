import { adminDb } from "@/lib/firebase/admin";

export interface AnalyticsData {
  mrr: number;
  tiers: {
    freemium: number;
    trial: number;
    awakened: number;
    inner_sanctum: number;
  };
  atRiskUsers: Array<{ uid: string; email: string; trialEndsInHours: number }>;
  psychologyData: Array<{ uid: string; email: string; solvedEnigmas: number; dailyInteractions: number }>;
}

export async function getAdminAnalytics(): Promise<AnalyticsData> {
  try {
    const snapshot = await adminDb.collection('users').get();
    
    let mrr = 0;
    const tiers = { freemium: 0, trial: 0, awakened: 0, inner_sanctum: 0 };
    const atRiskUsers: Array<{ uid: string; email: string; trialEndsInHours: number }> = [];
    const psychologyData: Array<{ uid: string; email: string; solvedEnigmas: number; dailyInteractions: number }> = [];

    const now = Date.now();
    const fortyEightHoursMs = 48 * 60 * 60 * 1000;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const tier = data.subscriptionTier as keyof typeof tiers;
      
      // Tier counts
      if (tiers[tier] !== undefined) {
        tiers[tier]++;
      }

      // MRR Calculation
      if (tier === 'awakened') mrr += 33;
      if (tier === 'inner_sanctum') mrr += 100;

      // At-Risk Users (Trial ending in < 48 hours)
      if (tier === 'trial' && data.trialEndDate) {
        const endDate = data.trialEndDate.toDate().getTime();
        const timeDiff = endDate - now;
        
        if (timeDiff > 0 && timeDiff <= fortyEightHoursMs) {
          atRiskUsers.push({
            uid: doc.id,
            email: data.email || 'Unknown',
            trialEndsInHours: Math.round(timeDiff / (1000 * 60 * 60))
          });
        }
      }

      // Psychology Tracker Data (Highly engaged users)
      const solvedEnigmasCount = Array.isArray(data.solvedEnigmas) ? data.solvedEnigmas.length : 0;
      const interactions = data.dailyAIInteractions || 0;
      
      if (solvedEnigmasCount > 0 || interactions > 5) {
        psychologyData.push({
          uid: doc.id,
          email: data.email || 'Unknown',
          solvedEnigmas: solvedEnigmasCount,
          dailyInteractions: interactions
        });
      }
    });

    return { mrr, tiers, atRiskUsers, psychologyData };
  } catch (error: any) {
    console.error("Failed to fetch analytics:", error);
    throw new Error("Analytics fetching failed");
  }
}

