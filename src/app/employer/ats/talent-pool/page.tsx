"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Tag, 
  Mail, 
  MoreHorizontal,
  Download,
  ShieldCheck,
  UserPlus,
  Plus,
  Share2,
  Trash2,
  CalendarPlus,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { CandidateDetailsDrawer } from "@/components/employer/CandidateDetailsDrawer";
import { CandidateFiltersDrawer } from "@/components/employer/CandidateFiltersDrawer";
import { ResumeAnalysisModal } from "@/components/employer/ResumeAnalysisModal";
import { InterviewModal } from "@/components/employer/InterviewModal";
import { Candidate, CandidateStatus } from "@/types/ats";
import { toast } from "@/hooks/use-toast";

import { useCandidateStore, TalentCandidate } from "@/store/useCandidateStore";

const API_BASE = "http://localhost:5001";

export default function TalentPoolPage() {
  const { getToken } = useAuth();
  const { 
    searchQuery, 
    filters, 
    setSearchQuery, 
    setFilters
  } = useCandidateStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [candidates, setCandidates] = useState<TalentCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<TalentCandidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewCandidateName, setInterviewCandidateName] = useState("");
  const [interviewCandidateEmail, setInterviewCandidateEmail] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error("Fetch profile error:", e);
    }
  }, [getToken]);

  const fetchTalentPool = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/applications/talent-pool`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Talent pool fetch failed");
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error("Fetch talent pool error:", error);
      toast({
        title: "Xəta",
        description: "İstedad hovuzunu yükləyərkən problem yarandı.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    setIsHydrated(true);
    fetchTalentPool();
    fetchUserProfile();
  }, [fetchTalentPool, fetchUserProfile]);

  const handleAnalysisComplete = async () => {
    await fetchTalentPool();
    await fetchUserProfile();
    toast({
      title: "Uğurlu",
      description: "Yeni namizəd təhlil edildi və hovuza əlavə olundu.",
      type: "success"
    });
  };

  const handleStatusChange = async (id: string, newStatus: CandidateStatus) => {
    try {
      const token = await getToken();
      const currentCandidate = candidates.find(c => c.id === id);
      
      if (currentCandidate?.applicationId) {
        const res = await fetch(`${API_BASE}/api/applications/${currentCandidate.applicationId}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ stage: newStatus })
        });
        if (!res.ok) throw new Error("Status update failed");
      }

      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      toast({ title: "Xəta", description: "Statusu yeniləmək mümkün olmadı.", type: "error" });
    }
  };

  const handleRemove = async (id: string, name: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/applications/talent-pool/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Delete failed");

      setCandidates(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Namizəd Silindi",
        description: `${name} hovuzdan uğurla çıxarıldı.`,
      });
    } catch (error) {
      toast({ title: "Xəta", description: "Namizədi silmək mümkün olmadı.", type: "error" });
    }
  };

  const handleShare = async (id: string, name: string) => {
    const shareUrl = `${window.location.origin}/employer/ats/candidates/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} - İstedad Profili`,
          text: `Zəhmət olmasa bu namizədin profilini nəzərdən keçirin: ${name}`,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link Kopyalandı", description: "Namizədin profil linki buferə kopyalandı." });
    }
  };

  const handleDownloadCV = (name: string) => {
    toast({
      title: "CV Yüklənir",
      description: `${name} üçün CV yüklənməsi başladı.`,
      type: "success"
    });
  };

  const openDetails = (candidate: TalentCandidate) => {
    setSelectedCandidate(candidate);
    setDrawerOpen(true);
  };

  const handleExport = () => {
    const headers = ["ID", "Ad", "E-poçt", "Rol", "Təcrübə (il)", "Lokasiya", "Status", "Xal"];
    const rows = filteredCandidates.map(c => [
      c.id, 
      `"${c.name}"`, 
      c.email, 
      `"${(c as any).role || c.appliedJobTitle}"`, 
      c.experienceYears, 
      `"${c.location}"`, 
      c.status, 
      c.matchingScore
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "stedad_hovuzu_eksport.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Eksport Tamamlandı",
      description: "Namizədlər siyahısı CSV formatında yükləndi.",
      type: "success"
    });
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c as any).role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  if (!isHydrated) return null;

  return (
    <div className="p-4 pt-0 sm:p-6 lg:px-20 lg:py-12 max-w-7xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-4 lg:pl-16 pl-2 pr-2 sm:pr-0 pt-4 sm:pt-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">İstedad Hovuzu</h1>
            {userProfile && userProfile.plan === "FREE" && (
              <Badge variant="outline" className="text-[8px] sm:text-[9px] font-black border-primary/30 text-primary bg-primary/5 uppercase px-1.5 py-0 border-dashed shrink-0">
                FREE
              </Badge>
            )}
          </div>
          <p className="text-[10px] sm:text-sm text-muted-foreground font-medium uppercase tracking-tighter">İstedadların təhlili və idarə edilməsi</p>
        </div>
        
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          {/* Limit Indicator for Free Users */}
          {userProfile && userProfile.plan === "FREE" && (
            <div className="hidden lg:flex flex-col items-end mr-4 text-right">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">CV Limiti</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 bg-muted dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      (userProfile.cvUploadCount || 0) >= 3 ? "bg-destructive" : (userProfile.cvUploadCount || 0) >= 2 ? "bg-orange-500" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(((userProfile.cvUploadCount || 0) / 3) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-foreground">{userProfile.cvUploadCount || 0}/3</span>
              </div>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => setFiltersOpen(true)}
            size="sm"
            className={cn(
              "rounded-xl gap-1.5 font-bold text-[10px] sm:text-xs h-9 sm:h-11 px-3 sm:px-6 border-border dark:border-white/10 hover:bg-muted/50 transition-all flex-1 sm:flex-none",
              (filters.status.length > 0 || filters.experience !== "all" || filters.minScore > 0 || filters.location) && "bg-primary/5 border-primary text-primary"
            )}
          >
            <Filter size={12} className="sm:size-4" />
            Filtrlər
          </Button>
          <Button 
            size="sm"
            onClick={() => setAnalysisOpen(true)}
            className="rounded-xl gap-1.5 font-bold text-[10px] sm:text-xs h-9 sm:h-11 px-3 sm:px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex-[1.5] sm:flex-none"
          >
            <Plus size={14} className="sm:size-4" />
            Namizəd
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:pl-16 pl-2 pr-2 sm:pr-0 overflow-x-auto pb-2 scrollbar-none snap-x h-full">
        {[
          { label: "BÜTÜN", value: candidates.length, color: "text-foreground" },
          { label: "YÜKSƏK XAL", value: candidates.filter(c => c.matchingScore >= 80).length, color: "text-primary" },
          { label: "SON 30 GÜN", value: candidates.filter(c => {
             const thirtyDaysAgo = new Date();
             thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
             return new Date(c.appliedAt) > thirtyDaysAgo;
          }).length, color: "text-emerald-500" },
          { label: "MÜSAHİBƏ", value: candidates.filter(c => c.status === "Interview").length, color: "text-orange-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-card/50 backdrop-blur-sm border border-border dark:border-white/5 p-3 sm:p-4 rounded-2xl sm:rounded-3xl min-w-[120px] sm:min-w-0 hover:border-primary/20 transition-all group snap-start shrink-0 sm:shrink">
             <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
             <p className={cn("text-lg sm:text-2xl font-black mt-0.5 sm:mt-1 group-hover:scale-110 transition-transform origin-left", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:pl-16 pl-2 pr-2 sm:pr-0">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
          <Input 
            placeholder="Axtar..." 
            className="pl-10 h-10 sm:h-12 rounded-2xl border-border dark:border-white/10 bg-card/40 focus:bg-card focus:ring-primary/20 transition-all font-medium text-xs sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExport}
          className="h-10 sm:h-12 px-4 rounded-2xl gap-2 font-bold text-[10px] sm:text-xs border-border dark:border-white/10 hover:bg-muted/50 transition-all"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Eksport</span>
        </Button>
      </div>

      {/* Candidates List - Row Layout */}
      <div className="flex flex-col gap-3 lg:pl-16 pl-2 pr-2 sm:pr-0">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
          ))
        ) : filteredCandidates.map((talent) => (
          <div 
            key={talent.id} 
            onClick={() => openDetails(talent)}
            className="group relative bg-card hover:bg-muted/5 rounded-xl sm:rounded-[20px] p-3 sm:p-4 border border-border dark:border-white/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
          >
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Avatar */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-sm sm:text-lg border border-primary/10 shrink-0">
                {talent.name.substring(0, 2).toUpperCase()}
              </div>

              {/* Basic Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-foreground truncate group-hover:text-primary transition-colors italic leading-tight">{talent.name}</h3>
                  <Badge className="bg-primary/10 text-primary h-4 sm:h-5 px-1 sm:px-1.5 rounded-md font-black text-[8px] sm:text-[9px] border border-primary/20 shrink-0">
                    {talent.matchingScore}%
                  </Badge>
                </div>
                <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5 truncate italic">{talent.appliedJobTitle || "İstedad Hovuzu"}</p>
              </div>

              {/* Middle: Details (Hidden on mobile) */}
              <div className="hidden md:flex items-center gap-8 px-6 border-x border-border/30 h-10 shrink-0">
                <div className="flex flex-col justify-center items-center text-center w-16">
                   <p className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest leading-none mb-1">Tarix</p>
                   <p className="text-[11px] font-black text-foreground italic">{new Date(talent.appliedAt).toLocaleDateString("az-AZ", { day: '2-digit', month: '2-digit' })}</p>
                </div>
                <div className="flex flex-col justify-center items-center text-center w-16">
                   <p className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest leading-none mb-1">Təcrübə</p>
                   <p className="text-[11px] font-black text-foreground italic">{talent.experienceYears}+ İl</p>
                </div>
              </div>

              {/* Desktop Skills */}
              <div className="hidden lg:flex flex-wrap gap-1.5 justify-end max-w-[200px]">
                {talent.skills.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="rounded-md px-1.5 py-0 font-bold text-[8px] uppercase tracking-tighter bg-muted/40 text-muted-foreground/60 border border-border/30">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${talent.email}`;
                  }}
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground hidden sm:flex"
                >
                  <Mail size={14} />
                </Button>
                
                <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />

                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className="flex text-muted-foreground items-center justify-center rounded-lg h-8 w-8 hover:bg-muted dark:hover:bg-white/5 outline-none focus:outline-none transition-colors border border-transparent hover:border-border" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem 
                      onClick={() => openDetails(talent)}
                      className="gap-2 cursor-pointer font-medium p-2 text-xs"
                    >
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>Tam profilə bax</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setInterviewCandidateName(talent.name);
                        setInterviewCandidateEmail(talent.email);
                        setInterviewModalOpen(true);
                      }}
                      className="gap-2 cursor-pointer font-medium p-2 text-xs"
                    >
                      <CalendarPlus size={14} className="text-primary" />
                      <span>Müsahibəyə dəvət et</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleShare(talent.id, talent.name)}
                      className="gap-2 cursor-pointer font-medium p-2 text-xs"
                    >
                      <Share2 size={14} className="text-muted-foreground" />
                      <span>Profili bölüş</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleRemove(talent.id, talent.name)}
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-bold p-2 text-xs"
                    >
                      <Trash2 size={14} />
                      <span>Hovuzdan sil</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && !isLoading && (
         <div className="flex flex-col items-center justify-center py-16 text-center rounded-4xl border border-dashed border-border dark:border-white/10 bg-card/50">
           <Search size={32} className="text-muted-foreground/30 mb-4" />
           <p className="text-sm font-bold text-foreground">Uyğun namizəd tapılmadı</p>
           <p className="text-xs text-muted-foreground mt-1">Axtarış sözlərini və ya filtrləri dəyişin</p>
         </div>
      )}

      {/* Modals & Drawers */}
      <CandidateDetailsDrawer 
        candidate={selectedCandidate}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={(status) => selectedCandidate && handleStatusChange(selectedCandidate.id, status)}
        onDownloadCV={() => selectedCandidate && handleDownloadCV(selectedCandidate.name)}
      />

      <CandidateFiltersDrawer 
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onApplyFilters={setFilters}
        initialFilters={filters}
      />

      <ResumeAnalysisModal 
        open={analysisOpen} 
        onOpenChange={setAnalysisOpen} 
        onAnalysisComplete={handleAnalysisComplete} 
      />

      <InterviewModal
        open={interviewModalOpen}
        onOpenChange={setInterviewModalOpen}
        initialCandidateName={interviewCandidateName}
        initialCandidateEmail={interviewCandidateEmail}
        onSuccess={(data) => {
          const candidate = candidates.find(c => c.name === data.candidateName);
          if (candidate) handleStatusChange(candidate.id, "Interview");
        }}
      />
    </div>
  );
}
