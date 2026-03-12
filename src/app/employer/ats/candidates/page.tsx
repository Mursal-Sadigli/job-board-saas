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

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">Namizədlər</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Bütün müraciətlər və namizəd bazası</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Button variant="outline" className="rounded-2xl gap-2 font-black text-xs h-10 sm:h-11 px-6 border-border dark:border-white/10 hover:bg-muted/50 transition-all">
            <Filter size={14} className="sm:size-4" />
            Filtrlər
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
            className="pl-13 h-12 sm:h-14 rounded-[24px] bg-card dark:bg-[#0f1423]/50 border-border dark:border-white/5 focus:ring-8 focus:ring-primary/5 transition-all font-bold text-sm shadow-sm backdrop-blur-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-12 sm:h-14 flex items-center justify-between px-8 rounded-[24px] bg-muted/20 dark:bg-white/5 border border-border dark:border-white/5 min-w-0 sm:min-w-[180px] backdrop-blur-md">
          <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest shrink-0">Namizəd Sayı:</span>
          <span className="text-lg sm:text-xl font-black text-foreground ml-4 shrink-0">{filteredCandidates.length}</s      {/* Candidates Grid - Desktop & Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => {
          const Status = STATUS_CONFIG[candidate.status];
          return (
            <div 
              key={candidate.id} 
              className="group bg-card dark:bg-linear-to-b dark:from-[#0f172a] dark:to-[#020617] rounded-[24px] border border-border dark:border-white/5 p-4 shadow-sm hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all relative overflow-hidden cursor-pointer"
              onClick={() => openDetails(candidate)}
            >
              {/* Visual Accent Layer */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/5 flex items-center justify-center text-primary font-black text-base shadow-inner shrink-0 border border-primary/10">
                    {candidate.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-black text-foreground truncate leading-tight group-hover:text-primary transition-colors">{candidate.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tight",
                        Status.bg, Status.color, "dark:border dark:border-current/10"
                      )}>
                        {Status.label}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/40">•</span>
                      <span className="text-[9px] font-bold text-muted-foreground/60 truncate">{candidate.appliedJobTitle || "Ümumi Baza"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative w-10 h-10 flex items-center justify-center font-black text-[10px] text-foreground shrink-0 bg-muted/20 dark:bg-white/5 rounded-full border border-border/50 dark:border-white/5">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-muted/10 dark:text-white/5 stroke-current" strokeWidth="12" cx="50" cy="50" r="40" fill="transparent" />
                    <circle 
                      className={cn(
                        "stroke-current transition-all duration-1000",
                        candidate.matchingScore > 80 ? "text-emerald-500" : 
                        candidate.matchingScore > 50 ? "text-orange-500" : "text-red-500"
                      )}
                      strokeWidth="12" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                      strokeDasharray={`${candidate.matchingScore * 2.51} 251`}
                    />
                  </svg>
                  {candidate.matchingScore}%
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border dark:border-white/5 flex items-center justify-between relative z-10">
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded-lg bg-muted dark:bg-white/5 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tight border border-border dark:border-white/5">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 2 && (
                    <span className="text-[9px] font-bold text-muted-foreground/20 self-center ml-1">
                      +{candidate.skills.length - 2}
                    </span>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl bg-muted/20 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal size={14} className="text-muted-foreground/60" />
                    </Button>
                  } />
                  <DropdownMenuContent align="end" className="w-52 rounded-[24px] p-2 bg-card dark:bg-[#0f172a] border-border dark:border-white/5 shadow-2xl backdrop-blur-2xl">
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetails(candidate); }} className="rounded-xl font-bold gap-3 px-4 py-2.5 text-xs">
                        <ExternalLink size={14} className="opacity-60" /> Profili Gör
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownloadCV(candidate.name); }} className="rounded-xl font-bold gap-3 px-4 py-2.5 text-xs">
                        <FileUp size={14} className="opacity-60" /> CV-ni Yüklə
                     </DropdownMenuItem>
                     <DropdownMenuSeparator className="my-1.5 bg-border dark:bg-white/5" />
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(candidate.id, "Rejected"); }} className="rounded-xl font-black text-red-500 gap-3 px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-950/20">
                        <XCircle size={14} /> Rədd Et
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    );
          })}
        </div>
      </div>


      <CandidateDetailsDrawer 
        candidate={selectedCandidate}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={(status) => selectedCandidate && handleStatusChange(selectedCandidate.id, status)}
        onDownloadCV={() => selectedCandidate && handleDownloadCV(selectedCandidate.name)}
      />
    </div>
  );
}
