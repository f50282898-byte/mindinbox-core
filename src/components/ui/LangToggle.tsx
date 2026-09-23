"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LangToggle({ initialLocale }: { initialLocale: string }) {
  const [locale, setLocale] = useState<string>(initialLocale);
  const router = useRouter();

  useEffect(() => {
    // Read cookie directly on client mount to match server
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setLocale(match[2]);
    }
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    setLocale(newLocale);
    router.refresh(); // Refresh to trigger server-side re-render with new locale
  };

  return (
    <button 
      onClick={toggleLocale}
      className="fixed top-6 left-6 z-50 flex items-center justify-center gap-2 text-gold/60 hover:text-gold transition-colors font-cinzel text-sm"
    >
      <motion.span
        key={locale}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.3 }}
      >
        {locale === "ar" ? "EN" : "عربي"}
      </motion.span>
    </button>
  );
}

