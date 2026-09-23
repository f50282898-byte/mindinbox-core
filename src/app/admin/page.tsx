"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function AdminCockpit() {
  const { user, userDoc, loading } = useUserStore();
  const router = useRouter();

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [stats, setStats] = useState({ freemium: 0, trial: 0, awakened: 0, inner_sanctum: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // Strict Admin Gatekeeper
  useEffect(() => {
    if (!loading) {
      if (!user || !userDoc || userDoc.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, userDoc, loading, router]);

  useEffect(() => {
    if (userDoc?.role === 'admin') {
      const fetchStats = async () => {
        try {
          const snapshot = await getDocs(collection(db, "users"));
          const counts = { freemium: 0, trial: 0, awakened: 0, inner_sanctum: 0 };
          snapshot.forEach((doc) => {
            const data = doc.data();
            const tier = data.subscriptionTier;
            if (tier && counts[tier as keyof typeof counts] !== undefined) {
              counts[tier as keyof typeof counts]++;
            }
          });
          setStats(counts);
        } catch (error) {
          console.error("Error fetching stats", error);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [userDoc]);

  if (loading || !userDoc || userDoc.role !== 'admin') {
    return null; // Return null to prevent any flashing of UI before redirect
  }

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    try {
      await addDoc(collection(db, "dailyQuotes"), {
        text: quote,
        author: author,
        createdAt: serverTimestamp(),
      });
      setQuote("");
      setAuthor("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto font-inter">
      <h1 className="text-3xl font-bold text-white mb-10">Admin Cockpit</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Quote Form */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-md">
          <h2 className="text-xl text-neutral-300 mb-6 font-semibold">Broadcast Daily Quote</h2>
          <form onSubmit={handleAddQuote} className="space-y-4">
            <div>
              <label className="block text-neutral-500 text-sm mb-2">Quote Text (Arabic)</label>
              <textarea 
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-sm p-3 text-white text-right outline-none focus:border-neutral-600 h-32 resize-none"
                dir="rtl"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-500 text-sm mb-2">Author</label>
              <input 
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-sm p-3 text-white text-right outline-none focus:border-neutral-600"
                dir="rtl"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black font-semibold py-3 rounded-sm hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Broadcasting..." : "Publish Quote"}
            </button>
            {success && <p className="text-green-500 text-sm mt-2">Quote published successfully!</p>}
          </form>
        </div>

        {/* User Stats */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-md">
          <h2 className="text-xl text-neutral-300 mb-6 font-semibold">User Demographics (Tiers)</h2>
          {loadingStats ? (
            <div className="text-neutral-500 text-sm">Scanning database...</div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-neutral-950 p-4 border border-neutral-800 rounded-sm">
                <span className="text-neutral-400">Freemium</span>
                <span className="text-2xl text-white font-mono">{stats.freemium}</span>
              </div>
              <div className="flex justify-between items-center bg-neutral-950 p-4 border border-neutral-800 rounded-sm">
                <span className="text-neutral-400">Trial</span>
                <span className="text-2xl text-white font-mono">{stats.trial}</span>
              </div>
              <div className="flex justify-between items-center bg-neutral-950 p-4 border border-gold/40 rounded-sm">
                <span className="text-gold-light">Awakened ($33/m)</span>
                <span className="text-2xl text-gold-light font-mono">{stats.awakened}</span>
              </div>
              <div className="flex justify-between items-center bg-gradient-to-r from-gold/10 to-transparent p-4 border border-gold rounded-sm">
                <span className="text-gold font-bold">Inner Sanctum ($100/m)</span>
                <span className="text-2xl text-gold font-mono font-bold">{stats.inner_sanctum}</span>
              </div>
              
              <div className="pt-6 border-t border-neutral-800 mt-6 flex justify-between items-center">
                <span className="text-neutral-300 font-bold">Total Active Users</span>
                <span className="text-2xl text-white font-mono">
                  {stats.freemium + stats.trial + stats.awakened + stats.inner_sanctum}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

