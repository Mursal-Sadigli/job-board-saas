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
  ExternalLink
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
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Namizədlər</h1>
          <p className="text-sm text-muted-foreground mt-1">Bütün müraciətlər və namizəd bazası</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl gap-2 font-bold text-sm h-11 px-5 border-border dark:border-white/10">
            <Filter size={16} />
            Filtrlər
          </Button>
          <Button 
            onClick={() => setAnalysisOpen(true)}
            className="rounded-xl gap-2 font-bold text-sm h-11 px-5 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          >
            <FileUp size={16} />
            CV Yüklə və Analiz Et
          </Button>
        </div>
      </div>

      <ResumeAnalysisModal 
        open={analysisOpen} 
        onOpenChange={setAnalysisOpen} 
        onAnalysisComplete={handleAnalysisComplete} 
      />

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" size={18} />
          <Input 
            placeholder="Ada, email-ə və ya bacarığa görə axtar..." 
            className="pl-12 h-12 rounded-2xl bg-card border-border dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-12 flex items-center justify-between px-6 rounded-2xl bg-muted/30 border border-border dark:border-white/10">
          <span className="text-xs font-black uppercase text-muted-foreground/40 tracking-widest">Cəmi:</span>
          <span className="text-lg font-black text-foreground">{filteredCandidates.length}</span>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-card dark:bg-[#0f1423] rounded-3xl border border-border dark:border-white/10 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-white/10 bg-muted/20">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Namizəd</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Status / Vakansiya</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Uyğunluq</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Bacarıqlar</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5">
              {filteredCandidates.map((candidate) => {
                const Status = STATUS_CONFIG[candidate.status];
                return (
                  <tr key={candidate.id} className="group hover:bg-muted/30 transition-all duration-300">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-inner">
                          {candidate.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-foreground truncate">{candidate.name}</span>
                          <span className="text-xs text-muted-foreground truncate font-medium flex items-center gap-1">
                            <Mail size={12} className="opacity-50" />
                            {candidate.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit",
                          Status.bg, Status.color
                        )}>
                          <Status.icon size={12} />
                          {Status.label}
                        </div>
                        <span className="text-xs font-bold text-muted-foreground truncate max-w-[150px]">
                          {candidate.appliedJobTitle || "Ümumi Baza"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="relative w-12 h-12 flex items-center justify-center font-black text-xs text-foreground group-hover:scale-110 transition-transform">
                          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle 
                              className="text-muted/30 stroke-current" 
                              strokeWidth="10" 
                              cx="50" cy="50" r="40" fill="transparent" 
                            />
                            <circle 
                              className={cn(
                                "stroke-current transition-all duration-1000",
                                candidate.matchingScore > 80 ? "text-emerald-500" : 
                                candidate.matchingScore > 50 ? "text-orange-500" : "text-red-500"
                              )}
                              strokeWidth="10" 
                              strokeLinecap="round"
                              cx="50" cy="50" r="40" fill="transparent"
                              strokeDasharray={`${candidate.matchingScore * 2.51} 251`}
                            />
                          </svg>
                          {candidate.matchingScore}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {candidate.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="text-[10px] font-bold text-muted-foreground opacity-60">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-muted">
                            <MoreHorizontal size={18} className="text-muted-foreground" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-border dark:border-white/10 shadow-2xl bg-card dark:bg-[#0f1423]">
                          <DropdownMenuItem 
                            onClick={() => openDetails(candidate)}
                            className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all font-medium text-sm"
                          >
                            <ExternalLink size={16} className="text-muted-foreground opacity-60" />
                            Profili Gör
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDownloadCV(candidate.name)}
                            className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all font-medium text-sm"
                          >
                            <FileUp size={16} className="text-muted-foreground opacity-60" />
                            CV-ni Yüklə
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-border dark:bg-white/10" />
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(candidate.id, "Rejected")}
                            className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-semibold text-sm"
                          >
                            <XCircle size={16} />
                            Rədd Et
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
