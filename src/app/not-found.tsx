"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[100px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <div className="relative w-32 h-32 mx-auto mb-10">
          {/* Broken Golden Box Animation */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[1px] border-gold/30 rotate-12"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[1px] border-gold/40 rotate-45"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-cinzel text-gold-light drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">404</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark mb-6">
          الفراغ المعرفي
        </h1>
        <p className="text-neutral-400 font-inter text-lg md:text-xl max-w-lg mx-auto leading-relaxed mb-10">
          يبدو أنك تبحث عن حكمة لم تُكتب بعد، أو أنك قد انحرفت عن مسار الوعي الصحيح.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-gold to-gold-light text-obsidian px-8 py-3 rounded-sm font-amiri text-lg transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105"
        >
          <ArrowRight size={18} className="rotate-180" />
          العودة إلى المسار
        </Link>
      </motion.div>
    </div>
  );
}

