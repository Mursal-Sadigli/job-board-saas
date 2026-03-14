"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  Search, 
  FileUp, 
  Filter, 
  MoreHorizontal, 
  Star, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Mail,
  MapPin,
  ExternalLink,
  Briefcase,
  Loader2,
  Share2
} from "lucide-react";
import { Candidate, CandidateStatus } from "@/types/ats";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeAnalysisModal } from "@/components/employer/ResumeAnalysisModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CandidateDetailsDrawer } from "@/components/employer/CandidateDetailsDrawer";
import { CandidateFiltersDrawer } from "@/components/employer/CandidateFiltersDrawer";
import { useAuth } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";

const API_BASE = "http://localhost:5001";

const STATUS_CONFIG: Record<CandidateStatus, { label: string; icon: any; color: string; bg: string }> = {
  Applied: { label: "Müraciət", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  Screening: { label: "Seçim", icon: Search, color: "text-purple-500", bg: "bg-purple-500/10" },
  Interview: { label: "Müsahibə", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  Offered: { label: "Təklif", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Hired: { label: "İşə Alındı", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  Rejected: { label: "İmtina", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export default function CandidatesPage() {
  const { getToken } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as CandidateStatus[],
    experience: "all",
    minScore: 0,
    location: ""
  });

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/applications/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Namizədləri gətirmək mümkün olmadı");
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error("Fetch candidates error:", error);
      toast({
        title: "Xəta",
        description: "Namizədləri yükləyərkən problem yarandı.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleAnalysisComplete = (data: any) => {
    fetchCandidates();
    toast({
      title: "Analiz Tamamlandı",
      description: `${data.name} bazaya əlavə edildi.`,
      type: "success"
    });
  };

  const handleStatusChange = async (id: string, newStatus: CandidateStatus) => {
    try {
      const token = await getToken();
      const candidate = candidates.find(c => c.id === id);
      
      if (candidate && candidate.applicationId) {
        // Real status update in DB via Application API
        const response = await fetch(`${API_BASE}/api/applications/${candidate.applicationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ stage: newStatus })
        });

        if (!response.ok) throw new Error("Yeniləmə xətası");

        toast({ title: "Uğurlu", description: "Namizədin statusu bazada yeniləndi", type: "success" });
      } else {
        // Just visual update for pool candidates or if no application ID
        toast({ title: "Məlumat", description: "Status vizual olaraq dəyişdirildi (Müraciət ID-si tapılmadı)", type: "success" });
      }

      setCandidates(prev => prev.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));

      if (selectedCandidate?.id === id) {
        setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
    } catch (error) {
      console.error("Status change error:", error);
      toast({ title: "Xəta", description: "Statusu yeniləmək mümkün olmadı", type: "error" });
    }
  };

  const handleDownloadCV = (candidate: Candidate) => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, "_blank");
    } else {
      toast({ title: "Xəta", description: "CV tapılmadı", type: "error" });
    }
  };

  const handleShare = async (id: string, name: string) => {
    const shareUrl = `${window.location.origin}/employer/ats/candidates/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} - Namizəd Profili`,
          text: `Zəhmət olmasa bu namizədin profilini nəzərdən keçirin: ${name}`,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Kopyalandı",
        description: "Namizədin unikal profil linki buferə kopyalandı.",
      });
    }
  };

  const openDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDrawerOpen(true);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filters.status.length === 0 || filters.status.includes(c.status);

    let matchesExperience = true;
    if (filters.experience !== "all") {
      const exp = c.experienceYears || 0;
      if (filters.experience === "0-1") matchesExperience = exp <= 1;
      else if (filters.experience === "1-3") matchesExperience = exp > 1 && exp <= 3;
      else if (filters.experience === "3-5") matchesExperience = exp > 3 && exp <= 5;
      else if (filters.experience === "5-10") matchesExperience = exp > 5 && exp <= 10;
      else if (filters.experience === "10+") matchesExperience = exp > 10;
    }

    const matchesScore = (c.matchingScore || 0) >= filters.minScore;
    const matchesLocation = !filters.location || c.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesStatus && matchesExperience && matchesScore && matchesLocation;
  });

  return (
    <div className="p-6 pt-0 lg:px-20 lg:py-12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4 lg:pl-16 pl-12 pr-12 sm:pr-0 pt-6 sm:pt-0">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">Namizədlər</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Bütün müraciətlər və namizəd bazası</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setFiltersOpen(true)}
            className={cn(
              "rounded-2xl gap-2 font-black text-xs h-10 sm:h-11 px-6 border-border dark:border-white/10 hover:bg-muted/50 transition-all w-full sm:w-auto",
              (filters.status.length > 0 || filters.experience !== "all" || filters.minScore > 0 || filters.location) && "bg-primary/5 border-primary text-primary"
            )}
          >
            <Filter size={14} className="sm:size-4" />
            Filtrlər
            {(filters.status.length > 0 || filters.experience !== "all" || filters.minScore > 0 || filters.location) && (
              <span className="ml-1 w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
          <Button 
            onClick={() => setAnalysisOpen(true)}
            className="rounded-2xl gap-2 font-black text-xs h-10 sm:h-11 px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
          >
            <FileUp size={14} className="sm:size-4" />
            <span className="sm:hidden">Analiz Et</span>
            <span className="hidden sm:inline">CV Analiz Et</span>
          </Button>
        </div>
      </div>

      <ResumeAnalysisModal 
        open={analysisOpen} 
        onOpenChange={setAnalysisOpen} 
        onAnalysisComplete={handleAnalysisComplete} 
      />

      {/* Search and Stats */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 transition-colors group-focus-within:text-primary" size={18} />
          <Input 
            placeholder="Ada, email-ə və ya bacarığa görə axtar..." 
            className="pl-13 h-12 sm:h-14 rounded-[24px] bg-card dark:bg-white/5 border-border dark:border-white/5 focus:ring-8 focus:ring-primary/5 transition-all font-bold text-sm shadow-sm backdrop-blur-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-12 sm:h-14 flex items-center justify-between px-8 rounded-[24px] bg-muted/20 dark:bg-white/5 border border-border dark:border-white/5 min-w-0 sm:min-w-[180px] backdrop-blur-md">
          <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest shrink-0">Namizəd Sayı:</span>
          <span className="text-lg sm:text-xl font-black text-foreground ml-4 shrink-0">{filteredCandidates.length}</span>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-card rounded-[32px] border border-border dark:border-white/20 overflow-hidden divide-y divide-border dark:divide-white/20 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground">Namizədlər yüklənir...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users size={40} className="text-muted-foreground/20 mb-4" />
            <p className="font-bold text-muted-foreground">Heç bir namizəd tapılmadı</p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
            const Status = STATUS_CONFIG[candidate.status];
            return (
              <div 
                key={candidate.id} 
                className="group py-4 px-4 sm:py-5 sm:px-8 hover:bg-muted/30 transition-colors relative cursor-pointer w-full"
                onClick={() => openDetails(candidate)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 dark:bg-primary/5 flex items-center justify-center text-primary font-black text-sm sm:text-base shadow-inner shrink-0 border border-primary/10">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-[13px] sm:text-sm font-black text-foreground truncate leading-tight group-hover:text-primary transition-colors">{candidate.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tight",
                          Status.bg, Status.color
                        )}>
                          {Status.label}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/40 sm:block hidden">•</span>
                        <span className="text-[10px] font-bold text-muted-foreground/60 truncate">{candidate.appliedJobTitle || "Ümumi Baza"}</span>
                        <span className="hidden md:inline text-[10px] font-bold text-muted-foreground/40">•</span>
                        <span className="hidden md:inline text-[10px] font-bold text-muted-foreground/60">{(candidate.experienceYears || 0)}+ il təcrübə</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="hidden lg:flex flex-wrap gap-1.5 max-w-[180px] justify-end">
                      {candidate.skills.slice(0, 2).map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 rounded-md bg-muted dark:bg-white/5 text-[8px] font-bold text-muted-foreground/50 uppercase tracking-tight border border-border dark:border-white/5 whitespace-nowrap">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-9 h-9 flex items-center justify-center font-black text-[9px] text-foreground shrink-0 bg-muted/20 dark:bg-white/5 rounded-full border border-border/50 dark:border-white/5 shadow-sm">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle className="text-muted/10 dark:text-white/5 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" />
                          <circle 
                            className={cn(
                              "stroke-current transition-all duration-1000",
                              (candidate.matchingScore || 0) > 80 ? "text-emerald-500" : 
                              (candidate.matchingScore || 0) > 50 ? "text-orange-500" : "text-red-500"
                            )}
                            strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                            strokeDasharray={`${(candidate.matchingScore || 0) * 2.51} 251`}
                          />
                        </svg>
                        {candidate.matchingScore || 0}%
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg bg-muted/20 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal size={14} className="text-muted-foreground/60" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-52 rounded-[20px] p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl backdrop-blur-2xl">
                           <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetails(candidate); }} className="rounded-xl font-bold gap-3 px-4 py-2 text-xs">
                              <ExternalLink size={14} className="opacity-60" /> Profili Gör
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownloadCV(candidate); }} className="rounded-xl font-bold gap-3 px-4 py-2 text-xs">
                              <FileUp size={14} className="opacity-60" /> CV-ni Yüklə
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare(candidate.id, candidate.name); }} className="rounded-xl font-bold gap-3 px-4 py-2 text-xs">
                              <Share2 size={14} className="opacity-60" /> Profili Bölüş
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="my-1 bg-border dark:bg-white/5" />
                           <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(candidate.id, "Rejected"); }} className="rounded-xl font-black text-red-500 gap-3 px-4 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-950/20">
                              <XCircle size={14} /> Rədd Et
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CandidateDetailsDrawer 
        candidate={selectedCandidate}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={(status) => selectedCandidate && handleStatusChange(selectedCandidate.id, status)}
        onDownloadCV={() => selectedCandidate && handleDownloadCV(selectedCandidate)}
      />

      <CandidateFiltersDrawer 
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onApplyFilters={setFilters}
        initialFilters={filters}
      />
    </div>
  );
}
