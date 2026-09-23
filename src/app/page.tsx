"use client";

import Link from "next/link";
import { OracleBanner } from "@/components/OracleBanner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      <OracleBanner />
      
      {/* Hidden Easter Egg: Faint golden dot on the page border */}
      <div 
        className="absolute top-24 right-6 w-1.5 h-1.5 bg-gold rounded-full opacity-10 cursor-pointer hover:opacity-100 transition-opacity z-50 shadow-[0_0_10px_#D4AF37]"
        onClick={() => setShowSecret(true)}
      />

      <AnimatePresence>
        {showSecret && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-obsidian/95 z-[100] flex items-center justify-center p-6 backdrop-blur-md cursor-pointer"
            onClick={() => setShowSecret(false)}
          >
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-gold font-cinzel text-2xl md:text-4xl text-center leading-relaxed tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              "The unexamined life is not worth living."
              <span className="text-sm md:text-base mt-8 block text-gold/50 tracking-widest uppercase">
                - Socrates
              </span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Navbar / Logo Header */}
      <header className="absolute top-16 w-full flex justify-center z-50 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-12 h-12 rounded-sm overflow-hidden flex items-center justify-center relative shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-gold/20 backdrop-blur-sm pointer-events-auto"
        >
          <img src="/apple-touch-icon.png" alt="Logo" className="w-full h-full object-cover scale-[1.85]" />
        </motion.div>
      </header>
      
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 text-center mt-32 flex flex-col items-center justify-center z-10">
        
        {/* Hypnotic, slow-moving geometric golden box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-10 relative drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="absolute inset-0 border border-gold/40"
            animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 border border-gold/30"
            animate={{ rotateX: [360, 0], rotateY: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-6 border border-gold/60"
            animate={{ rotateX: [0, 360], rotateZ: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 bg-gold/10 rounded-sm blur-xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl md:text-7xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-light via-gold to-gold-dark mb-6 leading-tight drop-shadow-lg"
        >
          رحلة الوعي تبدأ هنا
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-inter text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 tracking-wide font-light leading-relaxed"
        >
          ليس مجرد تطبيق، بل هو انعكاس لعمق تفكيرك. ملاذ آمن للنخبة، حيث يتلاقى الذكاء الاصطناعي مع أعظم الفلسفات البشرية.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link 
            href="/auth" 
            className="group relative inline-flex items-center justify-center px-10 py-4 font-amiri text-lg font-bold tracking-widest text-obsidian bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] rounded-sm"
          >
            <span className="relative z-10">ابدأ رحلة الوعي</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </Link>
          
          <Link 
            href="/auth?type=booklet" 
            className="group relative inline-flex items-center justify-center px-10 py-4 font-amiri text-lg font-bold tracking-widest text-gold border border-gold/40 hover:border-gold hover:bg-gold/5 transition-all duration-300 rounded-sm"
          >
            <span className="relative z-10">احصل على الكتيب المجاني</span>
          </Link>
        </motion.div>

        {/* Social Proof / Trust */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 pt-10 border-t border-gold/10 w-full max-w-lg mx-auto flex flex-col items-center"
        >
          <p className="text-sm font-inter text-gold/40 mb-6 uppercase tracking-[0.2em]">موثوق من قبل النخبة</p>
          <div className="flex gap-8 items-center justify-center opacity-60">
            {/* Instagram */}
            <svg className="w-6 h-6 text-gold hover:text-gold-light transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            {/* YouTube */}
            <svg className="w-6 h-6 text-gold hover:text-gold-light transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            {/* TikTok */}
            <svg className="w-6 h-6 text-gold hover:text-gold-light transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.81 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}

