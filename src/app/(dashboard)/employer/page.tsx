"use client";

import { Building2, BarChart3, Users, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { PostJobModal } from "@/components/employer/PostJobModal";

export default function EmployerPage() {
  return (
    <div className="h-full min-h-[calc(100vh-65px)] overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-white/5 transition-all">
                <Building2 size={24} className="text-white dark:text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl">
                  İşəgötürən Paneli
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Vakansiyalarınızı və namizədləri vahid paneldən idarə edin.
                </p>
              </div>
            </div>
            
            <PostJobModal>
              <button className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 group">
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                İş Elanı Paylaş
              </button>
            </PostJobModal>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Aktiv İşlər", value: "0", icon: <Building2 size={18} />, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Cəmi Müraciətlər", value: "0", icon: <Users size={18} />, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Baxış Sayı", value: "0", icon: <BarChart3 size={18} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-3xl p-5 border border-border shadow-sm/5 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  Dashboard
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-foreground tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state & Dashboard Body */}
        <div className="bg-card/50 rounded-[2.5rem] border border-dashed border-border p-12 text-center flex flex-col items-center justify-center shadow-inner mt-12 transition-colors">
          <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6">
            <Building2 size={36} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">
            Hələ heç bir iş elanı yoxdur
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed font-medium">
            Müraciətləri və baxışları təqib etmək üçün ilk vakansiyanızı dərhal əlavə edin.
          </p>
          <PostJobModal>
            <button className="h-11 px-8 rounded-2xl border border-border bg-background text-sm font-bold text-foreground hover:bg-muted/50 transition-all active:scale-95 shadow-sm">
              Yeni elan yarat
            </button>
          </PostJobModal>
        </div>
      </div>
    </div>
  );
}
