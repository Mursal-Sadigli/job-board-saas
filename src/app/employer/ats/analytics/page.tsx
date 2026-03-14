"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { cn } from "@/utils/cn";
import { toast } from "@/hooks/use-toast";

const API_BASE = "http://localhost:5001";

export default function AnalyticsPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<{
    stats: any[];
    pipelineData: any[];
    sourceAnalysis: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/analytics/employer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Analytics fetch failed");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Fetch analytics error:", error);
      toast({
        title: "Xəta",
        description: "Analitika məlumatlarını yükləyərkən problem yarandı.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Analitika məlumatları yüklənir...</p>
      </div>
    );
  }

  if (!data) return null;

  // Icon mapping for stats
  const iconMap: Record<string, any> = {
    Users,
    TrendingUp,
    UserCheck,
    Clock
  };

  return (
    <div className="p-4 sm:p-6 lg:px-20 lg:py-12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">Analitika</h1>
        <p className="text-sm text-muted-foreground mt-1">İşə qəbul prosesinin statistik göstəriciləri</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((stat) => {
          const IconComponent = iconMap[stat.icon] || Users;
          return (
            <div key={stat.label} className="p-6 rounded-4xl border border-border dark:border-white/10 bg-card dark:bg-[#0f1423] shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <IconComponent size={24} className={stat.color} />
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
          );
        })}
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
            {data.pipelineData.map((item) => (
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

        {/* Source Analysis */}
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
                  <span className="text-3xl font-black text-foreground">{data.sourceAnalysis[0].percentage}</span>
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{data.sourceAnalysis[0].label}</span>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 w-full mt-8">
                {data.sourceAnalysis.map((source) => (
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
