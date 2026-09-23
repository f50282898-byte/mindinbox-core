"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnigmaStore } from "@/lib/store/useEnigmaStore";
import { useUserStore } from "@/lib/store/useUserStore";

interface EnigmaTriggerProps {
  enigmaId: string;
  quote: string;
  author: string;
}

export default function EnigmaTrigger({ enigmaId, quote, author }: EnigmaTriggerProps) {
  const [clickCount, setClickCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { solveEnigma, activeEnigma, clearActiveEnigma, hasSolved } = useEnigmaStore();
  const { user } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSolved = mounted ? hasSolved(enigmaId) : false;
  const isCurrentlyActive = mounted ? activeEnigma === enigmaId : false;

  const handleClick = () => {
    if (isSolved) return; // Already discovered
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      solveEnigma(enigmaId, user?.uid);
      setClickCount(0);
    }
  };

  useEffect(() => {
    // Apply golden trail effect to cursor globally if any enigma is solved
    if (isSolved && typeof document !== "undefined") {
      document.body.classList.add("enigma-solved-cursor");
    }
    return () => {
      // Don't remove the class on unmount because the store state persists
    };
  }, [isSolved]);

  return (
    <>
      {/* The Subtle Trigger */}
      <span 
        onClick={handleClick}
        className={`inline-block w-1 h-1 rounded-full cursor-pointer transition-colors duration-1000 ${
          isSolved ? 'bg-gold/80 shadow-[0_0_5px_#D4AF37]' : 'bg-gold/10 hover:bg-gold/30'
        }`}
        title="؟"
      />

      {/* The Revelation Overlay */}
      <AnimatePresence>
        {isCurrentlyActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={clearActiveEnigma}
          >
            {/* Glowing Aura */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)] pointer-events-none"
            />
            
            <div className="relative z-10 text-center max-w-4xl px-6">
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="text-3xl md:text-5xl font-amiri text-gold-light leading-relaxed drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-8"
              >
                "{quote}"
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="text-neutral-400 font-inter tracking-[0.3em] uppercase text-sm"
              >
                — {author} —
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 1 }}
                className="text-gold/30 font-inter text-xs mt-20 animate-pulse"
              >
                انقر في الفراغ للعودة
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

