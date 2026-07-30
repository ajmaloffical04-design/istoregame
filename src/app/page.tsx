import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white relative overflow-hidden">
      {/* Background Particles/Glow Mock */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apple/20 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-android/20 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center space-y-8 glass-panel p-12 rounded-3xl max-w-2xl w-full border border-white/10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Choose Your Side
        </h1>
        <p className="text-xl text-zinc-400">
          The ultimate showdown. Apple vs Android. Watch the world decide in real-time.
        </p>
        
        <Link 
          href="/campaign/apple-vs-android"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 ease-out bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Enter the Arena
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </main>
  );
}
