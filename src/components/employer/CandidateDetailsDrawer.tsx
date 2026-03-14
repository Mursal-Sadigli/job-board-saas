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
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/paths";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OfferModal } from "./OfferModal";
import { useState } from "react";

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
  const router = useRouter();
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  if (!candidate) return null;

  const Status = STATUS_CONFIG[candidate.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent showCloseButton={false} className="w-full sm:max-w-xl p-0 border-l border-border dark:border-white/10 bg-background dark:bg-[#020617] overflow-hidden flex flex-col shadow-2xl transition-all duration-300">
        {/* Superior Header - Lighter Mimicking user image */}
        <div className="relative h-44 sm:h-52 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900/40 dark:via-slate-900/20 dark:to-[#020617] p-5 sm:p-8 flex flex-col justify-between overflow-hidden shrink-0 border-b border-black/5 dark:border-white/5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.pattern')] opacity-5 mix-blend-overlay" />
          
          <div className="flex items-center justify-between relative z-10">
            <Badge className="bg-black/5 dark:bg-white/10 backdrop-blur-md text-black/60 dark:text-white/60 border-transparent px-3 py-1 font-black tracking-[0.2em] text-[9px] uppercase rounded-full">
              NAMİZƏD KARTI
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black/40 dark:text-white transition-colors h-9 w-9"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex items-center gap-5 sm:gap-6 relative z-10 mt-auto">
             <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-2xl bg-white dark:bg-white/10 dark:backdrop-blur-2xl border-4 border-white dark:border-white/10 shadow-2xl flex items-center justify-center text-slate-400 dark:text-white/40 text-xl sm:text-2xl font-black shrink-0 animate-in fade-in zoom-in duration-500">
                {candidate.name.split(" ").map(n => n[0]).join("")}
             </div>
             <div className="text-slate-800 dark:text-white space-y-1 min-w-0 pb-1">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight truncate">{candidate.name}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-white/40 truncate max-w-[150px]">{candidate.appliedJobTitle || "Ümumi Baza"}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-white/20 tracking-widest uppercase">ID: {candidate.id.slice(0, 8)}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area - Deep Dark Background */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white dark:bg-[#020617]">
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Quick Stats Grid - Mimicking shэkil structure */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
               <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col gap-1 items-center text-center group transition-all min-w-0 backdrop-blur-3xl">
                  <Status.icon size={18} className={cn(Status.color, "opacity-80 shrink-0")} />
                  <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mt-1 shrink-0">STATUS</span>
                  <span className={cn("text-xs font-black truncate w-full", Status.color)}>{Status.label}</span>
               </div>
               <div className="bg-slate-50 dark:bg-white/3 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col gap-1 items-center text-center group transition-all min-w-0">
                  <Star size={18} className="text-amber-400 opacity-80 shrink-0" />
                  <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mt-1 shrink-0">UYĞUNLUQ</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">{candidate.matchingScore}%</span>
               </div>
               <div className="bg-slate-50 dark:bg-white/3 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col gap-1 items-center text-center group transition-all min-w-0">
                  <Briefcase size={18} className="text-slate-400 dark:text-white/30 opacity-80 shrink-0" />
                  <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mt-1 shrink-0">TƏCRÜBƏ</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">{candidate.experienceYears}+ il</span>
               </div>
               <div className="bg-slate-50 dark:bg-white/3 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col gap-1 items-center text-center group transition-all min-w-0">
                  <MapPin size={18} className="text-slate-400 dark:text-white/30 opacity-80 shrink-0" />
                  <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mt-1 shrink-0">MƏKAN</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">{candidate.location.split(",")[0]}</span>
               </div>
            </div>

            {/* Sub-sections like in image */}
            <div className="space-y-10">
               {/* Contact Info */}
               <div className="space-y-5 px-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40 flex items-center gap-3">
                     <Mail size={12} strokeWidth={3} /> ƏLAQƏ
                  </h3>
                  <div className="space-y-4">
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest">EMAIL</span>
                        <span className="text-sm font-black text-slate-700 dark:text-white tracking-tight">{candidate.email}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest">MƏKAN</span>
                        <span className="text-sm font-black text-slate-700 dark:text-white tracking-tight">{candidate.location}</span>
                     </div>
                  </div>
               </div>

               {/* Education */}
               <div className="space-y-5 px-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40 flex items-center gap-3">
                     <GraduationCap size={14} strokeWidth={3} /> TƏHSİL
                  </h3>
                  <div className="space-y-4">
                      {candidate.education.map((edu, idx) => {
                        const eduText = typeof edu === 'string' ? edu : `${edu.degree} - ${edu.school}`;
                        return (
                          <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:border-primary/20 transition-all">
                             <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-primary shrink-0 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                                <GraduationCap size={16} />
                             </div>
                             <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-slate-700 dark:text-white leading-tight tracking-tight italic truncate">
                                  {typeof edu === 'string' ? edu : edu.degree}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-tighter mt-1 truncate">
                                  {typeof edu === 'string' ? "Məlumat yoxdur" : edu.school}
                                </p>
                             </div>
                          </div>
                        );
                      })}
                  </div>
               </div>

               {/* Skills */}
               <div className="space-y-5 px-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40 flex items-center gap-3">
                     <Star size={12} strokeWidth={3} /> BACARIQLAR
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map(skill => (
                      <div key={skill} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white text-[10px] font-black border border-slate-200 dark:border-white/10 tracking-tight transition-all active:scale-95">
                        {skill}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Action Footer - Mimicking white button in image */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#020617] border-t border-slate-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                onStatusChange("Interview");
                toast({
                  title: "Müsahibə Mərhələsi",
                  description: `${candidate.name} müsahibə mərhələsinə keçirildi.`,
                  type: "success",
                  action: {
                    label: "Təqvimdə Gör",
                    onClick: () => router.push(ROUTES.employer.ats.interviews)
                  }
                });
              }}
              className="flex-1 rounded-2xl font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all h-14 text-sm shadow-2xl shadow-black/10 dark:shadow-white/5"
            >
              Müsahibə
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger render={
               <Button variant="ghost" className="rounded-2xl h-14 w-14 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                   <Info size={20} className="text-slate-400 dark:text-white/40" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56 p-2.5 rounded-[24px] border-slate-200 dark:border-white/10 bg-white dark:bg-[#020617] shadow-2xl backdrop-blur-3xl">
                 <DropdownMenuItem 
                   onClick={() => setOfferModalOpen(true)} 
                   className="rounded-xl px-4 py-3 font-black gap-3 cursor-pointer text-xs"
                 >
                    <Star size={16} className="text-emerald-500" /> İŞ TƏKLİF ET
                 </DropdownMenuItem>
                 <DropdownMenuItem 
                   onClick={() => {
                     onStatusChange("Rejected");
                     toast({
                       title: "Müraciət İmtina Edildi",
                       description: `${candidate.name} müraciətinə imtina verildi.`,
                       type: "error"
                     });
                   }} 
                   className="rounded-xl px-4 py-3 font-black gap-3 text-red-500 hover:bg-red-500/10 cursor-pointer text-xs"
                 >
                    <XCircle size={16} /> İMTİNA ET
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <OfferModal 
            open={offerModalOpen}
            onOpenChange={setOfferModalOpen}
            candidate={candidate}
            onSuccess={() => onStatusChange("Offered")}
        />
      </SheetContent>
    </Sheet>
  );
}
