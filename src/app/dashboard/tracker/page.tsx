"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import { Send, Lock } from "lucide-react";
import Link from "next/link";
import { saveJournalEntry } from "@/lib/firebase/journalService";
import ExportPDFButton from "@/components/tracker/ExportPDFButton";
import { auth } from "@/lib/firebase/config";

export default function TrackerPage() {
  const { user, userDoc, loading } = useUserStore();
  const router = useRouter();
  const [entry, setEntry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [sessionEntries, setSessionEntries] = useState<{ text: string; aiAnalysis: string; date: string }[]>([]);

  // Auth protection is handled by Gatekeeper layout, so we just wait for loading
  if (loading || !userDoc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="w-16 h-16 border border-gold/30 rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border border-gold/60 -rotate-12 absolute" />
        </div>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!entry.trim() || !user) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userText: entry })
      });

      if (!res.ok) throw new Error("Failed to get analysis");
      
      const data = await res.json();
      
      // Save to Firestore
      await saveJournalEntry(user.uid, entry, data.analysis);
      
      setAnalysisResult(data.analysis);
      setSessionEntries(prev => [...prev, { text: entry, aiAnalysis: data.analysis, date: new Date().toLocaleDateString('ar-EG') }]);
      setEntry("");
      
    } catch (error) {
      console.error(error);
      setAnalysisResult("عذراً، الأوراكل يحتاج إلى لحظة صمت. حاول مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <header className="mb-12 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark mb-4">
          مرآة العقل
        </h1>
        <p className="text-neutral-400 font-inter max-w-lg mx-auto">
          اكتب أفكارك بحرية تامة. الذكاء الاصطناعي سيقوم بتحليل أعماقك وربطها بأعظم الفلسفات البشرية.
        </p>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Journaling Area */}
        <div className="md:col-span-7 bg-obsidian-light/50 border border-gold/10 rounded-sm p-6 backdrop-blur-sm transition-all duration-500">
          <div className="flex justify-between items-center mb-6 border-b border-gold/10 pb-4">
            <h2 className="font-amiri text-2xl text-gold-light">تدوين اليوم</h2>
            <span className="text-xs font-inter text-gold/40 tracking-widest">{new Date().toLocaleDateString('ar-EG')}</span>
          </div>
          
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="بماذا يفكر عقلك الآن؟..."
            className="w-full h-64 bg-transparent border-none focus:ring-0 text-neutral-200 font-inter leading-relaxed resize-none placeholder:text-neutral-600 text-right outline-none"
            dir="rtl"
          />
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gold/10">
            <ExportPDFButton entries={sessionEntries} />

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !entry.trim()}
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-obsidian px-6 py-2 rounded-sm font-amiri text-lg flex items-center gap-3 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              {isAnalyzing ? (
                <span className="animate-pulse">جاري الاستنطاق...</span>
              ) : (
                <>تأمل أفكاري <Send size={16} className="rotate-180" /></>
              )}
            </button>
          </div>
        </div>

        {/* AI Analysis Area */}
        <div className="md:col-span-5 bg-gradient-to-b from-obsidian-light/80 to-obsidian border border-gold/20 rounded-sm p-6 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glowing/10 blur-[50px] pointer-events-none" />
          
          <h2 className="font-amiri text-2xl text-gold mb-6 border-b border-gold/10 pb-4">حكمة الأوراكل</h2>
          
          <div className="min-h-[200px] flex items-center justify-center">
            {isAnalyzing ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto border-2 border-t-gold border-r-gold border-b-transparent border-l-transparent rounded-full animate-spin" />
                <p className="text-gold/60 font-inter text-sm animate-pulse">يتم استدعاء الحكمة...</p>
              </div>
            ) : analysisResult ? (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-neutral-300 font-inter leading-loose text-lg text-right"
                dir="rtl"
              >
                {analysisResult}
              </motion.p>
            ) : (
              <p className="text-neutral-600 font-inter text-center italic">
                اكتب أفكارك أولاً ليتحدث الأوراكل...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
