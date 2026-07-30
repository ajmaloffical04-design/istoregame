"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [results, setResults] = useState<{ apple: number; android: number; applePercent: number; androidPercent: number } | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/vote");
        const data = await res.json();
        setResults(data);
      } catch {
        // Handle error silently
      }

    fetchResults();

    // Poll every 3 seconds for live updates
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-hidden flex flex-col items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-apple/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-android/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-4xl z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-center">
          Global Leaderboard
        </h1>
        <p className="text-xl text-zinc-400 text-center mb-16">
          Live statistics from the Apple vs Android campaign.
        </p>

        {results ? (
          <div className="flex flex-col gap-8 w-full">
            {/* Apple Row */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full p-8 rounded-3xl glass-panel flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-white/10 to-transparent" style={{ width: `${results.applePercent}%` }} />
              <div className="flex items-center gap-6 z-10">
                <div className="w-20 h-20 bg-white text-black rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  🍎
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Team Apple</h2>
                  <p className="text-zinc-400">Current Leader</p>
                </div>
              </div>
              <div className="text-right z-10">
                <p className="text-5xl font-bold">{results.apple.toLocaleString()}</p>
                <p className="text-zinc-400 uppercase tracking-widest text-sm mt-1">Total Votes</p>
              </div>
            </motion.div>

            {/* Android Row */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full p-8 rounded-3xl glass-panel flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#3DDC84]/10 to-transparent" style={{ width: `${results.androidPercent}%` }} />
              <div className="flex items-center gap-6 z-10">
                <div className="w-20 h-20 bg-[#3DDC84] text-black rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(61,220,132,0.3)]">
                  🤖
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Team Android</h2>
                  <p className="text-zinc-400">Challenger</p>
                </div>
              </div>
              <div className="text-right z-10">
                <p className="text-5xl font-bold text-[#3DDC84]">{results.android.toLocaleString()}</p>
                <p className="text-zinc-400 uppercase tracking-widest text-sm mt-1">Total Votes</p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    </main>
  );
}
