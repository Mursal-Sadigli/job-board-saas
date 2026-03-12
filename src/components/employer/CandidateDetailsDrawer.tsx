"use client";

import { 
  X, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Star,
  Download,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  ChevronRight,
  Info,
  Clock,
  Search,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Candidate, CandidateStatus } from "@/types/ats";
import { cn } from "@/utils/cn";

interface CandidateDetailsDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: CandidateStatus) => void;
  onDownloadCV: () => void;
}

const STATUS_CONFIG: Record<CandidateStatus, { label: string; icon: any; color: string; bg: string }> = {
  Applied: { label: "Müraciət", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  Screening: { label: "Seçim", icon: Search, color: "text-purple-500", bg: "bg-purple-500/10" },
  Interview: { label: "Müsahibə", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  Offered: { label: "Təklif", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Hired: { label: "İşə Alındı", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  Rejected: { label: "İmtina", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export function CandidateDetailsDrawer({ 
  candidate, 
  open, 
  onOpenChange,
  onStatusChange,
  onDownloadCV
}: CandidateDetailsDrawerProps) {
  if (!candidate) return null;

  const Status = STATUS_CONFIG[candidate.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 border-l border-border dark:border-white/10 bg-background overflow-hidden flex flex-col shadow-2xl transition-all duration-300">
        {/* Superior Header with Gradient and Navigation */}
        <div className="relative h-40 sm:h-44 bg-linear-to-br from-primary via-primary/80 to-primary/40 p-5 sm:p-7 flex flex-col justify-between overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          <div className="flex items-center justify-between relative z-10">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-2.5 py-0.5 font-bold tracking-wider text-[9px] uppercase">
              Namizəd Kartı
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors h-8 w-8 sm:h-9 sm:w-9"
            >
              <X size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 relative z-10 mt-auto">
             <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white border-4 border-white/20 shadow-2xl flex items-center justify-center text-primary text-lg sm:text-2xl font-black shrink-0 animate-in fade-in zoom-in duration-500">
                {candidate.name.split(" ").map(n => n[0]).join("")}
             </div>
             <div className="text-white space-y-0.5 min-w-0">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight truncate">{candidate.name}</h2>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-bold text-white/80 truncate max-w-[120px]">{candidate.appliedJobTitle || "Ümumi Baza"}</span>
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-white/60 tracking-widest uppercase">ID: {candidate.id.slice(0, 8)}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-card/30 dark:bg-black/20">
          <div className="p-4 sm:p-7 space-y-6 sm:space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
               <div className="bg-card dark:bg-white/5 p-2.5 sm:p-3 rounded-xl border border-border dark:border-white/10 shadow-sm flex flex-col gap-1 items-center text-center group hover:border-primary/50 transition-colors min-w-0">
                  <Status.icon size={14} className={cn(Status.color, "opacity-70 shrink-0")} />
                  <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate w-full">Status</span>
                  <span className={cn("text-[10px] sm:text-xs font-black truncate w-full", Status.color)}>{Status.label}</span>
               </div>
               <div className="bg-card dark:bg-white/5 p-2.5 sm:p-3 rounded-xl border border-border dark:border-white/10 shadow-sm flex flex-col gap-1 items-center text-center group hover:border-primary/50 transition-colors min-w-0">
                  <Star size={14} className="text-amber-400 opacity-70 shrink-0" />
                  <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate w-full">Uyğunluq</span>
                  <span className="text-[10px] sm:text-xs font-black text-foreground truncate w-full">{candidate.matchingScore}%</span>
               </div>
               <div className="bg-card dark:bg-white/5 p-2.5 sm:p-3 rounded-xl border border-border dark:border-white/10 shadow-sm flex flex-col gap-1 items-center text-center group hover:border-primary/50 transition-colors min-w-0">
                  <Briefcase size={14} className="text-primary opacity-70 shrink-0" />
                  <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate w-full">Təcrübə</span>
                  <span className="text-[10px] sm:text-xs font-black text-foreground truncate w-full">{candidate.experienceYears}+ il</span>
               </div>
               <div className="bg-card dark:bg-white/5 p-2.5 sm:p-3 rounded-xl border border-border dark:border-white/10 shadow-sm flex flex-col gap-1 items-center text-center group hover:border-primary/50 transition-colors min-w-0">
                  <MapPin size={14} className="text-foreground opacity-30 shrink-0" />
                  <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate w-full">Məkan</span>
                  <span className="text-[10px] sm:text-xs font-black text-foreground truncate w-full">{candidate.location.split(",")[0]}</span>
               </div>
            </div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 gap-8">
              {/* Core Info */}
              <div className="space-y-8">
                
                {/* Contact & Professional Info Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border dark:border-white/5">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 px-1">
                       <Mail size={10} /> Əlaqə
                    </h3>
                    <div className="space-y-3 px-1">
                       <div className="flex flex-col">
                          <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground/60 uppercase">Email</span>
                          <span className="text-xs sm:text-sm font-bold text-foreground truncate">{candidate.email}</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground/60 uppercase">Məkan</span>
                          <span className="text-xs sm:text-sm font-bold text-foreground truncate">{candidate.location}</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 px-1">
                       <GraduationCap size={12} /> Təhsil
                    </h3>
                    <div className="space-y-3 px-1">
                       {candidate.education.map((edu, idx) => (
                         <div key={idx} className="flex items-start gap-2.5">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <p className="text-[11px] sm:text-xs font-bold text-foreground leading-snug">{edu}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 px-1">
                     <Star size={10} /> Bacarıqlar
                  </h3>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {candidate.skills.map(skill => (
                      <div key={skill} className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black border border-primary/10 hover:bg-primary hover:text-white transition-all duration-300">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Breakdown */}
                <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-br from-card to-muted/20 border border-border dark:border-white/10 shadow-inner space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Analiz Hesabatı</h3>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                       <CheckCircle2 size={10} className="text-emerald-500" />
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Tam</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    AI təhlili: Təcrübə vakansiya ilə <strong>{candidate.matchingScore}%</strong> uyğundur.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-background border-t border-border dark:border-white/10 shrink-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="flex gap-2 flex-1 min-w-0">
              <Button 
                onClick={() => onStatusChange("Interview")}
                className="flex-1 rounded-xl sm:rounded-2xl font-black bg-foreground text-background hover:bg-primary hover:text-white transition-all h-10 sm:h-12 text-xs sm:text-sm gap-2 shadow-xl shadow-foreground/5 truncate px-3"
              >
                Müsahibə
              </Button>
              <Button 
                onClick={onDownloadCV}
                variant="outline"
                className="hidden sm:flex rounded-2xl font-black border-border h-12 px-5 gap-2 shrink-0 text-sm"
              >
                <Download size={16} />
                CV
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" className="rounded-xl sm:rounded-2xl h-10 w-10 sm:h-12 sm:w-12 border border-muted-foreground/10 shrink-0">
                   <Info size={18} className="text-muted-foreground" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border bg-card shadow-2xl">
                 <DropdownMenuItem onClick={() => onStatusChange("Offered")} className="rounded-xl px-4 py-3 font-bold gap-3 cursor-pointer">
                    <Star size={16} className="text-emerald-500" /> İş Təklif Et
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => onStatusChange("Rejected")} className="rounded-xl px-4 py-3 font-bold gap-3 text-red-500 hover:bg-red-500/10 cursor-pointer">
                    <XCircle size={16} /> İmtina Et
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Sub-components for better organization
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
