"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BarChart3, Users, Clock, Flame, Info, Menu } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

export default function CampaignArena() {
  const [voted, setVoted] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [results, setResults] = useState<{ 
    apple: number;
    android: number;
    applePercent: number; 
    androidPercent: number; 
    total: number;
  } | null>(null);

  // Fetch initial results on load
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/vote");
        if (res.ok) {
          const data = await res.json();
          setResults({
            ...data,
            total: data.apple + data.android
          });
        }
      } catch (err) {
        console.error("Failed to fetch initial results", err);
      }
    };
    
    fetchResults();

    // Check local storage for existing vote
    const savedVote = localStorage.getItem('voted_apple_vs_android');
    if (savedVote) {
      setVoted(savedVote);
    }

    // Subscribe to realtime vote inserts
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes' },
        () => {
          // Refetch results when a new vote happens anywhere
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleVote = async (side: string) => {
    if (voted || isVoting) return;
    setIsVoting(true);
    
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: side })
      });

      if (res.ok) {
        setVoted(side);
        localStorage.setItem('voted_apple_vs_android', side);
        triggerConfetti();
        // UI will update automatically via Supabase Realtime
      } else {
        const errorData = await res.json();
        if (errorData.error === 'Already voted') {
          alert("You have already voted from this device!");
          setVoted(side); // Keep them locked out
          localStorage.setItem('voted_apple_vs_android', side);
        }
      }
    } catch (err) {
      console.error("Failed to vote", err);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] font-sans text-gray-900 flex flex-col items-center pb-24">
      {/* Header */}
      <header className="w-full max-w-4xl px-4 py-6 flex items-center justify-between">
        <div className="bg-white px-6 py-2 rounded-full flex items-center justify-center shadow-sm border border-gray-200">
          <Image 
            src="/logo.png" 
            alt="iStore Digital Logo" 
            width={160} 
            height={40} 
            className="object-contain"
            unoptimized
          />
        </div>
        <button className="bg-white border border-gray-200 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <main className="w-full max-w-3xl px-4 flex flex-col items-center mt-8">
        <p className="text-lg text-gray-500 font-medium mb-12 text-center">
          Cast your vote and watch the battle unfold!
        </p>

        {/* Voting Cards Section */}
        <div className="relative w-full flex flex-row items-center justify-center gap-4 sm:gap-8 mb-16">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8 z-20 pointer-events-none">
            <h2 className="text-5xl font-black italic text-gray-800 drop-shadow-md">VS</h2>
          </div>

          <motion.button
            disabled={isVoting || !!voted}
            onClick={() => handleVote('apple')}
            whileHover={!voted ? { scale: 1.02, y: -4 } : {}}
            whileTap={!voted ? { scale: 0.98 } : {}}
            className={`flex-1 relative bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${!voted ? 'hover:shadow-xl hover:border-gray-300' : ''} ${voted === 'apple' ? 'ring-4 ring-black border-transparent shadow-xl scale-[1.02]' : voted ? 'opacity-40 grayscale' : 'shadow-sm'}`}
            style={{ aspectRatio: '3/4' }}
          >
            <div className="absolute inset-0 p-4">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white">
                <Image 
                  src="/iphone.jpg" 
                  alt="Apple iPhone" 
                  fill 
                  className="object-contain object-center" 
                  unoptimized
                />
              </div>
            </div>
          </motion.button>

          <motion.button
            disabled={isVoting || !!voted}
            onClick={() => handleVote('android')}
            whileHover={!voted ? { scale: 1.02, y: -4 } : {}}
            whileTap={!voted ? { scale: 0.98 } : {}}
            className={`flex-1 relative bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${!voted ? 'hover:shadow-xl hover:border-gray-300' : ''} ${voted === 'android' ? 'ring-4 ring-[#3DDC84] border-transparent shadow-xl scale-[1.02]' : voted ? 'opacity-40 grayscale' : 'shadow-sm'}`}
            style={{ aspectRatio: '3/4' }}
          >
            <div className="absolute inset-0 p-4">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white">
                <Image 
                  src="/samsang.jpg" 
                  alt="Android Samsung" 
                  fill 
                  className="object-contain object-center" 
                  unoptimized
                />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Results Bar */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-12 flex flex-col gap-6"
            >
              {/* Apple Progress Section */}
              <div className="flex items-center w-full gap-4">
                <div className="w-16 text-right text-gray-500 text-2xl font-light">
                  {results.applePercent}%
                </div>
                <div className="flex-1 relative h-16">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.max(results.applePercent, 15)}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-black rounded-r-2xl rounded-l-md flex items-center relative shadow-sm"
                  >
                    <div className="px-4 flex flex-col text-white whitespace-nowrap overflow-hidden">
                      <span className="font-medium text-lg leading-tight">Team Apple</span>
                    </div>
                    
                    {/* Icon Badge */}
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center shadow-sm text-lg z-10">
                      🍎
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Android Progress Section */}
              <div className="flex items-center w-full gap-4">
                <div className="w-16 text-right text-gray-500 text-2xl font-light">
                  {results.androidPercent}%
                </div>
                <div className="flex-1 relative h-16">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.max(results.androidPercent, 15)}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-[#3DDC84] rounded-r-2xl rounded-l-md flex items-center relative shadow-sm"
                  >
                    <div className="px-4 flex flex-col text-white whitespace-nowrap overflow-hidden">
                      <span className="font-medium text-lg leading-tight">Team Android</span>
                    </div>
                    
                    {/* Icon Badge */}
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-2 border-[#3DDC84] flex items-center justify-center shadow-sm text-lg z-10">
                      🤖
                    </div>
                  </motion.div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-gray-900"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold">Battle Stats & Insights</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-white p-2 rounded-xl mb-3 shadow-sm border border-gray-100">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xl font-bold mb-1">{results.total.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total Votes</span>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-white p-2 rounded-xl mb-3 shadow-sm border border-gray-100">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xl font-bold mb-1">Live</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Realtime Sync</span>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-white p-2 rounded-xl mb-3 shadow-sm border border-gray-100">
                    <Flame className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xl font-bold mb-1">Active</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Engagement Level</span>
                </div>
              </div>

              {/* Analysis Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-bold">Battle Analysis</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {results.applePercent > results.androidPercent 
                    ? `Apple is dominating this battle with a commanding lead of ${results.applePercent}%. While Android is fighting back, the clear preference among voters is evident. Can the underdog make a comeback?`
                    : results.androidPercent > results.applePercent 
                      ? `Android is dominating this battle with a commanding lead of ${results.androidPercent}%. While Apple is fighting back, the clear preference among voters is evident. Can the underdog make a comeback?`
                      : `It's a dead heat! Both Apple and Android are tied at 50%. Every single vote counts in this historic battle.`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
