"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely (e.g., to Sentry in production)
    console.error("Application Runtime Error Captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center relative px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-900/10 blur-[100px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-obsidian-light/50 border border-gold/10 p-10 max-w-md w-full text-center rounded-sm backdrop-blur-md relative z-10 shadow-2xl"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-red-950/30 rounded-full flex items-center justify-center border border-red-900/50">
          <AlertTriangle className="text-red-500/80 w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-amiri text-gold-light mb-4">
          اضطراب مؤقت في الوعي
        </h2>
        <p className="text-neutral-400 font-inter text-sm mb-8 leading-relaxed">
          حدث تداخل غير متوقع. لقد قمنا بتسجيل هذا الاضطراب. يرجى إعادة توجيه تركيزك والمحاولة مرة أخرى.
        </p>

        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 px-6 py-3 rounded-sm font-amiri text-lg transition-colors"
        >
          <RefreshCw size={18} />
          إعادة المحاولة
        </button>
      </motion.div>
    </div>
  );
}

