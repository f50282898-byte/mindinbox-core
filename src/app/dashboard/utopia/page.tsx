"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { philosophers } from "@/lib/data/philosophers";

export default function UtopiaMainPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto relative">
      <header className="mb-20 text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          أروقة الخلود
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-neutral-400 font-inter max-w-xl mx-auto leading-relaxed text-lg"
        >
          هنا تهمس أرواح العظماء. استمع إلى حكمتهم الخالدة وتأمل في أبعادها بصوت يتجاوز حواجز الزمن.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {philosophers.map((phil, idx) => (
          <Link href={`/dashboard/utopia/${phil.id}`} key={phil.id}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 30px rgba(212,175,55,0.15)",
                borderColor: "rgba(212,175,55,0.5)"
              }}
              transition={{ 
                duration: 0.5, 
                delay: idx * 0.15,
                ease: "easeOut" 
              }}
              className="h-96 bg-obsidian border border-gold/10 p-8 rounded-sm relative overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              {/* Subtle background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <h2 className="text-3xl font-amiri font-bold text-gold-light mb-2 drop-shadow-md">
                  {phil.name}
                </h2>
                <p className="text-xs font-inter text-gold/50 tracking-widest uppercase mb-6">
                  {phil.era}
                </p>
                <p className="text-neutral-300 font-inter leading-relaxed text-sm italic border-r-2 border-gold/20 pr-4">
                  "{phil.brief}"
                </p>
              </div>

              <div className="relative z-10 mt-auto flex justify-end">
                <span className="text-gold/40 group-hover:text-gold transition-colors font-inter text-sm flex items-center gap-2">
                  دخول الرواق &larr;
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
