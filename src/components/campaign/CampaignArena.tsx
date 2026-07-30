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
    <div className="w-full min-h-screen bg-white font-sans text-zinc-800 flex flex-col items-center pb-24">
      {/* Header */}
      <header className="w-full max-w-4xl px-4 py-6 flex items-center justify-between">
        <div className="bg-[#e9e9e9] px-6 py-3 rounded-full flex items-center justify-center">
          {/* Logo placeholder - User needs to add logo.png to public */}
          <div className="text-xl font-black text-[#698a67] tracking-tight flex items-baseline">
            ISTORE<span className="text-xs ml-1 text-zinc-500 font-medium">®</span>
            <span className="text-sm font-semibold text-zinc-600 ml-2">DIGITAL</span>
          </div>
        </div>
        <button className="bg-[#e9e9e9] w-12 h-12 rounded-full flex items-center justify-center hover:bg-zinc-300 transition">
          <Menu className="w-5 h-5 text-zinc-600" />
        </button>
      </header>

      <main className="w-full max-w-3xl px-4 flex flex-col items-center mt-8">
        <p className="text-lg text-zinc-500 font-medium mb-12 text-center">
          Cast your vote and watch the battle unfold!
        </p>

        {/* Voting Cards Section */}
        <div className="relative w-full flex flex-row items-center justify-center gap-4 sm:gap-8 mb-16">
          {/* VS Badge */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8 z-20 pointer-events-none">
            <h2 className="text-5xl font-black italic text-black">VS</h2>
          </div>

          {/* Apple Card */}
          <motion.button
            disabled={isVoting || !!voted}
            onClick={() => handleVote('apple')}
            whileHover={!voted ? { scale: 1.02, y: -4 } : {}}
            whileTap={!voted ? { scale: 0.98 } : {}}
            className={`flex-1 relative bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${!voted ? 'hover:shadow-xl hover:border-zinc-300' : ''} ${voted === 'apple' ? 'ring-4 ring-blue-500 border-transparent shadow-2xl scale-[1.02]' : voted ? 'opacity-50 grayscale' : 'shadow-md'}`}
            style={{ aspectRatio: '3/4' }}
          >
            <div className="absolute inset-0 p-4">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white">
                <Image 
                  src="/iphone.jpg" 
                  alt="Apple iPhone" 
                  fill 
                  className="object-cover object-center" 
                  unoptimized // Temporary for missing local image
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
            className={`flex-1 relative bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${!voted ? 'hover:shadow-xl hover:border-zinc-300' : ''} ${voted === 'android' ? 'ring-4 ring-[#6c5ce7] border-transparent shadow-2xl scale-[1.02]' : voted ? 'opacity-50 grayscale' : 'shadow-md'}`}
            style={{ aspectRatio: '3/4' }}
          >
            <div className="absolute inset-0 p-4">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white">
                <Image 
                  src="/samsang.jpg" 
                  alt="Android Samsung" 
                  fill 
                  className="object-cover object-center" 
                  unoptimized // Temporary for missing local image
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
              <div className="w-full bg-[#1a1c24] rounded-full p-2 relative h-16 shadow-xl flex items-center">
                {/* Background progress fills */}
                <div className="absolute inset-y-2 left-2 right-2 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${results.applePercent}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-[#00a8ff]"
                  />
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${results.androidPercent}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-[#6c5ce7]"
                  />
                </div>
                
                {/* Labels overlay */}
                <div className="relative z-10 w-full flex items-center justify-between px-6 text-white font-bold">
                  <span className="text-xl">{results.applePercent}%</span>
                  <div className="bg-[#2a2b4a] bg-opacity-80 backdrop-blur px-4 py-1.5 rounded-full text-sm font-black tracking-widest text-[#aeb4ff]">
                    {results.total} VOTES
                  </div>
                  <span className="text-xl">{results.androidPercent}%</span>
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
              className="w-full bg-[#242936] rounded-3xl p-6 shadow-2xl text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#a73b5f]/20 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-[#ff6b81]" />
                </div>
                <h3 className="text-xl font-bold">Battle Stats & Insights</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1f2430] p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-[#00a8ff]/10 p-2 rounded-xl mb-3">
                    <Users className="w-5 h-5 text-[#00a8ff]" />
                  </div>
                  <span className="text-xl font-bold mb-1">{results.total}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Total Votes Cast</span>
                </div>

                <div className="bg-[#1f2430] p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-[#a29bfe]/10 p-2 rounded-xl mb-3">
                    <Clock className="w-5 h-5 text-[#a29bfe]" />
                  </div>
                  <span className="text-xl font-bold mb-1">Today</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Battle Started</span>
                </div>

                <div className="bg-[#1f2430] p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-[#ffa502]/10 p-2 rounded-xl mb-3">
                    <Flame className="w-5 h-5 text-[#ffa502]" />
                  </div>
                  <span className="text-xl font-bold mb-1">Growing</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Engagement Level</span>
                </div>
              </div>

              {/* Analysis Box */}
              <div className="bg-[#3b2a33] border border-[#5c3743] rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#ff6b81]">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-bold">Battle Analysis</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
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
