"use client";

import { useState } from "react";
import { Sparkles, Bot, Search, ArrowRight, Zap, Target, Briefcase } from "lucide-react";
import { cn } from "@/utils/cn";

const EXAMPLE_PROMPTS = [
  { text: "Bakıda uzaqdan Senior React rolları", icon: <Briefcase size={14} /> },
  { text: "Yeni başlayanlar üçün dizayn işləri", icon: <Sparkles size={14} /> },
  { text: "Startaplarda Product Manager vakansiyaları", icon: <Zap size={14} /> },
  { text: "Həftəlik 4000+ AZN maaşlı işlər", icon: <Target size={14} /> },
];

export default function AISearchPage() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center px-4 sm:px-6 py-12 sm:py-20 bg-background overflow-x-hidden font-inter">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[80px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none transform-gpu" />

      <div className="max-w-3xl w-full space-y-12 sm:space-y-16 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bot size={42} className="relative z-10 sm:w-[48px] sm:h-[48px]" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-primary flex items-center justify-center border-4 border-background shadow-lg">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 px-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
              Gələcəyin <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-purple-600 animate-gradient">İş Axtarışı</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Süni intellekt sizin üçün minlərlə vakansiyanı saniyələr içində analiz edərək ən uyğun olanları seçir.
            </p>
          </div>
        </div>

        {/* AI Console / Search Area */}
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="relative group p-[2px] rounded-[2.5rem] shadow-2xl overflow-hidden bg-transparent max-w-2xl mx-auto">
            
            {/* Rotating colored border animation */}
            <div className="absolute inset-[-200%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#8b5cf6_25%,#ec4899_50%,#8b5cf6_75%,#3b82f6_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Inner Content Container */}
            <div className="relative rounded-[calc(2.5rem-2px)] bg-white dark:bg-[#11131A] p-5 sm:p-6 flex flex-col z-10">
              
              {/* Search Icon & Text Area */}
              <div className="flex gap-4 sm:gap-5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Search size={20} className="text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-12 bg-transparent text-lg font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none focus:ring-0 focus:outline-none mb-2"
                  placeholder="Nə axtarırsınız? (məs. Uzaqdan işləyən dizayn rolları...)"
                />
              </div>

              {/* Separator */}
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50 mb-5" />

              {/* Footer: Model info & Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                  <Sparkles size={14} className="text-slate-400 dark:text-slate-500" />
                  AI Modeli: Pro V2
                </div>
                <button
                  disabled={!prompt.trim()}
                  className="flex items-center justify-center gap-2 px-8 h-12 w-full sm:w-auto hover:w-auto rounded-2xl bg-slate-500 hover:bg-slate-600 dark:bg-white/10 dark:hover:bg-white/20 text-white text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  Analiz Et <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Example Prompts - Pills */}
          <div className="space-y-4 px-2 sm:px-0">
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center sm:text-left">
              Məsələn belə soruşun:
            </h4>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex.text)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-muted/30 border border-border/50 text-xs sm:text-sm font-bold text-foreground hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all active:scale-95"
                >
                  {ex.icon}
                  {ex.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="relative group animate-in fade-in duration-1000 delay-500">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-indigo-500/5 rounded-[2.5rem] blur-lg transform-gpu" />
          <div className="relative rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-sm p-8 sm:p-10 transition-all hover:border-primary/30 overflow-hidden">
             {/* Decorative pattern */}
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Bot size={120} />
             </div>

             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Zap size={28} className="fill-primary/20" />
                </div>
                <div className="space-y-2 flex-1">
                   <div className="flex items-center gap-3 mb-1">
                     <h4 className="text-xl font-black text-foreground">Ağıllı Uyğunlaşdırma</h4>
                     <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-2 py-0.5 rounded-md">
                       Yaxında
                     </span>
                   </div>
                   <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                     CV-nizi analiz edərək sizə fərdi olaraq ən çox uyğun gələn işləri tapmaq, maaş proqnozları və uğur şansınızı hesablamaq üzərində işləyirik.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
