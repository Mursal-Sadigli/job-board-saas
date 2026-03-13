"use client";

import { useState } from "react";
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
  CalendarPlus
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

// Qeyd: 'role' və 'tags' lokal göstərim üçündür, lakin Candidate interfeysini qırmamaq üçün any asertiyası ilə genişləndirilir. 
type TalentCandidate = Candidate & { role?: string; tags?: string[] };

const MOCK_TALENT_POOL: TalentCandidate[] = [
  { id: "tp1", name: "Rüstəm Qasımov", email: "rustam@example.com", location: "Bakı, Azərbaycan", role: "DevOps Engineer", experienceYears: 8, tags: ["Kubernetes", "AWS", "Terraform"], skills: ["Kubernetes", "AWS", "Terraform"], education: ["Bakalavr"], matchingScore: 92, status: "Hired", appliedAt: "2025-01-10", appliedJobTitle: "DevOps Engineer", analysisStatus: "completed" },
  { id: "tp2", name: "Günay Əliyeva", email: "gunay@example.com", location: "Sumqayıt, Azərbaycan", role: "Frontend Lead", experienceYears: 6, tags: ["React", "Architecture", "Mentoring"], skills: ["React", "Architecture", "Mentoring"], education: ["Magistr"], matchingScore: 88, status: "Offered", appliedAt: "2025-02-15", appliedJobTitle: "Frontend Lead", analysisStatus: "completed" },
  { id: "tp3", name: "Fərid Məmmədov", email: "farid@example.com", location: "Gəncə, Azərbaycan", role: "Mobile Developer", experienceYears: 4, tags: ["Flutter", "Dart", "Firebase"], skills: ["Flutter", "Dart", "Firebase"], education: ["Bakalavr"], matchingScore: 75, status: "Interview", appliedAt: "2025-03-01", appliedJobTitle: "Mobile Developer", analysisStatus: "completed" },
  { id: "tp4", name: "Səbinə Rəhimova", email: "sabina@example.com", location: "Bakı, Azərbaycan", role: "QA Automation", experienceYears: 5, tags: ["Selenium", "Python", "Testing"], skills: ["Selenium", "Python", "Testing"], education: ["Bakalavr"], matchingScore: 85, status: "Applied", appliedAt: "2025-03-05", appliedJobTitle: "QA Automation", analysisStatus: "completed" },
];

