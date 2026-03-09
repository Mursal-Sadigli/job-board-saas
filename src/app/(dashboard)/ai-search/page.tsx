"use client";

import { Sparkles, Bot, Search } from "lucide-react";

export default function AISearchPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-10 bg-[#F8F9FA]">
      <div className="flex flex-col items-center gap-5 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-sm">
          <Sparkles size={28} className="text-slate-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2 text-slate-900 tracking-tight">
            AI İş Axtarışı
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Nə axtardığınızı təbii dildə təsvir edin və AI sizin üçün ən uyğun işləri tapsın.
          </p>
        </div>

        <div className="w-full relative group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors"
          />
          <input
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-400"
            placeholder="məs. Startaplarda Senior React rolları, uzaqdan, 150k+ $"
          />
        </div>

        <button className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]">
          <Bot size={16} />
          AI ilə Axtar
        </button>

        <div className="rounded-2xl px-6 py-5 w-full bg-white border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5 text-slate-400">
            Tezliklə
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            AI dəstəkli semantik iş uyğunlaşdırması, CV-nizə əsaslanan fərdi tövsiyələr və ağıllı maaş anlayışları.
          </p>
        </div>
      </div>
    </div>
  );
}
