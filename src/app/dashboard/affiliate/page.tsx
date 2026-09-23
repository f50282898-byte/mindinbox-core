"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import PremiumPaywall from "@/components/billing/PremiumPaywall";
import InviteLink from "@/components/affiliate/InviteLink";
import { motion } from "framer-motion";
import { Network, Gem, Users } from "lucide-react";
import { generateReferralCode } from "@/lib/services/affiliateService"; // Normally we fetch this from API, simulating for UI architecture.

export default function AffiliateDashboard() {
  const { user, userDoc, loading } = useUserStore();
  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    // Generate or fetch referral code if user is authenticated and premium
    if (user && userDoc && (userDoc.subscriptionTier === 'awakened' || userDoc.subscriptionTier === 'inner_sanctum')) {
      // In production, we'd fetch this from the user document or an API endpoint.
      // For this phase execution, we generate it directly on the client to demonstrate UI logic,
      // though typically crypto hashes belong on the server.
      // Assuming a simplistic generation here for UI demonstration:
      const fallbackCode = `MIND-${user.uid.substring(0, 6).toUpperCase()}`;
      setReferralCode(userDoc.referralCode || fallbackCode);
    }
  }, [user, userDoc]);

  if (loading || !userDoc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-16 h-16 border border-[#D4AF37]/30 rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border border-[#D4AF37]/60 -rotate-12 absolute" />
        </div>
      </div>
    );
  }

  const isPremium = userDoc.subscriptionTier === 'awakened' || userDoc.subscriptionTier === 'inner_sanctum';

  if (!isPremium) {
    return (
      <div className="min-h-screen pt-24 bg-[#050505]">
        <PremiumPaywall 
          title="عصبة النخبة موصدة"
          description="برنامج الشراكة والدعوات الفكرية مخصص حصرياً للمستنيرين وأعضاء المجلس السري. ارتقِ لتشارك الحكمة."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-[#050505] relative overflow-hidden">
      
      {/* Sacred Geometry Background Subtlety */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        <header className="text-center mb-16 border-b border-[#D4AF37]/10 pb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto mb-6 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
          >
            <Network className="text-[#D4AF37] w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-amiri font-bold text-[#D4AF37] mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            العصبة الفكرية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-neutral-400 font-inter text-lg max-w-xl mx-auto tracking-wide"
          >
            شارك الوعي، واحصد الثمار المادية والمعنوية.
          </motion.p>
        </header>

        {/* Invitation Link Component */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <InviteLink referralCode={referralCode} />
        </motion.div>

        {/* Affiliate Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-[#050505] border border-[#D4AF37]/20 p-8 rounded-sm hover:border-[#D4AF37]/50 transition-colors shadow-lg relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-5">
              <Users className="w-32 h-32 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-amiri text-[#D4AF37] mb-2">العقول المستنيرة عبرك</h3>
            <p className="text-neutral-500 font-inter text-sm mb-6">إجمالي عدد المشتركين الذين لبوا دعوتك.</p>
            <p className="text-5xl font-cinzel text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {userDoc.referralsCount || 0}
            </p>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-[#050505] to-[#D4AF37]/5 border border-[#D4AF37]/30 p-8 rounded-sm hover:border-[#D4AF37]/70 transition-colors shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden"
          >
            <div className="absolute -left-4 -top-4 opacity-10">
              <Gem className="w-32 h-32 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-amiri text-[#D4AF37] mb-2">الحصاد الذهبي (المكافآت)</h3>
            <p className="text-neutral-500 font-inter text-sm mb-6">إجمالي العوائد المكتسبة من شبكتك الفكرية.</p>
            <p className="text-5xl font-cinzel text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              ${userDoc.totalEarnings || 0}
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

