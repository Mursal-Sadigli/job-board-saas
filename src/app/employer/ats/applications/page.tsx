"use client";

import { useState } from "react";
import { 
  Briefcase, 
  Search, 
  ChevronRight,
  Filter,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { MOCK_JOBS } from "@/api/jobs";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("Bütün");
  
  // Aggregate applications from mock jobs
  const allApplications = MOCK_JOBS.flatMap(job => 
    (job.applicants || []).map(app => ({
      ...app,
      jobTitle: job.title,
      jobId: job.id
    }))
  );

  const filteredApps = allApplications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "Bütün" || app.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageLabel = (stage: string) => {
    switch(stage) {
      case "Applied": return "Yeni";
      case "Interview": return "Müsahibə";
      case "Offered": return "Təklif";
      case "Rejected": return "İmtina";
      default: return stage;
    }
  };

  const getStageColor = (stage: string) => {
    switch(stage) {
      case "Applied": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Interview": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Offered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="pl-12 pr-6 pb-6 pt-0 lg:px-20 lg:py-12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:pl-16 pl-12">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">Müraciətlər</h1>
          <p className="text-sm text-muted-foreground mt-1">Vakansiyalar üzrə aktiv müraciətlərin idarə edilməsi</p>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button variant="outline" className="rounded-xl gap-2 font-bold text-sm h-11 px-5 border-border dark:border-white/10 hover:bg-muted transition-all">
                        <Filter size={16} />
                        {stageFilter === "Bütün" ? "Filtrlər" : getStageLabel(stageFilter)}
                    </Button>
                } />
                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-3 py-2">Mərhələyə görə</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setStageFilter("Bütün")} className="rounded-xl font-bold px-3 py-2.5 text-xs">Bütün</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem onClick={() => setStageFilter("Applied")} className="rounded-xl font-bold px-3 py-2.5 text-xs text-blue-500">Yeni</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStageFilter("Interview")} className="rounded-xl font-bold px-3 py-2.5 text-xs text-orange-500">Müsahibə</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStageFilter("Offered")} className="rounded-xl font-bold px-3 py-2.5 text-xs text-emerald-500">Təklif</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStageFilter("Rejected")} className="rounded-xl font-bold px-3 py-2.5 text-xs text-red-500">İmtina</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* Kanban-ish summary or List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Yeni", count: filteredApps.filter(a => a.stage === "Applied").length, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Müsahibə", count: filteredApps.filter(a => a.stage === "Interview").length, icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Təklif", count: filteredApps.filter(a => a.stage === "Offered").length, icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "İmtina Qərarı", count: filteredApps.filter(a => a.stage === "Rejected").length, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
        ].map(stat => (
          <div key={stat.label} className="p-5 rounded-2xl border border-border dark:border-white/5 bg-card shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-2xl font-black text-foreground">{stat.count}</span>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" size={18} />
        <Input 
          placeholder="Namizəd və ya vakansiya adına görə axtar..." 
          className="pl-12 h-12 rounded-2xl bg-card border-border dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Applications List - Responsive Table/Cards */}
      <div className="bg-card rounded-3xl border border-border dark:border-white/10 shadow-xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-white/10 bg-muted/20">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center w-12">#</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Namizəd / Vakansiya</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Mərhələ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Reytinq</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-right">Tarix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5">
              {filteredApps.map((app, idx) => (
                <tr key={app.id} className="group hover:bg-muted/30 transition-all duration-300 cursor-pointer">
                  <td className="px-6 py-5 text-center text-[10px] font-black text-muted-foreground/20 italic">{idx + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{app.name}</span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5 truncate">
                        <Briefcase size={10} className="opacity-50" />
                        {app.jobTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge variant="outline" className={cn("rounded-lg font-bold text-[10px] uppercase tracking-wider px-3 py-1 border dark:border-0", getStageColor(app.stage))}>
                      {getStageLabel(app.stage)}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={12} 
                          className={cn(s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/30")} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-foreground">
                        {new Date(app.appliedAt).toLocaleDateString("az-AZ")}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground/50 italic">E-poçt ilə</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">Heç bir müraciət tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-border dark:divide-white/5">
            {filteredApps.map((app) => (
                <div key={app.id} className="p-5 space-y-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-black text-foreground text-sm leading-tight">{app.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                                <Briefcase size={12} className="opacity-40" />
                                {app.jobTitle}
                            </p>
                        </div>
                        <Badge variant="outline" className={cn("rounded-lg font-black text-[9px] uppercase tracking-widest px-2.5 py-1 shrink-0 border", getStageColor(app.stage))}>
                            {getStageLabel(app.stage)}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/10 dark:border-white/5">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    size={10} 
                                    className={cn(s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/20")} 
                                />
                            ))}
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter">Tarix</span>
                            <span className="text-xs font-bold text-foreground/80">{new Date(app.appliedAt).toLocaleDateString("az-AZ")}</span>
                        </div>
                    </div>
                </div>
            ))}
            {filteredApps.length === 0 && (
                <div className="p-12 text-center text-muted-foreground font-medium">Heç bir müraciət tapılmadı.</div>
            )}
        </div>
      </div>
    </div>
  );
}
