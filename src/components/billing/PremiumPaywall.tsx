"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles, Crown } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";

interface PremiumPaywallProps {
  title?: string;
  description?: string;
}

export default function PremiumPaywall({ 
  title = "هذا المستوى من الوعي يتطلب ارتقاءً", 
  description = "لقد وصلت إلى حدود المعرفة المجانية. ما يكمن خلف هذه البوابة مصمم خصيصاً للنخبة التي تبحث عن الحكمة المطلقة والتحكم الكامل في مسارات حياتها."
}: PremiumPaywallProps) {
  const { user } = useUserStore();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tier: string, priceId: string) => {
    if (!user) return; // User should be logged in via Gatekeeper anyway
    
    setLoadingTier(tier);
    
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          userEmail: user.email,
        }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      setLoadingTier(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 relative z-50">
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold/20 to-transparent rounded-full flex items-center justify-center border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <Lock className="text-gold w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          {title}
        </h2>
        <p className="text-neutral-400 font-inter text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* The Awakened Tier */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-obsidian-light border border-gold/20 rounded-sm p-8 hover:border-gold/50 transition-colors relative"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-amiri text-gold-light">المُستنير (Awakened)</h3>
            <Sparkles className="text-gold/60 w-6 h-6" />
          </div>
          <div className="mb-6 border-b border-gold/10 pb-6">
            <span className="text-5xl font-cinzel text-white">$33</span>
            <span className="text-neutral-500 font-inter ml-2">/ month</span>
          </div>
          <ul className="space-y-4 mb-8 text-neutral-300 font-inter text-sm text-right" dir="rtl">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-gold rounded-full" /> تحليل غير محدود للأفكار</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-gold rounded-full" /> الوصول الكامل لمكتبة الفلاسفة</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-gold rounded-full" /> تصدير PDF لكتاب الذات</li>
          </ul>
          
          <button 
            onClick={() => handleCheckout('awakened', 'price_awakened_placeholder')}
            disabled={loadingTier !== null}
            className="w-full bg-transparent border border-gold text-gold hover:bg-gold/10 font-bold font-amiri text-xl py-4 rounded-sm transition-all disabled:opacity-50 relative overflow-hidden"
          >
            {loadingTier === 'awakened' ? (
              <span className="animate-pulse flex items-center justify-center gap-2">جاري تجهيز البوابة...</span>
            ) : (
              "ارتقِ الآن"
            )}
          </button>
        </motion.div>

        {/* The Inner Sanctum Tier (Decoy / Anchor) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-b from-obsidian-light/80 to-obsidian border border-gold rounded-sm p-10 relative shadow-[0_0_50px_rgba(212,175,55,0.15)] scale-105 z-10 overflow-hidden"
        >
          <div className="absolute top-6 left-[-40px] -rotate-45 bg-gold text-obsidian text-[10px] font-bold px-12 py-1.5 uppercase tracking-[0.2em] shadow-lg">
            Elite Access
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-amiri text-gold font-bold">المجلس السري (Sanctum)</h3>
            <Crown className="text-gold w-8 h-8" />
          </div>
          <div className="mb-6 border-b border-gold/20 pb-6">
            <span className="text-6xl font-cinzel text-gold-light">$100</span>
            <span className="text-gold/60 font-inter ml-2">/ month</span>
          </div>
          <ul className="space-y-4 mb-10 text-neutral-200 font-inter text-sm text-right" dir="rtl">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-gold-light rounded-full shadow-[0_0_5px_#D4AF37]" /> كل مزايا المُستنير</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-gold-light rounded-full shadow-[0_0_5px_#D4AF37]" /> توجيه مباشر وفلسفي</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-gold-light rounded-full shadow-[0_0_5px_#D4AF37]" /> مجتمع حصري للنخبة (Mastermind)</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-gold-light rounded-full shadow-[0_0_5px_#D4AF37]" /> جلسات تأمل مغلقة</li>
          </ul>
          
          <button 
            onClick={() => handleCheckout('sanctum', 'price_sanctum_placeholder')}
            disabled={loadingTier !== null}
            className="w-full bg-gradient-to-r from-gold to-gold-light text-obsidian hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] font-bold font-amiri text-2xl py-4 rounded-sm transition-all disabled:opacity-50"
          >
            {loadingTier === 'sanctum' ? (
              <span className="animate-pulse">جاري الاستدعاء...</span>
            ) : (
              "ادخل المجلس السري"
            )}
          </button>
        </motion.div>

      </div>
    </div>
  );
}

