"use client";

import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Plus
} from "lucide-react";
import { cn } from "@/utils/cn";

const STATS = [
  { label: "Cəmi Namizəd", value: "1,284", change: "+12%", trending: "up", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Yeni Müraciətlər", value: "142", change: "+5%", trending: "up", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Müsahibə Mərhələsi", value: "28", change: "-2%", trending: "down", icon: UserCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Orta İşə Qəbul Vaxtı", value: "18 gün", change: "-4%", trending: "up", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const PIPELINE_DATA = [
  { stage: "Müraciət", count: 850, percentage: 100 },
  { stage: "Skanlama", count: 420, percentage: 49 },
  { stage: "Müsahibə", count: 120, percentage: 14 },
  { stage: "Təklif", count: 15, percentage: 1.7 },
  { stage: "İşə Qəbul", count: 12, percentage: 1.4 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">Analitika</h1>
        <p className="text-sm text-muted-foreground mt-1">İşə qəbul prosesinin statistik göstəriciləri</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="p-6 rounded-4xl border border-border dark:border-white/10 bg-card dark:bg-[#0f1423] shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg",
                stat.trending === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.trending === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-black text-foreground mb-1 relative z-10">{stat.value}</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest relative z-10">{stat.label}</p>
            
            {/* Subtle bg decoration */}
            <div className={cn(
              "absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity",
              stat.bg
            )} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hiring Pipeline */}
        <div className="p-8 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:bg-[#0f1423] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Hiring Pipeline
            </h3>
          </div>
          
          <div className="space-y-6">
            {PIPELINE_DATA.map((item) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-foreground">{item.stage}</span>
                  <span className="text-muted-foreground font-medium">{item.count} namizəd ({item.percentage}%)</span>
                </div>
                <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Analysis Placeholder */}
        <div className="p-8 rounded-4xl border border-border dark:border-white/10 bg-card dark:bg-[#0f1423] shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              Mənbə Analizi
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
             <div className="relative w-48 h-48">
                {/* Simulated Donut Chart with CSS */}
                <div className="absolute inset-0 rounded-full border-12 border-blue-500/20" />
                <div className="absolute inset-0 rounded-full border-12 border-blue-500 border-t-transparent border-r-transparent rotate-45" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-foreground">64%</span>
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">LinkedIn</span>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 w-full mt-8">
                {[
                  { label: "LinkedIn", color: "bg-blue-500", percentage: "64%" },
                  { label: "Referall", color: "bg-emerald-500", percentage: "18%" },
                  { label: "Job Boards", color: "bg-purple-500", percentage: "12%" },
                  { label: "Digər", color: "bg-orange-500", percentage: "6%" },
                ].map((source) => (
                  <div key={source.label} className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", source.color)} />
                    <span className="text-xs font-bold text-foreground">{source.label}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{source.percentage}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
