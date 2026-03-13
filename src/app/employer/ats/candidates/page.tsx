"use client";

import { useState } from "react";
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
  Briefcase
} from "lucide-react";
import { MOCK_CANDIDATES } from "@/api/ats";
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

const STATUS_CONFIG: Record<CandidateStatus, { label: string; icon: any; color: string; bg: string }> = {
  Applied: { label: "Müraciət", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  Screening: { label: "Seçim", icon: Search, color: "text-purple-500", bg: "bg-purple-500/10" },
  Interview: { label: "Müsahibə", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  Offered: { label: "Təklif", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Hired: { label: "İşə Alındı", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  Rejected: { label: "İmtina", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
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

  const handleAnalysisComplete = (data: any) => {
    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      location: "Bakı, Azərbaycan",
      experienceYears: data.experienceYears,
      skills: data.skills,
      education: ["Məlumat yoxdur"],
      matchingScore: data.matchingScore,
      analysisStatus: "completed",
      appliedAt: new Date().toISOString(),
      status: "Applied",
      appliedJobTitle: "AI Analiz"
    };
    setCandidates(prev => [newCandidate, ...prev]);
  };

  const handleStatusChange = (id: string, newStatus: CandidateStatus) => {
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
    if (selectedCandidate?.id === id) {
      setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDownloadCV = (name: string) => {
    // Simulate download
    const element = document.createElement("a");
    const file = new Blob(["Mock CV content for " + name], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${name}_CV.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDrawerOpen(true);
  };

  const filteredCandidates = candidates.filter(c => {
    // Search Query (Name, Email, Skills)
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status Filter
    const matchesStatus = filters.status.length === 0 || filters.status.includes(c.status);

    // Experience Filter
    let matchesExperience = true;
    if (filters.experience !== "all") {
      const exp = c.experienceYears;
      if (filters.experience === "0-1") matchesExperience = exp <= 1;
      else if (filters.experience === "1-3") matchesExperience = exp > 1 && exp <= 3;
      else if (filters.experience === "3-5") matchesExperience = exp > 3 && exp <= 5;
      else if (filters.experience === "5-10") matchesExperience = exp > 5 && exp <= 10;
      else if (filters.experience === "10+") matchesExperience = exp > 10;
    }

    // Matching Score Filter
    const matchesScore = c.matchingScore >= filters.minScore;

    // Location Filter
    const matchesLocation = !filters.location || c.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesStatus && matchesExperience && matchesScore && matchesLocation;
  });

  return (
    <div className="p-6 pt-0 lg:px-20 lg:py-12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4 lg:pl-16 pl-12">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">Namizədlər</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Bütün müraciətlər və namizəd bazası</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={() => setFiltersOpen(true)}
            className={cn(
              "rounded-2xl gap-2 font-black text-xs h-10 sm:h-11 px-6 border-border dark:border-white/10 hover:bg-muted/50 transition-all",
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
            className="rounded-2xl gap-2 font-black text-xs h-10 sm:h-11 px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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

      {/* Candidates List - Simplified & Compact */}
      <div className="bg-card rounded-[32px] border border-border dark:border-white/10 overflow-hidden divide-y divide-border/50 dark:divide-white/5">
        {filteredCandidates.map((candidate) => {
          const Status = STATUS_CONFIG[candidate.status];
          return (
            <div 
              key={candidate.id} 
              className="group p-3 sm:py-4 sm:px-6 hover:bg-muted/30 transition-colors relative cursor-pointer w-full"
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
                      <span className="hidden md:inline text-[10px] font-bold text-muted-foreground/60">{candidate.experienceYears}+ il təcrübə</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Skills tags - hidden on small screens */}
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
                            candidate.matchingScore > 80 ? "text-emerald-500" : 
                            candidate.matchingScore > 50 ? "text-orange-500" : "text-red-500"
                          )}
                          strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                          strokeDasharray={`${candidate.matchingScore * 2.51} 251`}
                        />
                      </svg>
                      {candidate.matchingScore}%
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
                         <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownloadCV(candidate.name); }} className="rounded-xl font-bold gap-3 px-4 py-2 text-xs">
                            <FileUp size={14} className="opacity-60" /> CV-ni Yüklə
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
        })}
      </div>


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
    </div>
  );
}
