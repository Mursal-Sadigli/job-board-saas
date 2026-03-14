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
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { MOCK_JOBS } from "@/api/jobs";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

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
  
  // Initialize applications from mock data with normalized stages
  const [applications, setApplications] = useState(() => 
    MOCK_JOBS.flatMap(job => 
      (job.applicants || []).map(app => ({
        ...app,
        // Normalize stage to title case for consistency
        stage: app.stage.charAt(0).toUpperCase() + app.stage.slice(1).toLowerCase(),
        jobTitle: job.title,
        jobId: job.id
      }))
    )
  );

  const handleStageChange = (appId: string, newStage: string) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, stage: newStage } : app
    ));
    toast({
      title: "Mərhələ Yeniləndi",
      description: "Namizədin mərhələsi uğurla dəyişdirildi.",
      type: "success"
    });
  };

  const handleRatingChange = (appId: string, newRating: number) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, rating: newRating } : app
    ));
    toast({
      title: "Reytinq Yeniləndi",
      description: "Namizədin reytinqi uğurla dəyişdirildi.",
      type: "success"
    });
  };

  const handleDelete = (appId: string, name: string) => {
    setApplications(prev => prev.filter(app => app.id !== appId));
    toast({
      title: "Müraciət Silindi",
      description: `${name} müraciəti uğurla silindi.`,
    });
  };

  const filteredApps = applications.filter(app => {
    const stageMap: Record<string, string> = {
        "Applied": "Applied",
        "Screening": "Applied", // Mapping screening to Applied for simple filter
        "Interview": "Interview",
        "Offered": "Offered",
        "Rejected": "Rejected"
    };

    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "Bütün" || stageMap[app.stage] === stageFilter;
    return matchesSearch && matchesStage;
  });

  const STAGES = [
    { value: "Applied", label: "Yeni", color: "text-blue-500" },
    { value: "Interview", label: "Müsahibə", color: "text-orange-500" },
    { value: "Offered", label: "Təklif", color: "text-emerald-500" },
    { value: "Rejected", label: "İmtina", color: "text-red-500" },
  ];

  const getStageLabel = (stage: string) => {
    const s = STAGES.find(s => s.value === stage);
    return s ? s.label : stage;
  };

  const getStageColor = (stage: string) => {
    switch(stage) {
      case "Applied": 
      case "Screening": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
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
                        {STAGES.map(s => (
                            <DropdownMenuItem key={s.value} onClick={() => setStageFilter(s.value)} className={cn("rounded-xl font-bold px-3 py-2.5 text-xs", s.color)}>
                                {s.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* Kanban-ish summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Yeni", count: applications.filter(a => ["Applied", "Screening"].includes(a.stage)).length, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Müsahibə", count: applications.filter(a => a.stage === "Interview").length, icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Təklif", count: applications.filter(a => a.stage === "Offered").length, icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "İmtina Qərarı", count: applications.filter(a => a.stage === "Rejected").length, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
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

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" size={18} />
        <Input 
          placeholder="Namizəd və ya vakansiya adına görə axtar..." 
          className="pl-12 h-12 rounded-2xl bg-card border-border dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Applications List */}
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
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Tarix</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5">
              {filteredApps.map((app, idx) => (
                <tr key={app.id} className="group hover:bg-muted/30 transition-all duration-300">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger nativeButton={false} render={
                            <Badge variant="outline" className={cn("rounded-lg font-bold text-[10px] uppercase tracking-wider px-3 py-1 border dark:border-0 cursor-pointer hover:opacity-80 transition-opacity", getStageColor(app.stage))}>
                                {getStageLabel(app.stage)}
                            </Badge>
                        } />
                        <DropdownMenuContent align="center" className="w-40 rounded-2xl p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl">
                            {STAGES.map(s => (
                                <DropdownMenuItem 
                                    key={s.value} 
                                    onClick={() => handleStageChange(app.id, s.value)} 
                                    className={cn("rounded-xl font-bold px-3 py-2 text-[11px]", s.color)}
                                >
                                    {s.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={12} 
                          className={cn(
                            "cursor-pointer transition-all hover:scale-125",
                            s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/30"
                          )} 
                          onClick={() => handleRatingChange(app.id, s)}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-foreground">
                        {new Date(app.appliedAt).toLocaleDateString("az-AZ")}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground/50 italic">E-poçt</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                                <MoreHorizontal size={16} />
                            </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-40 rounded-2xl p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl">
                            <DropdownMenuItem onClick={() => handleDelete(app.id, app.name)} className="rounded-xl font-bold px-3 py-2.5 text-xs text-red-500 gap-2">
                                <Trash2 size={14} />
                                <span>Sil</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">Heç bir müraciət tapılmadı.</td>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger nativeButton={false} render={
                                <Badge variant="outline" className={cn("rounded-lg font-black text-[9px] uppercase tracking-widest px-2.5 py-1 shrink-0 border cursor-pointer", getStageColor(app.stage))}>
                                    {getStageLabel(app.stage)}
                                </Badge>
                            } />
                            <DropdownMenuContent align="end" className="w-40 rounded-2xl p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl">
                                {STAGES.map(s => (
                                    <DropdownMenuItem 
                                        key={s.value} 
                                        onClick={() => handleStageChange(app.id, s.value)} 
                                        className={cn("rounded-xl font-bold px-3 py-2 text-[11px]", s.color)}
                                    >
                                        {s.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/10 dark:border-white/5">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    size={14} 
                                    className={cn(
                                        "cursor-pointer",
                                        s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/20"
                                    )} 
                                    onClick={() => handleRatingChange(app.id, s)}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter">Tarix</span>
                                <span className="text-xs font-bold text-foreground/80">{new Date(app.appliedAt).toLocaleDateString("az-AZ")}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(app.id, app.name)} className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-500/10 transition-all">
                                <Trash2 size={16} />
                            </Button>
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
