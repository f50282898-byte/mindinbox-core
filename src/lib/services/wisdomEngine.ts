import { adminDb } from "@/lib/firebase/admin";

export interface DailyWisdom {
  id: string;
  text: string;
  author: string;
  tier: 'free' | 'premium';
  date: string; // YYYY-MM-DD
}

export async function getDailyWisdom(subscriptionTier?: string): Promise<DailyWisdom | null> {
  const today = new Date().toISOString().split('T')[0];
  const isPremium = subscriptionTier === 'awakened' || subscriptionTier === 'inner_sanctum';
  const targetTier = isPremium ? 'premium' : 'free';

  try {
    // 1. Try to fetch today's quote for the specific tier
    let snapshot = await adminDb
      .collection('dailyQuotes')
      .where('date', '==', today)
      .where('tier', '==', targetTier)
      .limit(1)
      .get();

    // 2. Fallback to any quote if no specific date is found (for development or if admin missed a day)
    if (snapshot.empty) {
      snapshot = await adminDb
        .collection('dailyQuotes')
        .where('tier', '==', targetTier)
        .limit(1)
        .get();
    }

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as DailyWisdom;
    }

    // 3. Absolute Hardcoded Fallback if DB is empty
    return {
      id: "fallback",
      text: isPremium 
        ? "المعرفة الحقيقية تبدأ عندما تدرك حجم جهلك المطلق." 
        : "لا تحزن، فكل شيء تفقده يعود إليك في هيئة أخرى.",
      author: isPremium ? "سقراط" : "جلال الدين الرومي",
      tier: targetTier,
      date: today
    };

  } catch (error) {
    console.error("Wisdom Engine Error:", error);
    return null;
  }
}

