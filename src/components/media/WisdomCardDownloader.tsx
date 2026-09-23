"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface WisdomCardDownloaderProps {
  quote: string;
  author: string;
  userName: string;
}

export default function WisdomCardDownloader({ quote, author, userName }: WisdomCardDownloaderProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsDownloading(true);
      // Increased pixel ratio for high-res wallpaper quality
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        style: {
          transform: 'scale(1)', // Fix potential rendering issues on mobile
        }
      });
      
      const link = document.createElement("a");
      link.download = `mind_in_a_box_${author.replace(/\\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 my-10">
      
      {/* The DOM Node to be converted into an image */}
      <div 
        ref={cardRef}
        className="w-[1080px] h-[1920px] max-w-full max-h-[80vh] aspect-[9/16] bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-12 md:p-24 shadow-2xl border border-gold/20"
        style={{ transformOrigin: "top center" }} // Keeps it visually contained without breaking scaling
      >
        {/* Sacred Geometry Watermark Background */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] border border-gold/30 rotate-45 flex items-center justify-center">
            <div className="w-[600px] h-[600px] border border-gold/50 -rotate-12 absolute" />
            <div className="w-[400px] h-[400px] border border-gold/80 rotate-45 absolute rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center w-full">
          <span className="block text-9xl text-gold/20 font-serif leading-none h-16">"</span>
          
          <p className="text-4xl md:text-5xl lg:text-6xl font-amiri text-gold-light leading-relaxed drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] my-12" dir="rtl">
            {quote}
          </p>
          
          <span className="block text-9xl text-gold/20 font-serif leading-none rotate-180 h-16">"</span>
          
          <p className="text-2xl md:text-3xl text-neutral-400 font-inter tracking-widest mt-10 uppercase">
            — {author} —
          </p>
        </div>

        {/* Footer Signature */}
        <div className="absolute bottom-16 left-0 w-full flex flex-col items-center gap-4 z-10">
          <div className="w-16 h-[1px] bg-gold/50" />
          <p className="text-gold/60 font-inter tracking-[0.3em] uppercase text-sm md:text-base">
            MIND IN A BOX
          </p>
          {userName && (
            <p className="text-neutral-500 font-amiri text-sm md:text-lg">
              حُفظت لـ {userName}
            </p>
          )}
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading || isDone}
        className="flex items-center gap-3 bg-gradient-to-r from-gold/10 to-transparent border border-gold hover:bg-gold/20 text-gold-light px-8 py-4 rounded-sm font-amiri text-xl transition-all disabled:opacity-50 min-w-[250px] justify-center hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
      >
        {isDownloading ? (
          <>
            <Loader2 className="animate-spin" />
            جاري النحت...
          </>
        ) : isDone ? (
          <>
            <CheckCircle className="text-green-500" />
            تم الحفظ بنجاح
          </>
        ) : (
          <>
            <Download />
            احفظ هذه الحكمة
          </>
        )}
      </button>

    </div>
  );
}

