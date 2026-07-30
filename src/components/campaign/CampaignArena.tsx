"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BarChart3, Users, Clock, Flame, Info, Menu } from "lucide-react";

export default function CampaignArena() {
  const [voted, setVoted] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [results, setResults] = useState<{ applePercent: number; androidPercent: number; total: number } | null>({ applePercent: 50, androidPercent: 50, total: 0 });

  const handleVote = async (side: string) => {
    if (voted || isVoting) return;
    setIsVoting(true);
    
    // Mock API call
    setTimeout(() => {
      setVoted(side);
      setResults({
        applePercent: side === 'apple' ? 100 : 0,
        androidPercent: side === 'android' ? 100 : 0,
        total: 1,
      });
      setIsVoting(false);
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-sans text-white flex flex-col items-center pb-24">
      {/* Header */}
      <header className="w-full max-w-4xl px-4 py-6 flex items-center justify-between">
        <div className="bg-white px-6 py-2 rounded-full flex items-center justify-center shadow-lg">
          <Image 
            src="/logo.png" 
            alt="iStore Digital Logo" 
            width={160} 
            height={40} 
            className="object-contain"
            unoptimized
          />
        </div>
        <button className="bg-white/10 backdrop-blur-sm border border-white/10 w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition shadow-lg">
          <Menu className="w-5 h-5 text-white" />
        </button>
      </header>

      <main className="w-full max-w-3xl px-4 flex flex-col items-center mt-8">
        <p className="text-lg text-gray-300 font-medium mb-12 text-center">
          Cast your vote and watch the battle unfold!
        </p>

        {/* Voting Cards Section */}
        <div className="relative w-full flex flex-row items-center justify-center gap-4 sm:gap-8 mb-16">
          {/* VS Badge */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8 z-20 pointer-events-none">
            <h2 className="text-5xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">VS</h2>
          </div>

          {/* Apple Card */}
          <motion.button
            disabled={isVoting || !!voted}
            onClick={() => handleVote('apple')}
            whileHover={!voted ? { scale: 1.02, y: -4 } : {}}
            whileTap={!voted ? { scale: 0.98 } : {}}
            className={`flex-1 relative bg-white border border-white/20 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${!voted ? 'hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/50' : ''} ${voted === 'apple' ? 'ring-4 ring-[#00a8ff] border-transparent shadow-[0_0_40px_rgba(0,168,255,0.3)] scale-[1.02]' : voted ? 'opacity-40 grayscale' : 'shadow-xl'}`}
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

          {/* Android Card */}
          <motion.button
            disabled={isVoting || !!voted}
            onClick={() => handleVote('android')}
            whileHover={!voted ? { scale: 1.02, y: -4 } : {}}
            whileTap={!voted ? { scale: 0.98 } : {}}
            className={`flex-1 relative bg-white border border-white/20 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${!voted ? 'hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/50' : ''} ${voted === 'android' ? 'ring-4 ring-[#6c5ce7] border-transparent shadow-[0_0_40px_rgba(108,92,231,0.3)] scale-[1.02]' : voted ? 'opacity-40 grayscale' : 'shadow-xl'}`}
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
          {voted && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-12"
            >
              <div className="w-full bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-full p-2 relative h-16 shadow-2xl flex items-center">
                {/* Background progress fills */}
                <div className="absolute inset-y-2 left-2 right-2 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${results.applePercent}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  />
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${results.androidPercent}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                  />
                </div>
                
                {/* Labels overlay */}
                <div className="relative z-10 w-full flex items-center justify-between px-6 text-white font-bold">
                  <span className="text-xl drop-shadow-md">{results.applePercent}%</span>
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full text-sm font-black tracking-widest text-white shadow-lg">
                    {results.total} VOTES
                  </div>
                  <span className="text-xl drop-shadow-md">{results.androidPercent}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <AnimatePresence>
          {voted && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Battle Stats & Insights</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/80 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center shadow-inner">
                  <div className="bg-blue-500/10 p-2 rounded-xl mb-3">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xl font-bold mb-1">{results.total}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total Votes Cast</span>
                </div>

                <div className="bg-gray-800/80 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center shadow-inner">
                  <div className="bg-purple-500/10 p-2 rounded-xl mb-3">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xl font-bold mb-1">Today</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Battle Started</span>
                </div>

                <div className="bg-gray-800/80 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center shadow-inner">
                  <div className="bg-orange-500/10 p-2 rounded-xl mb-3">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-xl font-bold mb-1">Growing</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Engagement Level</span>
                </div>
              </div>

              {/* Analysis Box */}
              <div className="bg-red-950/30 border border-red-500/20 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-red-400">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-bold">Battle Analysis</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {results.applePercent > results.androidPercent 
                    ? `Apple is dominating this battle with a commanding lead of ${results.applePercent}%. While Android is fighting back, the clear preference among voters is evident. Can the underdog make a comeback?`
                    : `Android is dominating this battle with a commanding lead of ${results.androidPercent}%. While Apple is fighting back, the clear preference among voters is evident. Can the underdog make a comeback?`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