export default function TalentPoolPage() {
  const [candidates, setCandidates] = useState<TalentCandidate[]>(MOCK_TALENT_POOL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<TalentCandidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewCandidateName, setInterviewCandidateName] = useState("");
  const [filters, setFilters] = useState({
    status: [] as CandidateStatus[],
    experience: "all",
    minScore: 0,
    location: ""
  });

  const handleAnalysisComplete = (data: any) => {
    const newCandidate: TalentCandidate = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      location: "Bakı, Azərbaycan",
      experienceYears: data.experienceYears,
      skills: data.skills,
      tags: data.skills.slice(0, 3), // Tags adaptasiyası
      education: ["Məlumat yoxdur"],
      matchingScore: data.matchingScore,
      analysisStatus: "completed",
      appliedAt: new Date().toISOString(),
      status: "Applied",
      appliedJobTitle: "Ümumi İstedad Hovuzu"
    };
    setCandidates(prev => [newCandidate, ...prev]);
    toast({
      title: "Namizəd Əlavə Edildi",
      description: `${data.name} uğurla istedad hovuzuna daxil edildi.`,
      type: "success"
    });
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

  const handleRemove = (id: string, name: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Namizəd Silindi",
      description: `${name} hovuzdan uğurla çıxarıldı.`,
    });
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
        toast({ title: "Paylaşıldı", description: "Profil uğurla paylaşıldı." });
      } catch (err) {
        // İmtina etdikdə heç nə etmə
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Kopyalandı",
        description: "Namizədin linki müvəffəqiyyətlə buferə kopyalandı.",
      });
    }
  };

  const handleExport = () => {
    // CSV formatında hazırlanan data
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
    // Search Query (Name, Skills, Role)
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c as any).role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div className="p-6 pt-24 lg:p-10 lg:pt-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-16 sm:pl-0">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">İstedad Hovuzu</h1>
          <p className="text-sm text-muted-foreground mt-1">Gələcək vakansiyalar üçün potensial namizədlər bazası</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="flex-1 sm:flex-initial rounded-xl gap-2 font-bold text-xs sm:text-sm h-11 px-3 sm:px-5 border-border dark:border-white/10"
          >
            <Download size={16} />
            <span className="hidden xs:inline">Eksport</span>
            <span className="xs:hidden">CSV</span>
          </Button>
          <Button 
            onClick={() => setAnalysisOpen(true)}
            className="flex-1 sm:flex-initial rounded-xl gap-2 font-bold text-xs sm:text-sm h-11 px-3 sm:px-5 shadow-xl shadow-primary/10"
          >
            <UserPlus size={16} />
            <span className="hidden xs:inline">Namizəd Əlavə Et</span>
            <span className="xs:hidden">Əlavə et</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col xs:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" size={18} />
          <Input 
            placeholder="Axtar..." 
            className="pl-12 h-12 rounded-2xl bg-card border-border dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setFiltersOpen(true)}
          className={cn(
            "h-12 px-4 rounded-2xl gap-2 border-border dark:border-white/10 font-bold text-sm shrink-0",
            (filters.status.length > 0 || filters.experience !== "all" || filters.minScore > 0 || filters.location) && "bg-primary/5 border-primary text-primary"
          )}
        >
          <Filter size={18} />
          <span className="hidden xs:inline">Filtrlər</span>
          {(filters.status.length > 0 || filters.experience !== "all" || filters.minScore > 0 || filters.location) && (
            <span className="ml-1 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Talent Cards List - Stuck together style */}
      <div className="flex flex-col border border-border dark:border-white/10 rounded-3xl bg-card overflow-hidden divide-y divide-border dark:divide-white/5 shadow-sm">
        {filteredCandidates.map((talent) => {
          const ratingStars = Math.round(talent.matchingScore / 20); // Simulating 5-star rating scale
          const displayStatus = talent.status === "Offered" || talent.status === "Hired" ? "Məşğul" : "Açıq";

          return (
          <div key={talent.id} className="group p-4 sm:p-5 bg-card hover:bg-muted/30 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 md:gap-6" onClick={() => openDetails(talent)}>
            
            {/* Avatar & Info */}
            <div className="flex items-center justify-between md:justify-start gap-4 md:w-[30%] shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner shrink-0 text-lg font-black uppercase">
                  {talent.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">{talent.name}</h3>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider line-clamp-1">{(talent as any).role || talent.appliedJobTitle}</p>
                </div>
              </div>
              {/* Mobile Only Status Badge */}
              <div className="md:hidden flex flex-col items-end gap-1">
                 <Badge className={cn("rounded-lg px-2 py-0.5 font-bold text-[9px] uppercase tracking-tighter", displayStatus === "Açıq" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500")}>
                    {displayStatus}
                 </Badge>
              </div>
            </div>

            {/* Tags - Hidden on small mobile, visible on desktop */}
            <div className="hidden sm:flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
              {talent.skills.slice(0, 4).map(tag => (
                <div key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/40 text-muted-foreground text-[10px] font-bold border border-border/50 whitespace-nowrap">
                  {tag}
                </div>
              ))}
              {talent.skills.length > 4 && (
                <div className="px-2 py-1 rounded-lg bg-muted/20 text-muted-foreground text-[10px] font-bold border border-border/30">
                  +{talent.skills.length - 4}
                </div>
              )}
            </div>

            {/* Actions & Meta */}
            <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 shrink-0 border-t border-border/50 md:border-none pt-3 md:pt-0 mt-1 md:mt-0">
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg text-amber-500">
                  <Star size={12} className="fill-amber-500" />
                  <span className="text-xs font-black">{ratingStars}.0</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">
                  <ShieldCheck size={12} />
                  <span className="text-[10px] sm:text-xs font-bold">{talent.experienceYears} il</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="hidden md:block mr-2">
                  <Badge className={cn("rounded-lg px-2 py-1 font-bold text-[9px] uppercase tracking-tighter shrink-0", displayStatus === "Açıq" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500")}>
                    {displayStatus}
                  </Badge>
                </div>

                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${talent.email}`;
                    toast({
                       title: "E-poçt ünvanı hazırlandı",
                       description: "Poçt xidmətiniz açılır...",
                    });
                  }}
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                >
                  <Mail size={16} />
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); openDetails(talent); }}
                  className="h-9 px-4 rounded-xl font-bold bg-foreground text-background hover:opacity-90 hidden sm:flex text-xs transition-all active:scale-95"
                >
                  Profil
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className="flex text-muted-foreground items-center justify-center rounded-xl h-9 w-9 hover:bg-muted dark:hover:bg-white/5 outline-none focus:outline-none transition-colors border border-transparent hover:border-border" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem 
                      onClick={() => {
                        setInterviewCandidateName(talent.name);
                        setInterviewModalOpen(true);
                      }}
                      className="gap-2 cursor-pointer font-medium p-2.5"
                    >
                      <CalendarPlus size={15} className="text-primary" />
                      <span>Müsahibəyə dəvət et</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleShare(talent.id, talent.name)}
                      className="gap-2 cursor-pointer font-medium p-2.5"
                    >
                      <Share2 size={15} className="text-muted-foreground" />
                      <span>Profili bölüş</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleRemove(talent.id, talent.name)}
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-bold p-2.5"
                    >
                      <Trash2 size={15} />
                      <span>Hovuzdan sil</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )})}
      </div>

      {filteredCandidates.length === 0 && (
         <div className="flex flex-col items-center justify-center py-16 text-center rounded-4xl border border-dashed border-border dark:border-white/10 bg-card/50">
           <Search size={32} className="text-muted-foreground/30 mb-4" />
           <p className="text-sm font-bold text-foreground">Uyğun namizəd tapılmadı</p>
           <p className="text-xs text-muted-foreground mt-1">Axtarış sözlərini və ya filtrləri dəyişin</p>
         </div>
      )}

      {/* Empty State / More info */}
      <div 
        onClick={() => setAnalysisOpen(true)}
        className="cursor-pointer p-8 rounded-4xl bg-linear-to-r from-primary/5 via-transparent to-primary/5 border border-dashed border-border dark:border-white/10 flex flex-col items-center justify-center text-center space-y-4 hover:bg-primary/5 transition-colors"
      >
        <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground">
           <Plus size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Daha çox namizəd əlavə edin</p>
          <p className="text-xs text-muted-foreground mt-1">Gələcəyin ulduzlarını hovuzda saxlayın</p>
        </div>
      </div>

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
        onSuccess={(data) => {
          // Statusu tapan və dəyişən vizual geribildirim
          const candidate = candidates.find(c => c.name === data.candidateName);
          if (candidate) handleStatusChange(candidate.id, "Interview");
        }}
      />
    </div>
  );
}
