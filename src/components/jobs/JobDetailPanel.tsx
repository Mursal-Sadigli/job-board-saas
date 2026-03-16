"use client";

import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import { formatRelativeTime } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import {
  MapPin,
  Briefcase,
  Clock,
  Award,
  Building,
  Globe,
  Network,
  Banknote,
  X,
  Layers,
} from "lucide-react";
import { ApplyModal } from "@/components/jobs/ApplyModal";

interface JobDetailPanelProps {
  job: Job;
  onClose?: () => void;
  onApply?: () => void;
}

const locationTypeConfig = {
  "in-office": { label: "Ofisdə", icon: <Building size={12} /> },
  hybrid: { label: "Hibrid", icon: <Network size={12} /> },
  remote: { label: "Uzaqdan", icon: <Globe size={12} /> },
  any: { label: "İstənilən", icon: <MapPin size={12} /> },
};

const jobTypeConfig: Record<string, string> = {
  "full-time": "Tam iş günü",
  "part-time": "Yarımştat",
  contract: "Müqavilə",
  internship: "Təcrübəçi",
  any: "İstənilən",
};

const expLevelConfig: Record<string, string> = {
  junior: "Junior",
  mid: "Mid Level",
  senior: "Senior",
  lead: "Lead",
  any: "İstənilən",
};

export default function JobDetailPanel({ job, onClose, onApply }: JobDetailPanelProps) {
  const [logoError, setLogoError] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const locConfig = locationTypeConfig[job.locationType] || locationTypeConfig.any;
  const expLabel = expLevelConfig[job.experienceLevel] || expLevelConfig.any;
  const showLogo = job.companyLogo && !logoError;

  const handleApplySuccess = () => {
    setIsApplied(true);
    // Müraciət uğurlu olandan sonra dərhal paneli bağlamaq əvəzinə,
    // istifadəçiyə uğur mesajını görməyə imkan veririk.
    // onApply?.();
  };

  useEffect(() => {
    // Only increment view if we have a valid job id
    if (!job?.id) return;
    
    const incrementView = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        await fetch(`${API_BASE}/api/jobs/${job.id}/view`, { method: "POST" });
      } catch (err) {
        console.error("Failed to increment job view", err);
      }
    };
    
    incrementView();
  }, [job?.id]);

  return (
    <div className="flex flex-col h-full bg-card dark:bg-[#0b0e14] border-l border-border dark:border-white/10 relative overflow-hidden backdrop-blur-xl">
      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar w-full flex flex-col">
        {/* Header Section */}
        <div className="px-6 pt-8 pb-6 relative border-b border-border/40 dark:border-white/5">
          {/* Minimalist Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted transition-all text-muted-foreground/30 hover:text-foreground active:scale-90 z-10 bg-background/50 dark:bg-white/5"
            >
              <X size={20} strokeWidth={2} />
            </button>
          )}

          {/* Company + Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-card dark:bg-[#0f1423] border border-border/60 dark:border-white/10 overflow-hidden flex items-center justify-center shadow-sm group">
              {showLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-contain p-2.5 sm:p-3 transition-transform group-hover:scale-110"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-black text-2xl text-muted-foreground/20">
                  {job.company[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-10">
              <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-foreground break-words overflow-wrap-anywhere whitespace-normal">
                {job.title}
              </h2>
              <p className="text-sm sm:text-base font-semibold mt-1 text-muted-foreground/80 break-words whitespace-normal">
                {job.company}
              </p>
            </div>
          </div>

          {/* Date */}
          <p className="text-[10px] sm:text-[11px] font-semibold mb-5 text-muted-foreground/40 uppercase tracking-widest">
            {formatRelativeTime(job.postedAt)}
          </p>

          {/* Badges Stack */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {job.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 border border-purple-500/20 shadow-sm shadow-purple-500/5 dark:text-purple-400">
                <Award size={12} />
                Önə çıxan
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30">
              <MapPin size={12} />
              {job.city || job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border bg-slate-500/5 text-slate-600 dark:text-slate-400 border-border/50 dark:border-white/10">
              <span className="shrink-0">{locConfig.icon}</span>
              {locConfig.label}
            </span>
            {job.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30">
                <Layers size={12} />
                {job.category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30">
              <Briefcase size={12} />
              {jobTypeConfig[job.jobType] || jobTypeConfig.any}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30">
              <Clock size={12} />
              {expLabel}
            </span>
            {job.salary && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border bg-card dark:bg-[#0f1423] text-foreground border-border dark:border-white/10 shadow-sm">
                <Banknote size={12} className="text-muted-foreground/60" />
                {job.salary}
              </span>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="px-5 sm:px-6 py-10 pb-28 w-full max-w-full box-border">
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/30 mb-8 font-jakarta">İş haqqında məlumat</h3>
          {job.description ? (
            <div
              className="prose prose-sm sm:prose-base dark:prose-invert w-full max-w-full"
              style={{ 
                wordBreak: 'break-word', 
                overflowWrap: 'anywhere', 
                whiteSpace: 'normal',
                display: 'block'
              }}
            >
              <div 
                className="w-full max-w-full overflow-x-clip
                  [&_h2]:text-base sm:[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:first:mt-0 
                  [&_p]:text-[14px] sm:[&_p]:text-[15px] [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
                  [&_ul]:space-y-3 [&_ul]:mb-6 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-primary/70
                  [&_ol]:space-y-3 [&_ol]:mb-6 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:marker:text-primary/70
                  [&_li]:text-[14px] sm:[&_li]:text-[15px] [&_li]:text-muted-foreground [&_li]:leading-relaxed [&_li]:pl-1 
                  [&_strong]:text-foreground [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <Briefcase size={32} className="text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">
                Bu vakansiya üçün ətraflı məlumat mövcud deyil.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Apply Button Footer */}
      <div className="shrink-0 p-4 sm:p-6 border-t border-border dark:border-white/10 bg-card dark:bg-[#0f1423]">
        <ApplyModal 
          jobId={job.id}
          jobTitle={job.title} 
          companyName={job.company} 
          onSuccess={handleApplySuccess}
        >
          <button 
            disabled={isApplied}
            className={cn(
              "w-full h-12 rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg",
              isApplied 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none cursor-default" 
                : "bg-foreground text-background hover:opacity-90 shadow-black/5"
            )}
          >
            {isApplied ? "Müraciət Olundu" : "Müraciət Et"}
          </button>
        </ApplyModal>
      </div>
    </div>
  );
}

