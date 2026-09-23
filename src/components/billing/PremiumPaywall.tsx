"use client";

import { Crown } from "lucide-react";

interface PremiumPaywallProps {
  title?: string;
  description?: string;
}

export default function PremiumPaywall({ 
  title, 
  description 
}: PremiumPaywallProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 relative z-50 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold/20 to-transparent rounded-full flex items-center justify-center border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
        <Crown className="text-gold w-8 h-8" />
      </div>
      <h2 className="text-3xl md:text-5xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
        مرحباً بك في مجلس النخبة
      </h2>
      <p className="text-neutral-400 font-inter text-lg max-w-2xl mx-auto leading-relaxed">
        لقد تم منحك وصولاً مجانياً مدى الحياة إلى المجلس السري.
      </p>
    </div>
  );
}
