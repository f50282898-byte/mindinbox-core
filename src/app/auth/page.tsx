"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  
  const router = useRouter();

  const handleUserDoc = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    } else {
      // Set trial end date to 14 days from now
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "user",
        subscriptionTier: "trial",
        trialStartDate: serverTimestamp(),
        trialEndDate: trialEndDate,
        dailyAIInteractions: 0,
        createdAt: serverTimestamp(),
      });

      // Trigger Luxurious Welcome Email
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: user.displayName })
      }).catch(err => console.error("Welcome email failed", err));
    }
    
    router.push("/dashboard/tracker");
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserDoc(result.user);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (isLogin) {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
      }
      await handleUserDoc(result.user);
    } catch (err: any) {
      setError(err.message || "حدث خطأ في المصادقة");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[150px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-obsidian-light/80 backdrop-blur-2xl border border-gold/10 p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 rotate-45 flex items-center justify-center relative animate-pulse">
            <div className="w-8 h-8 border border-gold/60 -rotate-12 absolute" />
          </div>
          <h1 className="text-3xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark mb-2">
            بوابة الدخول
          </h1>
          <p className="text-neutral-400 font-inter text-sm">
            {isLogin ? "قم بتسجيل الدخول لبدء رحلة الوعي واستكشاف قدرات عقلك." : "انضم إلى النخبة وابدأ رحلة الوعي."}
          </p>
        </div>

        {!useEmail ? (
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full relative group flex items-center justify-center gap-3 bg-white text-black py-4 rounded-md font-inter font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              {isLoading ? "جاري الاتصال..." : "المتابعة باستخدام جوجل"}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-inter">أو</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button 
              onClick={() => setUseEmail(true)}
              className="w-full relative group flex items-center justify-center gap-3 bg-obsidian border border-gold/30 text-gold-light py-4 rounded-md font-inter font-medium hover:bg-gold/5 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={16} /> المتابعة بالبريد الإلكتروني
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full bg-obsidian border border-gold/20 text-neutral-200 font-inter text-sm px-4 py-4 rounded-md focus:outline-none focus:border-gold/50 transition-colors text-right"
                required
                dir="ltr"
              />
            </div>
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full bg-obsidian border border-gold/20 text-neutral-200 font-inter text-sm px-4 py-4 rounded-md focus:outline-none focus:border-gold/50 transition-colors text-right"
                required
                dir="ltr"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-xs text-center font-inter">{error}</p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-obsidian font-bold font-amiri text-lg py-4 rounded-md shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50"
            >
              {isLoading ? "جاري التحقق..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>
            
            <div className="flex justify-between items-center mt-4">
              <button 
                type="button"
                onClick={() => setUseEmail(false)}
                className="text-neutral-500 hover:text-gold-light text-xs font-inter transition-colors"
              >
                العودة
              </button>
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold/60 hover:text-gold text-xs font-inter transition-colors"
              >
                {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-gold-light transition-colors text-sm font-amiri">
            <ArrowRight size={14} className="rotate-180" /> العودة للصفحة الرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

