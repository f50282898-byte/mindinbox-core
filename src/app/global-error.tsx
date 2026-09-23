"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log this error to an error tracking service (e.g. Sentry)
    console.error("Global System Failure:", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-[#050505] text-[#D4AF37] font-sans antialiased min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-xl mx-auto border border-[#D4AF37]/20 p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] rounded-sm relative overflow-hidden">
          
          <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
            <div className="w-[400px] h-[400px] border border-[#D4AF37] rounded-full absolute" />
            <div className="w-[300px] h-[300px] border border-[#D4AF37] rotate-45 absolute" />
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-amiri mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              انقطاع في حبل الوعي
            </h1>
            <p className="text-neutral-400 font-inter text-lg leading-relaxed mb-10">
              النظام في حالة تأمل عميق. العقول العظيمة تحتاج إلى لحظات من السكون لتعود أقوى. سنعود قريباً جداً.
            </p>
            <button
              onClick={() => reset()}
              className="bg-transparent border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-sm font-inter text-sm tracking-widest uppercase transition-all hover:bg-[#D4AF37]/5"
            >
              حاول استعادة الاتصال
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

