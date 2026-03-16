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
  FileText,
  Sparkles,
  Brain,
  Info,
  LayoutGrid,
  Table as TableIcon
} from "lucide-react";
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

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ATSBoard } from "@/components/employer/ATSBoard";

export default function ApplicationsPage() {
  const { 
    applications, 
    searchQuery, 
    stageFilter, 
    setSearchQuery, 
    setStageFilter, 
    updateApplicationStage, 
    updateApplicationRating, 
    deleteApplication,
    setApplications
  } = useApplicationStore();
  const { isLoading: isFetching } = useApplications();
  const { getToken } = useAuth();

  const [isHydrated, setIsHydrated] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "board">("table");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAIAnalyze = async (appId: string) => {
    try {
      setAnalyzingId(appId);
      const token = await getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      
      const response = await fetch(`${API_BASE}/api/applications/${appId}/analyze`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Analiz xətası");
      }

      const data = await response.json();
      
      // Update local store
      const updatedApps = applications.map(app => 
        app.id === appId ? { 
          ...app, 
          matchScore: data.matchScore, 
          aiAnalysis: data.analysis 
        } : app
      );
      setApplications(updatedApps);

      toast({
        title: "Analiz Tamamlandı",
        description: `Namizəd ${data.matchScore}% uyğunluq göstərdi.`,
      });

      setSelectedAnalysis(data.analysis);
      setIsAnalysisModalOpen(true);

    } catch (error: any) {
      toast({
        title: "Xəta",
        description: error.message || "Analiz mümkün olmadı.",
        type: "error"
      });
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleStageChange = async (appId: string, newStage: string) => {
    // Optimistic update
    const previousStage = applications.find(a => a.id === appId)?.stage;
    updateApplicationStage(appId, newStage);

    try {
      const token = await getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/applications/${appId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ stage: newStage })
      });

      if (!response.ok) throw new Error("Yeniləmə xətası");

      toast({
        title: "Mərhələ Yeniləndi",
        description: "Namizədin mərhələsi uğurla dəyişdirildi.",
      });
    } catch (error) {
      if (previousStage) updateApplicationStage(appId, previousStage); // Rollback on error
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
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/applications/${appId}`, {
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
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Reytinqi yeniləmək mümkün olmadı.",
        type: "error"
      });
    }
  };

  const handleDelete = async (appId: string, name: string) => {
    try {
      if (!confirm(`${name} müraciətini silmək istədiyinizə əminsiniz?`)) return;

      const token = await getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/applications/${appId}`, {
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

  const handleViewResume = async (appId: string) => {
    try {
      const token = await getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/applications/${appId}/resume`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "CV tapılmadı");
      }

      const data = await response.json();
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      console.error("View resume error:", error);
      toast({
        title: "Xəta",
        description: error.message || "CV yüklənərkən xəta baş verdi.",
        type: "error"
      });
    }
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
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border dark:border-white/5">
            <Button 
                variant={viewMode === "table" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("table")}
                className="rounded-lg h-9 px-3 gap-2 font-bold"
            >
                <TableIcon size={14} />
                <span className="hidden sm:inline">Cədvəl</span>
            </Button>
            <Button 
                variant={viewMode === "board" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("board")}
                className="rounded-lg h-9 px-3 gap-2 font-bold"
            >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Board</span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center cursor-pointer select-none rounded-xl gap-2 font-bold text-sm h-11 px-5 border border-border dark:border-white/10 bg-card hover:bg-muted transition-all">
                <Filter size={16} />
                {stageFilter === "Bütün" ? "Filtrlər" : getStageLabel(stageFilter)}
            </DropdownMenuTrigger>
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
      {viewMode === "table" ? (
        <div className="bg-card rounded-3xl border border-border dark:border-white/10 shadow-xl overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border dark:border-white/10 bg-muted/20">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center w-12">#</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Namizəd / Vakansiya</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">AI Uyğunluq</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Mərhələ</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Reytinq</th>
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
                      {app.matchScore !== undefined ? (
                        <div 
                          className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedAnalysis(app.aiAnalysis);
                            setIsAnalysisModalOpen(true);
                          }}
                        >
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/20" />
                              <circle
                                cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * app.matchScore) / 100}
                                className={cn(app.matchScore > 80 ? "text-emerald-500" : app.matchScore > 50 ? "text-amber-500" : "text-red-500")}
                              />
                            </svg>
                            <span className="absolute text-[10px] font-black">{app.matchScore}%</span>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 rounded-lg gap-2 text-[10px] font-black uppercase text-primary hover:bg-primary/10"
                          onClick={() => handleAIAnalyze(app.id)}
                          disabled={analyzingId === app.id}
                        >
                          {analyzingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          <span>AI Analiz</span>
                        </Button>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Badge variant="outline" className={cn("rounded-lg font-bold text-[10px] uppercase tracking-wider px-3 py-1 border dark:border-0 cursor-pointer hover:opacity-80 transition-opacity", getStageColor(app.stage))}>
                            {getStageLabel(app.stage)}
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-40 rounded-2xl p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl">
                          {STAGES.map(s => (
                            <DropdownMenuItem key={s.value} onClick={() => handleStageChange(app.id, s.value)} className={cn("rounded-xl font-bold px-3 py-2 text-[11px]", s.color)}>
                              {s.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={12} 
                            className={cn("cursor-pointer transition-all hover:scale-125", s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/30")} 
                            onClick={() => handleRatingChange(app.id, s)}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center cursor-pointer h-8 w-8 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                            <MoreHorizontal size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-2xl p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl">
                          <DropdownMenuItem onClick={() => handleViewResume(app.id)} className="rounded-xl font-bold px-3 py-2.5 text-xs gap-2">
                            <FileText size={14} className="text-primary" />
                            <span>CV-yə bax</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(app.id, app.name)} className="rounded-xl font-bold px-3 py-2.5 text-xs text-red-500 gap-2">
                            <Trash2 size={14} />
                            <span>Sil</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ATSBoard 
          applications={filteredApps} 
          onStageChange={handleStageChange}
          onViewResume={handleViewResume}
          onViewAnalysis={(analysis) => {
            setSelectedAnalysis(analysis);
            setIsAnalysisModalOpen(true);
          }}
        />
      )}

      {/* AI Analysis Modal */}
      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-4xl bg-card dark:bg-[#0f172a] border-border dark:border-white/10 shadow-2xl p-4 sm:p-6">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="text-primary" size={24} />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">AI ATS Analiz Hesabatı</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium"> Namizədin vakansiya tələblərinə uyğunluq analizi </DialogDescription>
          </DialogHeader>

          {selectedAnalysis && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-muted/20 border border-border/50">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/10" />
                    <circle
                      cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * selectedAnalysis.matchScore) / 100}
                      className={cn("transition-all duration-1000 ease-out", selectedAnalysis.matchScore > 80 ? "text-emerald-500" : selectedAnalysis.matchScore > 50 ? "text-amber-500" : "text-red-500")}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black">{selectedAnalysis.matchScore}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge className={cn("font-black tracking-widest uppercase text-[10px]", selectedAnalysis.verdict === 'Pas keçdi' ? "bg-emerald-500/10 text-emerald-500" : selectedAnalysis.verdict === 'Kəsildi' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500")}>
                    {selectedAnalysis.verdict}
                  </Badge>
                  <p className="text-sm font-medium text-foreground leading-relaxed">{selectedAnalysis.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Uyğun Bacarıqlar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.matchedSkills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="rounded-lg bg-emerald-500/5 text-emerald-600 border-emerald-500/10 text-[11px] font-bold"> {skill} </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                    <XCircle size={14} /> Çatışmayanlar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.missingSkills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="rounded-lg bg-red-500/5 text-red-600 border-red-500/10 text-[11px] font-bold"> {skill} </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsAnalysisModalOpen(false)}> Bağla </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
