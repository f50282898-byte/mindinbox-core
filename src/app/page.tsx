import Link from "next/link";
import { OracleBanner } from "@/components/OracleBanner";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <OracleBanner />
      
      {/* Dynamic Navbar / Logo Header equivalent */}
      <header className="absolute top-16 w-full flex justify-center z-50">
        <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center relative shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-gold/20">
          <img src="/apple-touch-icon.png" alt="Logo" className="w-full h-full object-cover scale-[1.85]" />
        </div>
      </header>
      
      <div className="flex-1 max-w-4xl mx-auto px-6 text-center mt-32 flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-12 border border-gold/40 rotate-45 flex items-center justify-center relative animate-pulse">
          <div className="w-16 h-16 border border-gold/20 -rotate-12 absolute" />
          <div className="w-8 h-8 border border-gold/60 rotate-45 absolute" />
        </div>

        <h1 className="text-5xl md:text-7xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-light to-gold-dark mb-6 leading-tight drop-shadow-lg">
          رحلة الوعي تبدأ هنا
        </h1>
        <p className="font-inter text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 tracking-wide font-light">
          ليس مجرد تطبيق، بل هو انعكاس لعمق تفكيرك. ملاذ آمن للنخبة، حيث يتلاقى الذكاء الاصطناعي مع أعظم الفلسفات البشرية.
        </p>
        
        <Link 
          href="/auth" 
          className="group relative inline-flex items-center justify-center px-10 py-4 font-amiri text-lg font-bold tracking-widest text-obsidian bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] rounded-sm"
        >
          <span className="relative z-10">ابدأ رحلة الوعي</span>
          <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        </Link>
      </div>
    </div>
  );
}

