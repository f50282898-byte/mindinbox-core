"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { getMasterclassById, Masterclass } from "@/lib/firebase/mediaService";
import MasterclassPlayer from "@/components/media/MasterclassPlayer";
import PremiumPaywall from "@/components/billing/PremiumPaywall";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

export default function MasterclassPage({ params }: { params: { id: string } }) {
  const { userDoc, loading } = useUserStore();
  const [masterclass, setMasterclass] = useState<Masterclass | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      const data = await getMasterclassById(params.id);
      if (data) setMasterclass(data);
      setFetching(false);
    };
    fetchMedia();
  }, [params.id]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="w-16 h-16 border border-gold/30 rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border border-gold/60 -rotate-12 absolute" />
        </div>
      </div>
    );
  }

  if (!masterclass) {
    notFound();
  }

  if (!userDoc || userDoc.subscriptionTier !== 'inner_sanctum') {
    return (
      <div className="min-h-screen pt-24 bg-obsidian">
        <PremiumPaywall 
          title="هذا المحتوى يتجاوز حدود وعيك الحالي"
          description="الوصول إلى هذه الجلسات الفلسفية المغلقة مقصور على أعضاء المجلس السري. ارتقِ لتشهد الحقيقة كاملة."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
      <Link href="/dashboard/sanctum" className="inline-flex items-center gap-2 text-gold/60 hover:text-gold mb-8 font-inter transition-colors">
        <ArrowRight size={16} /> العودة للمجلس
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        {/* We use a sample URL for demo, in production it would be masterclass.videoUrl */}
        <MasterclassPlayer 
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
          title={masterclass.title} 
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Philosophical Takeaways */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-gold w-6 h-6" />
            <h2 className="text-3xl font-amiri text-gold-light">مخطوطة الرؤى (Takeaways)</h2>
          </div>
          
          <div className="bg-gradient-to-b from-obsidian-light/50 to-obsidian border border-gold/10 p-8 rounded-sm relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[50px]" />
            <div className="prose prose-invert prose-p:text-neutral-300 prose-p:font-inter prose-p:leading-loose text-right" dir="rtl">
              <p>
                {masterclass.description || "إن الصراع الأساسي الذي يواجه الإنسان ليس مع العالم المادي، بل مع تصوراته الخاصة عنه. كل ألم ناتج عن مقاومة الحاضر ومحاولة فرض رغبة الأنا على مجرى القدر المطلق."}
              </p>
              <ul className="text-neutral-400 font-inter mt-6 space-y-3">
                <li><span className="text-gold px-2">١.</span> الفناء النفسي ليس اكتئاباً، بل تحرراً.</li>
                <li><span className="text-gold px-2">٢.</span> الوضوح يتطلب تدمير المسلمات المريحة.</li>
                <li><span className="text-gold px-2">٣.</span> التسليم للقدر (Amor Fati) هو ذروة السيادة.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Discussion Thread */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-gold w-6 h-6" />
            <h2 className="text-2xl font-amiri text-neutral-300">أصوات النخبة</h2>
          </div>
          
          <div className="bg-obsidian-light/20 border border-gold/10 p-6 rounded-sm h-[400px] flex flex-col justify-between">
            <div className="overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              <div className="border-b border-gold/5 pb-4">
                <span className="text-gold/80 font-amiri text-sm block mb-1">مُستنير خفي</span>
                <p className="text-neutral-400 font-inter text-sm leading-relaxed text-right" dir="rtl">
                  اللحظة التي استوعبت فيها النقطة الثانية، شعرت بثقل العالم يسقط عن كاهلي.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gold/10 mt-4">
              <input 
                type="text" 
                placeholder="شارك رؤيتك..."
                className="w-full bg-black/40 border border-gold/20 p-3 rounded-sm text-sm text-neutral-200 focus:border-gold/60 outline-none text-right font-inter"
                dir="rtl"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

