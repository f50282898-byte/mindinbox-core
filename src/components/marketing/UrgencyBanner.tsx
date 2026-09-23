"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UrgencyBanner() {
  const { userDoc, loading } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [hoursRemaining, setHoursRemaining] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && userDoc && userDoc.subscriptionTier === 'trial' && userDoc.trialEndDate) {
      // Calculate remaining hours safely on client
      const endDate = typeof (userDoc.trialEndDate as any).toDate === 'function' 
        ? (userDoc.trialEndDate as any).toDate().getTime() 
        : 0;
      
      const now = Date.now();
      const timeDiff = endDate - now;
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      
      if (hours > 0 && hours <= 48) {
        setHoursRemaining(hours);
      } else {
        setHoursRemaining(null);
      }
    }
  }, [mounted, userDoc]);

  if (!mounted || loading || hoursRemaining === null) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full bg-[#050505] border-b border-gold/30 shadow-[0_4px_20px_rgba(212,175,55,0.05)] relative z-50 py-3 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-300 font-amiri text-sm md:text-base tracking-wide flex-1 text-center sm:text-right" dir="rtl">
            توشك بصيرتك على الانقطاع. متبقي <span className="text-gold font-bold mx-1">{hoursRemaining}</span> ساعة لضمان مقعدك في مقام الحكمة.
          </p>
          <button 
            onClick={() => router.push('/dashboard/billing')} // Adjust billing route as needed
            className="bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold-light px-6 py-1.5 rounded-sm font-amiri text-sm transition-all animate-pulse hover:animate-none hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] whitespace-nowrap"
          >
            ارتقِ الآن
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

