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
    <div className="w-full min-h-screen bg-[#F9FAFC] font-sans text-[#0F1E36] flex flex-col items-center pb-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-green-200 opacity-60"></div>
      <div className="absolute top-40 right-20 w-4 h-4 rounded-full bg-purple-200 opacity-60"></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 rounded-full bg-indigo-100 opacity-80"></div>
      <div className="absolute top-1/3 left-1/4 w-3 h-3 rotate-45 bg-purple-300 opacity-40"></div>
      <div className="absolute top-1/4 right-1/3 w-3 h-3 rotate-12 bg-green-300 opacity-40"></div>

      {/* Header */}
      <header className="w-full max-w-5xl px-6 py-6 flex items-center justify-between z-20">
        <div className="bg-white px-6 py-2.5 rounded-full flex items-center justify-center shadow-sm border border-gray-100/80">
          <Image 
            src="/logo.png" 
            alt="iStore Digital Logo" 
            width={150} 
            height={35} 
            className="object-contain"
            unoptimized
          />
        </div>
        <button className="bg-white border border-gray-100 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <main className="w-full max-w-4xl px-6 flex flex-col items-center mt-6 z-20">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#E8F8F0] px-4 py-1.5 rounded-full mb-6 border border-emerald-100 shadow-sm">
          <span className="text-emerald-700 text-xs font-bold tracking-wide flex items-center gap-1">
            ⚡ THE ULTIMATE BATTLE
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F1E36] tracking-tight mb-2 text-center">
          Cast your vote and watch the battle unfold!
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-medium mb-12 text-center">
          Your vote decides the winner 🏆
        </p>

        {/* Voting Arena */}
        <div className="relative w-full flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 mb-12">
          
          {/* Lightning Graphic behind VS */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex flex-col items-center gap-2 opacity-30">
            <svg width="40" height="120" viewBox="0 0 40 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-400">
              <path d="M20 5L5 55H20L15 115L35 65H20L25 5H20Z" fill="currentColor" />
            </svg>
          </div>

          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex items-center justify-center w-16 h-16 bg-[#1A253C] rounded-full border-4 border-white shadow-lg">
            <span className="text-white font-black italic text-lg tracking-wider">VS</span>
          </div>

          {/* Card: Apple */}
          <motion.div
            onClick={() => handleVote('apple')}
            whileHover={!voted ? { y: -6, transition: { duration: 0.2 } } : {}}
            className={`flex-1 bg-white/60 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 flex flex-col items-center relative transition-all duration-300 cursor-pointer select-none ${
              voted === 'apple' 
                ? 'border-2 border-[#737373] shadow-[0_12px_30px_rgba(115,115,115,0.12)]' 
                : voted 
                  ? 'opacity-60' 
                  : 'hover:shadow-xl'
            }`}
          >
            {/* Top Badge */}
            <div className="bg-[#737373] text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-6 flex items-center gap-1.5">
              <Image 
                src="/ios.png" 
                alt="iOS Logo" 
                width={12} 
                height={12} 
                className="object-contain rounded-full" 
                unoptimized
              />
              TEAM APPLE
            </div>

            {/* Checkmark Badge if voted */}
            {voted === 'apple' && (
              <div className="absolute top-4 right-4 w-7 h-7 bg-[#737373] rounded-full flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Image Container */}
            <div className="w-full relative flex items-center justify-center mb-6" style={{ height: '240px' }}>
              <div className="relative w-4/5 h-full">
                <Image 
                  src="/iphone.jpg" 
                  alt="Apple iPhone" 
                  fill 
                  className="object-contain" 
                  unoptimized
                />
              </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-[#0F1E36] mb-1">iPhone</h3>
            <p className="text-xs text-gray-400 mb-6 text-center">Innovation. Performance. Style.</p>

            {/* Bottom Row */}
            <div className="w-full flex items-center justify-between mt-auto border-t border-gray-50 pt-4">
              {/* Avatars */}
              <div className="flex -space-x-2.5">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80" alt="voter" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80" alt="voter" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&fit=crop&q=80" alt="voter" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop&q=80" alt="voter" />
              </div>
              {/* Votes Pill */}
              <div className="bg-gray-100 text-gray-700 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                {results ? `${results.apple.toLocaleString()} votes` : '...'}
              </div>
            </div>
          </motion.div>

          {/* Mobile VS Badge */}
          <div className="flex md:hidden items-center justify-center my-2">
            <div className="w-12 h-12 bg-[#1A253C] rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-white font-black italic text-sm">VS</span>
            </div>
          </div>

          {/* Card: Android */}
          <motion.div
            onClick={() => handleVote('android')}
            whileHover={!voted ? { y: -6, transition: { duration: 0.2 } } : {}}
            className={`flex-1 bg-white/60 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 flex flex-col items-center relative transition-all duration-300 cursor-pointer select-none ${
              voted === 'android' 
                ? 'border-2 border-black shadow-[0_12px_30px_rgba(0,0,0,0.12)]' 
                : voted 
                  ? 'opacity-60' 
                  : 'hover:shadow-xl'
            }`}
          >
            {/* Top Badge */}
            <div className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-6 flex items-center gap-1.5">
              <Image 
                src="/andriod.png" 
                alt="Android Logo" 
                width={12} 
                height={12} 
                className="object-contain rounded-full" 
                unoptimized
              />
              TEAM ANDROID
            </div>

            {/* Checkmark Badge if voted */}
            {voted === 'android' && (
              <div className="absolute top-4 right-4 w-7 h-7 bg-black rounded-full flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Image Container */}
            <div className="w-full relative flex items-center justify-center mb-6" style={{ height: '240px' }}>
              <div className="relative w-4/5 h-full">
                <Image 
                  src="/samsang.jpg" 
                  alt="Android Samsung" 
                  fill 
                  className="object-contain" 
                  unoptimized
                />
              </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-[#0F1E36] mb-1">Android</h3>
            <p className="text-xs text-gray-400 mb-6 text-center">Freedom. Choice. Customization.</p>

            {/* Bottom Row */}
            <div className="w-full flex items-center justify-between mt-auto border-t border-gray-50 pt-4">
              {/* Avatars */}
              <div className="flex -space-x-2.5">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&q=80" alt="voter" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&fit=crop&q=80" alt="voter" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&fit=crop&q=80" alt="voter" />
              </div>
              {/* Votes Pill */}
              <div className="bg-gray-100 text-black font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                {results ? `${results.android.toLocaleString()} votes` : '...'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Bar */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-8 flex flex-col gap-5"
            >
              {/* Apple Progress Bar */}
              <div className="flex items-center w-full gap-5">
                <div className="w-20 text-left text-[#737373] text-3xl font-extrabold tracking-tight">
                  {results.applePercent}%
                </div>
                <div className="flex-1 relative h-16 bg-[#EFF1F5] rounded-full overflow-hidden border border-gray-100 shadow-inner flex items-center">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.max(results.applePercent, 12)}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-[#737373] rounded-full flex items-center relative pl-6 shadow-md"
                  >
                    <div className="flex flex-col text-white whitespace-nowrap overflow-hidden">
                      <span className="font-bold text-sm leading-tight">Team Apple</span>
                      <span className="text-[10px] text-gray-200 font-medium">{results.apple.toLocaleString()} votes</span>
                    </div>
                  </motion.div>
                  {/* Absolute Badge on far right of track */}
                  <div className="absolute right-3 w-10 h-10 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center shadow-md z-10 overflow-hidden p-1.5">
                    <Image src="/ios.png" alt="iOS Logo" width={28} height={28} className="object-contain" unoptimized />
                  </div>
                </div>
              </div>

              {/* Android Progress Bar */}
              <div className="flex items-center w-full gap-5">
                <div className="w-20 text-left text-black text-3xl font-extrabold tracking-tight">
                  {results.androidPercent}%
                </div>
                <div className="flex-1 relative h-16 bg-[#EFF1F5] rounded-full overflow-hidden border border-gray-100 shadow-inner flex items-center">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.max(results.androidPercent, 12)}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-black rounded-full flex items-center relative pl-6 shadow-md"
                  >
                    <div className="flex flex-col text-white whitespace-nowrap overflow-hidden">
                      <span className="font-bold text-sm leading-tight">Team Android</span>
                      <span className="text-[10px] text-gray-300 font-medium">{results.android.toLocaleString()} votes</span>
                    </div>
                  </motion.div>
                  {/* Absolute Badge on far right of track */}
                  <div className="absolute right-3 w-10 h-10 bg-white rounded-full border-2 border-gray-800 flex items-center justify-center shadow-md z-10 overflow-hidden p-1.5">
                    <Image src="/andriod.png" alt="Android Logo" width={28} height={28} className="object-contain" unoptimized />
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Total Votes Pill */}
        {results && (
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-100 px-4 py-2 rounded-full mb-8 shadow-sm text-xs font-semibold text-gray-500">
            <span>👥 {results.total.toLocaleString()} total votes cast</span>
          </div>
        )}

        {/* Stats Section */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-lg text-gray-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-[#0F1E36]">Battle Stats & Insights</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-white p-2 rounded-xl mb-3 shadow-sm border border-gray-100">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xl font-bold mb-1 text-[#0F1E36]">{results.total.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Votes</span>
                </div>

                <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-white p-2 rounded-xl mb-3 shadow-sm border border-gray-100">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xl font-bold mb-1 text-[#0F1E36]">Live</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Realtime Sync</span>
                </div>

                <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-white p-2 rounded-xl mb-3 shadow-sm border border-gray-100">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xl font-bold mb-1 text-[#0F1E36]">Active</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Engagement</span>
                </div>
              </div>

              {/* Analysis Box */}
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Info className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-bold text-[#0F1E36]">Battle Analysis</span>
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

        {/* Campaign Notes Scroll Section */}
        <Skiper41 />

      </main>
    </div>
  );
}

// Progressive Blur Overlay Component
type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

const ProgressiveBlur = ({
  className = "",
  backgroundColor = "#F9FAFC",
  position = "top",
  height = "100px",
  blurAmount = "4px",
}: ProgressiveBlurProps) => {
  const isTop = position === "top";

  return (
    <div
      className={`pointer-events-none absolute left-0 w-full select-none z-10 ${className}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
          : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
};

// Campaign Scrollable Widget
const Skiper41 = () => {
  return (
    <div className="relative flex h-[350px] w-full flex-col items-center justify-center bg-transparent text-gray-400 overflow-hidden mt-8">
      <ProgressiveBlur position="top" backgroundColor="#F9FAFC" />
      <ProgressiveBlur position="bottom" backgroundColor="#F9FAFC" />

      <div className="flex h-full w-full flex-col items-center overflow-y-scroll scrollbar-none py-10 px-6">
        <div className="grid content-start justify-items-center gap-6 text-center text-gray-800 mb-6">
          <span className="relative max-w-[15ch] text-[10px] uppercase font-bold tracking-wider leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-12 after:w-px after:bg-gradient-to-b after:from-gray-300 after:to-transparent after:content-[''] after:mt-2">
            Scroll down to see details
          </span>
        </div>

        <div className="w-full max-w-lg space-y-8 px-4 text-justify mt-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="text-xs leading-relaxed text-gray-500">
              <strong className="text-[#0F1E36] block mb-1 text-sm font-bold">Campaign Note</strong>
              This campaign concept has been exclusively designed for <strong className="text-[#0F1E36] font-bold">iStore Digital</strong> to enhance audience engagement through an immersive voting campaign. The experience enables users to vote, monitor live results, and share the campaign, encouraging greater participation, organic reach, and stronger brand engagement.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ProgressiveBlur, Skiper41 };

