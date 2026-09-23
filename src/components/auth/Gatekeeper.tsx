"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface GatekeeperProps {
  children: React.ReactNode;
}

export default function Gatekeeper({ children }: GatekeeperProps) {
  const { user, userDoc, loading, isTrialExpired, initializeAuth } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading && !user && pathname.startsWith("/dashboard")) {
      router.push("/auth");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="w-16 h-16 border border-gold/30 rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border border-gold/60 -rotate-12 absolute" />
        </div>
      </div>
    );
  }

  if (!user || !userDoc) {
    return null; // Will redirect in useEffect
  }

  const isLocked = isTrialExpired && 
    (userDoc.subscriptionTier !== 'awakened' && userDoc.subscriptionTier !== 'inner_sanctum');

  return (
    <>
      {/* Dev Mode Badge */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-gold text-obsidian text-xs font-bold px-4 py-1 rounded-b-md shadow-lg border-b border-gold-light">
        Dev Mode: Premium Unlocked
      </div>

      <div className={`transition-all duration-700 ${isLocked ? 'blur-md pointer-events-none' : ''}`}>
        {children}
      </div>

      {isLocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-2xl" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative bg-obsidian border border-gold/20 p-10 md:p-14 max-w-2xl w-full text-center shadow-[0_0_80px_rgba(212,175,55,0.15)] rounded-sm"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold/20 to-transparent rounded-full flex items-center justify-center border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <Lock className="text-gold w-8 h-8" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark mb-4">
              انتهت فترة الاستنارة المجانية
            </h2>
            <p className="text-neutral-400 font-inter text-lg mb-10 leading-relaxed">
              لقد أتممت رحلتك المبدئية في سبر أغوار عقلك. الآن، أبواب النخبة مفتوحة لك للارتقاء بوعيك نحو أبعاد أعمق والوصول إلى المعرفة الخفية.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="border border-gold/10 bg-white/5 p-6 rounded-sm text-right hover:border-gold/30 transition-colors cursor-pointer group">
                <h3 className="text-gold-light font-amiri text-2xl mb-2 group-hover:text-gold transition-colors">المُستنير</h3>
                <p className="text-neutral-500 font-inter text-sm mb-6">تحليل ذكاء اصطناعي لامحدود ومكتبة الفلاسفة الكاملة.</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-cinzel text-white">$33</span>
                  <span className="text-sm text-neutral-500 mb-1">/mo</span>
                </div>
              </div>
              
              <div className="border border-gold/40 bg-gradient-to-b from-gold/10 to-transparent p-6 rounded-sm text-right relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.1)] cursor-pointer hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all">
                <div className="absolute top-4 left-[-30px] -rotate-45 bg-gold text-obsidian text-[10px] font-bold px-10 py-1 uppercase tracking-widest">
                  Elite
                </div>
                <h3 className="text-gold font-amiri text-2xl mb-2 mt-2">المجلس السري</h3>
                <p className="text-neutral-400 font-inter text-sm mb-6">توجيه مباشر، مجتمع حصري للنخبة، وجلسات تأمل مغلقة.</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-cinzel text-gold-light">$100</span>
                  <span className="text-sm text-neutral-500 mb-1">/mo</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-gold to-gold-light text-obsidian font-bold font-amiri text-xl py-4 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] hover:scale-[1.02] transition-all duration-300">
              ارتقِ بوعيك الآن
            </button>
            
          </motion.div>
        </div>
      )}
    </>
  );
}
