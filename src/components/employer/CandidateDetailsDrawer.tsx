"use client";

import { 
  X, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  Star,
  Download,
  CheckCircle2,
  XCircle,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Candidate, CandidateStatus } from "@/types/ats";
import { cn } from "@/utils/cn";

interface CandidateDetailsDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: CandidateStatus) => void;
  onDownloadCV: () => void;
}

const STATUS_CONFIG: Record<CandidateStatus, { label: string; color: string; bg: string }> = {
  Applied: { label: "Müraciət", color: "text-blue-500", bg: "bg-blue-500/10" },
  Screening: { label: "Seçim", color: "text-purple-500", bg: "bg-purple-500/10" },
  Interview: { label: "Müsahibə", color: "text-orange-500", bg: "bg-orange-500/10" },
  Offered: { label: "Təklif", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Hired: { label: "İşə Alındı", color: "text-green-500", bg: "bg-green-500/10" },
  Rejected: { label: "İmtina", color: "text-red-500", bg: "bg-red-500/10" },
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
      <SheetContent className="w-full sm:max-w-xl p-0 border-l border-border dark:border-white/10 bg-background overflow-y-auto custom-scrollbar">
        {/* Header/Cover */}
        <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-background relative">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur-md shadow-sm"
           >
             <X size={20} />
           </Button>
        </div>

        <div className="px-8 pb-10 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-4xl bg-card border-4 border-background flex items-center justify-center text-primary text-3xl font-black shadow-2xl">
                {candidate.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-black text-foreground">{candidate.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider", Status.bg, Status.color)}>
                    {Status.label}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">ID: {candidate.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={onDownloadCV} variant="outline" className="rounded-xl font-bold border-border dark:border-white/10 gap-2 h-11">
                <Download size={18} />
                CV Yüklə
              </Button>
              <Button className="rounded-xl font-bold bg-primary text-primary-foreground h-11 shadow-lg shadow-primary/20">
                Müsahibə Təyin Et
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Details */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Əlaqə Məlumatları</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <Mail size={16} />
                    </div>
                    <span className="font-bold text-foreground">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <MapPin size={16} />
                    </div>
                    <span className="font-bold text-foreground">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <Phone size={16} />
                    </div>
                    <span className="font-bold">Məlumat yoxdur</span>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Bacarıqlar</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(skill => (
                    <div key={skill} className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Təhsil</h3>
                <div className="space-y-4">
                  {candidate.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="mt-1">
                        <GraduationCap size={16} className="text-primary" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{edu}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Workflow & Scoring */}
            <div className="space-y-8">
              <div className="p-6 rounded-3xl bg-card border border-border dark:border-white/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Uyğunluq Reytinqi</h3>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-black">{candidate.matchingScore}%</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      candidate.matchingScore > 80 ? "bg-emerald-500" : "bg-orange-500"
                    )}
                    style={{ width: `${candidate.matchingScore}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">Bu namizəd texniki bacarıqlarına görə vakansiya tələbləri ilə yüksək dərəcədə üst-üstə düşür.</p>
              </div>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Statusu Dəyiş</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => onStatusChange("Interview")}
                    className="justify-start gap-3 rounded-xl border-border h-12 font-bold hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30 transition-all"
                  >
                    <Briefcase size={18} />
                    Müsahibəyə Çağır
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onStatusChange("Offered")}
                    className="justify-start gap-3 rounded-xl border-border h-12 font-bold hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                  >
                    <Star size={18} />
                    İş Təklif Et
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onStatusChange("Rejected")}
                    className="justify-start gap-3 rounded-xl border-border h-12 font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                  >
                    <XCircle size={18} />
                    İmtina Et
                  </Button>
                </div>
              </section>

              <div className="p-6 rounded-3xl border border-dashed border-border dark:border-white/10 flex flex-col items-center justify-center text-center space-y-3">
                 <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                    <LinkIcon size={20} />
                 </div>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 leading-relaxed">LinkedIn və ya digər sosial profillər tapılmadı</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
