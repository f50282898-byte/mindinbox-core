"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle } from "lucide-react";

interface InviteLinkProps {
  referralCode: string;
}

export default function InviteLink({ referralCode }: InviteLinkProps) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/auth?ref=${referralCode}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto my-12">
      <h3 className="text-2xl md:text-3xl font-amiri text-gold-light mb-4 text-center">
        ادعُ العقول النيّرة، وارتقِ معهم
      </h3>
      <p className="text-neutral-400 font-inter text-sm md:text-base text-center mb-8 leading-relaxed" dir="rtl">
        مشاركتك لهذا الرابط ليست مجرد دعوة، بل هي تأسيس لعصبة فكرية استثنائية. 
        كل عقل مستنير ينضم عبرك، يزيد من وهج مسارك في المجلس.
      </p>

      <button
        onClick={handleCopy}
        className="relative group w-full bg-obsidian-light/50 border border-gold/30 hover:border-gold/80 rounded-sm p-4 flex items-center justify-between transition-all duration-500 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="font-mono text-gold/80 text-sm md:text-base truncate mr-4 relative z-10" dir="ltr">
          {inviteUrl}
        </div>

        <div className="relative z-10 flex-shrink-0 ml-2">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="text-green-400 flex items-center justify-center bg-green-900/20 p-2 rounded-sm border border-green-400/30"
              >
                <CheckCircle size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                transition={{ duration: 0.3 }}
                className="text-gold flex items-center justify-center bg-gold/10 p-2 rounded-sm border border-gold/30 group-hover:bg-gold/20"
              >
                <Copy size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
      
      <AnimatePresence>
        {copied && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gold-light font-amiri text-sm mt-4 tracking-widest"
          >
            تم نقش الرابط في ذاكرة جهازك
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

