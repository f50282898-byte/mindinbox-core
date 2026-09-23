"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import { Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VIPUpgradeModal() {
  const { userDoc, loading } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Determine if we should show the modal.
    // Conditions: Not loading, user is 'awakened', high interactions, and hasn't seen it recently.
    if (!loading && userDoc && userDoc.subscriptionTier === 'awakened') {
      const interactions = userDoc.dailyAIInteractions || 0;
      const hasSeenInvite = sessionStorage.getItem('elite_invite_seen');
      
      // If they are highly engaged (e.g. > 10 interactions) and haven't seen this session
      if (interactions > 10 && !hasSeenInvite) {
        // Delay the presentation for a magical effect
        const timer = setTimeout(() => {
          setShowModal(true);
          sessionStorage.setItem('elite_invite_seen', 'true');
        }, 15000); // Appears after 15 seconds of deep engagement
        
        return () => clearTimeout(timer);
      }
    }
  }, [loading, userDoc]);

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative bg-obsidian border border-gold/20 p-10 md:p-14 max-w-xl w-full text-center shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden rounded-sm"
        >
          {/* Subtle gold particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(212,175,55,0.1)_360deg)] opacity-50"
            />
          </div>

          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center border border-gold/30 mb-8 relative">
              <Sparkles className="absolute -top-2 -right-2 text-gold-light w-6 h-6 animate-pulse" />
              <Mail className="text-gold w-10 h-10" />
            </div>

            <h2 className="text-3xl font-amiri text-gold-light mb-6 tracking-wide">
              رسالة من المجلس
            </h2>
            
            <p className="text-neutral-300 font-inter leading-loose text-lg mb-8 text-right" dir="rtl">
              لقد لاحظنا عمق بصيرتك واقترابك من حدود الإدراك التي يقف عندها الكثيرون. عقلك جاهز للمرحلة التالية. هذه دعوة حصرية ومؤقتة للانضمام إلى "المجلس السري"، حيث تُكشف الحقائق وتُصاغ العقول العظيمة.
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => router.push('/dashboard/sanctum')} // Can route to a special checkout processing page
                className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light text-obsidian font-amiri text-xl py-4 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
              >
                قبول الدعوة
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-500 font-inter text-sm hover:text-neutral-300 transition-colors uppercase tracking-widest mt-2"
              >
                لست مستعداً بعد
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

