"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Pause, Lock, Volume2 } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import { philosophers } from "@/lib/data/philosophers";
import { notFound } from "next/navigation";
import { useTTS } from "@/hooks/useTTS";

export default function PhilosopherPage({ params }: { params: { id: string } }) {
  const { userDoc, loading } = useUserStore();
  const { play, pause, isPlaying, isSupported } = useTTS();
  
  const phil = philosophers.find(p => p.id === params.id);
  
  if (!phil) {
    notFound();
  }

  // Determine if the user has premium access
  const isPremium = userDoc?.subscriptionTier === 'awakened' || userDoc?.subscriptionTier === 'inner_sanctum';

  const handleAudioToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play(phil.quote);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="w-12 h-12 border border-gold/30 rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 border border-gold/60 -rotate-12 absolute" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto relative">
      
      <Link href="/dashboard/utopia" className="inline-flex items-center gap-2 text-gold/60 hover:text-gold mb-12 font-inter transition-colors">
        <ArrowRight size={16} /> العودة للأروقة
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-obsidian-light/40 border border-gold/10 p-8 md:p-14 rounded-sm relative overflow-hidden backdrop-blur-md shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />
        
        <header className="mb-14 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold-light via-gold to-gold-dark mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            {phil.name}
          </h1>
          <p className="text-sm md:text-base font-inter text-gold/50 uppercase tracking-[0.2em] md:tracking-[0.4em]">
            {phil.era}
          </p>
        </header>

        <div className="relative z-10">
          
          {/* Audio Player */}
          {isSupported && (
            <div className="flex justify-center mb-12">
              <button 
                onClick={handleAudioToggle}
                className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-gold/10 to-gold/5 hover:from-gold/20 hover:to-gold/10 border border-gold/30 text-gold rounded-full px-8 py-4 transition-all duration-300 font-inter shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                <div className="absolute inset-0 rounded-full border border-gold/50 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
                {isPlaying ? (
                  <><Pause size={22} fill="currentColor" /> إيقاف الحكمة</>
                ) : (
                  <><Play size={22} fill="currentColor" className="ml-1" /> استمع للحكمة</>
                )}
                {isPlaying && <Volume2 size={18} className="absolute -right-8 animate-pulse text-gold/60" />}
              </button>
            </div>
          )}

          {/* Philosopher Quote */}
          <blockquote className="text-2xl md:text-4xl font-amiri text-neutral-200 leading-loose md:leading-[2] text-center border-y border-gold/10 py-12 my-10 relative">
            <span className="absolute top-4 right-2 text-7xl text-gold/10 font-serif leading-none">"</span>
            {phil.quote}
            <span className="absolute bottom-[-10px] left-2 text-7xl text-gold/10 font-serif leading-none">"</span>
          </blockquote>

          {/* Premium Insight (Tier Gating) */}
          <div className="mt-20 relative">
            <h3 className="font-amiri text-3xl text-gold mb-8 flex items-center justify-center gap-3 border-b border-gold/10 pb-6 text-center">
              البصيرة الخفية
            </h3>
            
            <div className="relative">
              <p className={`font-inter text-neutral-300 leading-relaxed text-lg md:text-xl text-justify ${!isPremium ? 'blur-md select-none opacity-50' : ''}`}>
                {phil.premiumInsight}
              </p>
              
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-obsidian/90 border border-gold/30 p-8 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center max-w-md w-full">
                    <Lock className="w-10 h-10 text-gold/60 mx-auto mb-4" />
                    <h4 className="font-amiri text-2xl text-gold-light mb-3">سرٌ محجوب</h4>
                    <p className="font-inter text-neutral-400 text-sm mb-6 leading-relaxed">
                      هذا المستوى من المعرفة متاح فقط لأصحاب رتبة المُستنير.
                    </p>
                    <Link 
                      href="/dashboard" // Redirect to subscription/billing page in reality
                      className="inline-block w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-obsidian px-6 py-3 rounded-sm font-amiri text-lg transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    >
                      ارتقِ إلى مقام الحكمة لفتح الأسرار المكتومة
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
