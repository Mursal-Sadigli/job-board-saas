"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  FileText
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

import { useApplicationStore } from "@/store/useApplicationStore";
import { useApplications } from "@/hooks/useApplications";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function ApplicationsPage() {
  const { 
    applications, 
    searchQuery, 
    stageFilter, 
    setSearchQuery, 
    setStageFilter, 
    updateApplicationStage, 
    updateApplicationRating, 
    deleteApplication 
  } = useApplicationStore();
  const { isLoading: isFetching } = useApplications();
  const { getToken } = useAuth();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleStageChange = async (appId: string, newStage: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/applications/${appId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ stage: newStage })
      });

      if (!response.ok) throw new Error("Yeniləmə xətası");

      updateApplicationStage(appId, newStage);
      toast({
        title: "Mərhələ Yeniləndi",
        description: "Namizədin mərhələsi uğurla dəyişdirildi.",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Mərhələni yeniləmək mümkün olmadı.",
        type: "error"
      });
    }
  };

  const handleRatingChange = async (appId: string, newRating: number) => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/applications/${appId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newRating })
      });

      if (!response.ok) throw new Error("Yeniləmə xətası");

      updateApplicationRating(appId, newRating);
      toast({
        title: "Reytinq Yeniləndi",
        description: "Namizədin reytinqi uğurla dəyişdirildi.",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Reytinqi yeniləmək mümkün olmadı.",
        type: "error"
      });
    }
  };

  const handleDelete = async (appId: string, name: string, isVirtual?: boolean) => {
    try {
      if (!confirm(`${name} müraciətini silmək istədiyinizə əminsiniz?`)) return;

      const token = await getToken();
      const deleteUrl = isVirtual 
        ? `http://localhost:5001/api/users/resumes/${appId.replace('resume-', '')}`
        : `http://localhost:5001/api/applications/${appId}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Silinmə xətası");

      deleteApplication(appId);
      toast({
        title: "Müraciət Silindi",
        description: `${name} müraciəti uğurla silindi.`,
        type: "success"
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Xəta",
        description: "Müraciəti silmək mümkün olmadı.",
        type: "error"
      });
    }
  };

  const handleViewResume = (url: string) => {
    if (!url) {
      toast({
        title: "Xəta",
        description: "CV faylı tapılmadı.",
        type: "error"
      });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredApps = applications.filter(app => {
    const stageMap: Record<string, string> = {
        "Applied": "Applied",
        "Screening": "Applied",
        "Interview": "Interview",
        "Offered": "Offered",
        "Rejected": "Rejected"
    };

    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "Bütün" || stageMap[app.stage] === stageFilter;
    return matchesSearch && matchesStage;
  });

  if (!isHydrated) return null;

  const STAGES = [
    { value: "Applied", label: "Yeni", color: "text-blue-500" },
    { value: "Interview", label: "Müsahibə", color: "text-orange-500" },
    { value: "Offered", label: "Təklif", color: "text-emerald-500" },
    { value: "Rejected", label: "İmtina", color: "text-red-500" },
    { value: "Pool", label: "Talent Pool", color: "text-purple-500" },
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
      case "Pool": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
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
          { label: "Talent Pool", count: applications.filter(a => a.stage === "Pool").length, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Müsahibə", count: applications.filter(a => a.stage === "Interview").length, icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Təklif", count: applications.filter(a => a.stage === "Offered").length, icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
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
              {isFetching ? (
                <tr>
                   <td colSpan={6} className="px-6 py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                       <Loader2 className="w-8 h-8 animate-spin text-primary" />
                       <p className="text-sm font-bold text-muted-foreground">Müraciətlər yüklənir...</p>
                     </div>
                   </td>
                </tr>
              ) : filteredApps.map((app, idx) => (
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
                    {app.isVirtual ? (
                      <Badge variant="outline" className={cn("rounded-lg font-bold text-[10px] uppercase tracking-wider px-3 py-1 border dark:border-0", getStageColor(app.stage))}>
                        {getStageLabel(app.stage)}
                      </Badge>
                    ) : (
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
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={12} 
                          className={cn(
                            app.isVirtual ? "cursor-default opacity-50" : "cursor-pointer transition-all hover:scale-125",
                            s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/30"
                          )} 
                          onClick={() => app.isVirtual ? null : handleRatingChange(app.id, s)}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-foreground">
                        {new Date(app.appliedAt).toLocaleDateString("az-AZ")}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground/50 italic">
                        {app.isVirtual ? 'Profil CV' : 'Müraciət'}
                      </span>
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
                            <DropdownMenuItem onClick={() => handleViewResume(app.resumeUrl)} className="rounded-xl font-bold px-3 py-2.5 text-xs gap-2">
                                <FileText size={14} className="text-primary" />
                                <span>CV-yə bax</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(app.id, app.name, app.isVirtual)} className="rounded-xl font-bold px-3 py-2.5 text-xs text-red-500 gap-2">
                                <Trash2 size={14} />
                                <span>Sil</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {!isFetching && filteredApps.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">Heç bir müraciət tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-border dark:divide-white/5">
            {isFetching ? (
                <div className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm font-bold text-muted-foreground">Müraciətlər yüklənir...</p>
                    </div>
                </div>
            ) : filteredApps.map((app) => (
                <div key={app.id} className="p-5 space-y-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-black text-foreground text-sm leading-tight">{app.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                                <Briefcase size={12} className="opacity-40" />
                                {app.jobTitle}
                            </p>
                        </div>
                        {app.isVirtual ? (
                            <Badge variant="outline" className={cn("rounded-lg font-black text-[9px] uppercase tracking-widest px-2.5 py-1 shrink-0 border", getStageColor(app.stage))}>
                                {getStageLabel(app.stage)}
                            </Badge>
                        ) : (
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
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/10 dark:border-white/5">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    size={14} 
                                    className={cn(
                                        app.isVirtual ? "cursor-default opacity-50" : "cursor-pointer",
                                        s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/20"
                                    )} 
                                    onClick={() => app.isVirtual ? null : handleRatingChange(app.id, s)}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                                    {app.isVirtual ? 'Profil CV' : 'Tarix'}
                                </span>
                                <span className="text-xs font-bold text-foreground/80">{new Date(app.appliedAt).toLocaleDateString("az-AZ")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger render={
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                                            <MoreHorizontal size={18} />
                                        </Button>
                                    } />
                                    <DropdownMenuContent align="end" className="w-40 rounded-2xl p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl">
                                        <DropdownMenuItem onClick={() => handleViewResume(app.resumeUrl)} className="rounded-xl font-bold px-3 py-2.5 text-xs gap-2">
                                            <FileText size={14} className="text-primary" />
                                            <span>CV-yə bax</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(app.id, app.name, app.isVirtual)} className="rounded-xl font-bold px-3 py-2.5 text-xs text-red-500 gap-2">
                                            <Trash2 size={14} />
                                            <span>Sil</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {!isFetching && filteredApps.length === 0 && (
                <div className="p-12 text-center text-muted-foreground font-medium">Heç bir müraciət tapılmadı.</div>
            )}
        </div>
      </div>
    </div>
  );
}
