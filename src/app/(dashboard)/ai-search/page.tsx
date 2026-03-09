"use client";

import { Sparkles, Bot, Search } from "lucide-react";

export default function AISearchPage() {
  return (
    <div className="h-full min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-4 sm:px-6 py-10 bg-background text-foreground">
      <div className="flex flex-col items-center gap-8 max-w-xl w-full text-center">
        {/* Icon & Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl shadow-slate-900/20 dark:shadow-white/10 transition-all rotate-12 hover:rotate-0 duration-500">
            <Sparkles size={36} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              AI İş Axtarışı
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              Nə axtardığınızı təbii dildə təsvir edin. AI sizin üçün ən uyğun vakansiyaları saniyələr içində tapsın.
            </p>
          </div>
        </div>

        {/* Search Area */}
        <div className="w-full space-y-3">
          <div className="relative group">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors"
            />
            <input
              className="w-full h-16 pl-14 pr-6 rounded-3xl border border-border bg-card text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-muted-foreground shadow-sm"
              placeholder="məs. Startaplarda Senior React rolları, uzaqdan..."
            />
          </div>

          <button className="flex items-center justify-center gap-2 w-full h-14 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-bold hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 group">
            <Bot size={20} className="group-hover:animate-bounce" />
            AI ilə Analiz Et
          </button>
        </div>

        {/* Coming Soon Card */}
        <div className="glass-card rounded-[2.5rem] px-8 py-8 w-full border border-border/50 text-left overflow-hidden relative group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-primary bg-primary/10 w-fit px-3 py-1 rounded-full">
            Yaxında
          </p>
          <div className="space-y-3">
            <h4 className="text-lg font-bold">Ağıllı Uyğunlaşdırma</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI dəstəkli semantik analiz, CV-nizə əsaslanan fərdi tövsiyələr və bazar üzrə maaş anlayışları tezliklə xidmətinizdə olacaq.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
