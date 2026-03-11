"use client";

import { useState } from "react";
import { Sparkles, Bot, Search, ArrowRight, Zap, Target, Briefcase } from "lucide-react";

const EXAMPLE_PROMPTS = [
  { text: "Bakıda uzaqdan Senior React rolları", icon: <Briefcase size={14} /> },
  { text: "Yeni başlayanlar üçün dizayn işləri", icon: <Sparkles size={14} /> },
  { text: "Startaplarda Product Manager vakansiyaları", icon: <Zap size={14} /> },
  { text: "Həftəlik 4000+ AZN maaşlı işlər", icon: <Target size={14} /> },
];

export default function AISearchPage() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center px-4 sm:px-6 py-12 sm:py-20 bg-background overflow-x-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[80px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[25%] h-[25%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none transform-gpu" />

      <div className="max-w-2xl w-full space-y-10 sm:space-y-14 relative z-10">

        {/* Hero */}
        <div className="flex flex-col items-center text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 dark:bg-slate-800 border border-white/5 text-white flex items-center justify-center shadow-2xl">
              <Bot size={32} className="sm:w-[38px] sm:h-[38px]" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-background shadow-lg">
              <Sparkles size={11} className="text-white" />
            </div>
          </div>

          <div className="space-y-3 px-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Gələcəyin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                İş Axtarışı
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Süni intellekt sizin üçün minlərlə vakansiyanı saniyələr içində analiz edərək ən uyğun olanları seçir.
            </p>
          </div>
        </div>

        {/* Search Console with animated border */}
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          
          {/* Animated border wrapper */}
          <div className="relative group max-w-[480px] mx-auto w-full p-[2px] rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 ai-border-glow" />

            {/* Inner card */}
            <div className="relative rounded-[calc(1rem-2px)] bg-card dark:bg-card z-10 p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-[15px] font-semibold text-foreground placeholder:text-muted-foreground/50 border-none focus:ring-0 focus:outline-none"
                  placeholder="Nə axtarırsınız? (məs. Uzaqdan işləyən Senior rollar...)"
                />
              </div>

              <div className="h-px w-full bg-border mb-4" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  <Sparkles size={12} />
                  Pro V2
                </div>
                <button
                  disabled={!prompt.trim()}
                  className="flex items-center justify-center gap-2 px-6 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold transition-all hover:opacity-80 active:scale-95 disabled:opacity-30 shrink-0"
                >
                  Analiz Et <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Example Prompts Pills */}
          <div className="space-y-3 px-1 sm:px-0 max-w-[480px] mx-auto w-full">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 text-center">
              Nümunə suallar:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex.text)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 transition-all active:scale-95"
                >
                  {ex.icon}
                  {ex.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="relative animate-in fade-in duration-1000 delay-500">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 overflow-hidden hover:border-border/80 transition-colors">
            <div className="absolute top-0 right-0 p-6 text-muted-foreground/5">
              <Bot size={100} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                <Zap size={24} />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-black text-foreground">Ağıllı Uyğunlaşdırma</h4>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-violet-500 text-white px-2 py-0.5 rounded-md">
                    Yaxında
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
