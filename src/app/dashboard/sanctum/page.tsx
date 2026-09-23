"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import PremiumPaywall from "@/components/billing/PremiumPaywall";
import { Crown, Video, MessageSquare } from "lucide-react";

export default function SanctumPage() {
  const { userDoc, loading } = useUserStore();

  if (loading || !userDoc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="w-16 h-16 border border-gold/30 rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border border-gold/60 -rotate-12 absolute" />
        </div>
      </div>
    );
  }

  // Strict Tier Gating
  if (userDoc.subscriptionTier !== 'inner_sanctum') {
    return (
      <div className="min-h-screen pt-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-obsidian-light/20 via-obsidian to-black">
        <PremiumPaywall 
          title="أبواب المجلس السري موصدة"
          description="هذا الملاذ محجوز حصرياً لأولئك الذين أثبتوا التزامهم المطلق بالارتقاء. المجلس السري ليس مجرد ترقية، بل هو عهد بينك وبين النخبة."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto relative">
      
      {/* Sanctum Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 blur-[120px] pointer-events-none rounded-full" />
      
      <header className="mb-20 text-center relative z-10 border-b border-gold/10 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gold/10 to-transparent rounded-full flex items-center justify-center border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
        >
          <Crown className="text-gold w-10 h-10" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-amiri font-bold text-gold-light mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)] tracking-wide"
        >
          المجلس السري
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-gold/60 font-inter max-w-2xl mx-auto leading-relaxed text-lg tracking-[0.1em]"
        >
          مرحباً بك في أروقة النخبة. حيث تُصاغ الأفكار التي تحرك العالم، وتُكشف الحقائق التي لا تُكتب.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Mastermind Videos (Main Column) */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-center gap-4 mb-8">
            <Video className="text-gold w-6 h-6" />
            <h2 className="text-3xl font-amiri text-neutral-200">جلسات النخبة (Mastermind)</h2>
          </div>
          
          {[1, 2].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-obsidian-light/40 border border-gold/20 p-4 rounded-sm group cursor-pointer hover:border-gold/50 transition-all duration-500"
            >
              <div className="w-full aspect-video bg-black/60 relative overflow-hidden flex items-center justify-center mb-6 border border-gold/10">
                <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors duration-500" />
                <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  <PlayIcon className="w-6 h-6 text-gold-light ml-1" />
                </div>
              </div>
              <h3 className="text-2xl font-amiri text-gold-light mb-2">تفكيك الأنا: الجلسة السادسة</h3>
              <p className="text-neutral-400 font-inter text-sm mb-4">نقاش عميق حول الفناء النفسي وبناء الإرادة المطلقة وسط فوضى العالم الحديث.</p>
              <span className="text-xs font-inter text-gold/40 tracking-widest uppercase">١٢ نوفمبر ٢٠٢٦ • ساعتان</span>
            </motion.div>
          ))}
        </div>

        {/* Discussion Board (Sidebar) */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4 mb-8">
            <MessageSquare className="text-gold w-6 h-6" />
            <h2 className="text-3xl font-amiri text-neutral-200">طاولة الحوار</h2>
          </div>

          <div className="bg-obsidian-light/30 border border-gold/10 rounded-sm p-6 h-[600px] flex flex-col relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-obsidian to-transparent z-10 pointer-events-none" />
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 pt-8 relative z-0 custom-scrollbar">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-b border-gold/5 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-gold" />
                    </div>
                    <span className="font-amiri text-gold-light">مُستنير خفي</span>
                  </div>
                  <p className="text-neutral-300 font-inter text-sm leading-relaxed text-right" dir="rtl">
                    لقد طبقت مبدأ (Amor Fati) الأسبوع الماضي عندما خسرت صفقة كبرى. لأول مرة، لم أشعر بالغضب، بل بالوضوح المطلق. القوة تكمن في التسليم.
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gold/20 mt-4">
              <textarea 
                placeholder="شارك رؤيتك مع النخبة..."
                className="w-full bg-black/50 border border-gold/20 rounded-sm p-4 text-neutral-200 font-inter text-sm focus:outline-none focus:border-gold/60 transition-colors resize-none h-24 text-right"
                dir="rtl"
              />
              <button className="w-full mt-3 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold py-2 font-amiri transition-colors">
                طرح الرؤية
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

