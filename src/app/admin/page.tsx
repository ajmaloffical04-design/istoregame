"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, MousePointer2, Activity, Settings, Plus, RotateCcw, Ban, Download } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Admin</h1>
          <p className="text-zinc-500 text-sm">Campaign Manager</p>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "overview" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <Activity className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("campaigns")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "campaigns" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <Plus className="w-5 h-5" /> Campaigns
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "settings" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>
        
        <div className="mt-auto pt-8 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 glass-panel rounded-3xl p-8 md:p-12 border border-white/10">
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-8">Active Campaign: Apple vs Android</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center gap-3 text-zinc-400 mb-2">
                  <Users className="w-5 h-5" /> Total Visitors
                </div>
                <p className="text-4xl font-bold">142,893</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center gap-3 text-zinc-400 mb-2">
                  <MousePointer2 className="w-5 h-5" /> Total Votes
                </div>
                <p className="text-4xl font-bold">29,999</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center gap-3 text-zinc-400 mb-2">
                  <Activity className="w-5 h-5" /> Conversion Rate
                </div>
                <p className="text-4xl font-bold text-[#3DDC84]">21.0%</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 font-semibold rounded-full hover:bg-red-500/20 transition-colors">
                <Ban className="w-4 h-4" /> End Campaign
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-yellow-500/10 text-yellow-500 font-semibold rounded-full hover:bg-yellow-500/20 transition-colors">
                <RotateCcw className="w-4 h-4" /> Reset Votes
              </button>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">All Campaigns</h2>
              <button className="px-6 py-2 bg-[#3DDC84] text-black font-semibold rounded-full hover:bg-[#32b56c] transition-colors">
                + New Campaign
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Active Campaign */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div>
                  <h3 className="text-xl font-bold">Apple vs Android</h3>
                  <p className="text-zinc-400">Created: 2 days ago</p>
                </div>
                <span className="px-3 py-1 bg-[#3DDC84]/20 text-[#3DDC84] rounded-full text-sm font-semibold">Active</span>
              </div>
              
              {/* Future Campaigns (Phase 20 expansion) */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl opacity-50">
                <div>
                  <h3 className="text-xl font-bold">Messi vs Ronaldo</h3>
                  <p className="text-zinc-400">Draft</p>
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-semibold">Draft</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl opacity-50">
                <div>
                  <h3 className="text-xl font-bold">Marvel vs DC</h3>
                  <p className="text-zinc-400">Draft</p>
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-semibold">Draft</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-8">Platform Settings</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="font-bold mb-4">Anti-Cheat strictness</h3>
                <select className="w-full bg-black border border-white/20 rounded-xl p-3 text-white">
                  <option>Low (Fingerprint only)</option>
                  <option selected>Medium (Fingerprint + IP Hash)</option>
                  <option>High (Requires Captcha)</option>
                </select>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="font-bold mb-4">Theme Settings</h3>
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-sm font-semibold">
                  Manage Global Assets
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
