"use client";

import { useState } from "react";
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
} from "lucide-react";
import { PostJobModal } from "@/components/employer/PostJobModal";

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
  const locConfig = locationTypeConfig[job.locationType] || locationTypeConfig.any;
  const expLabel = expLevelConfig[job.experienceLevel] || expLevelConfig.any;
  const showLogo = job.companyLogo && !logoError;

  return (
    <div className="flex flex-col h-full bg-card border-l border-border relative overflow-hidden">
      {/* Scrollable Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div
          className={cn(
            "px-4 sm:px-6 pt-5 sm:pt-6 pb-6 relative border-b border-border/50",
            job.featured ? "bg-card" : "bg-card"
          )}
        >
          {/* Close button (mobile) - Adjusted for better visibility and touch target */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-sm hover:bg-muted transition-colors text-muted-foreground hover:text-foreground active:scale-95"
            >
              <X size={20} />
            </button>
          )}

          {/* Company + Title */}
          <div className="flex items-start gap-3 sm:gap-4 mb-5">
            <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden flex items-center justify-center shadow-sm">
              {showLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-contain p-2 sm:p-3"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-black text-xl sm:text-2xl text-muted-foreground/30">
                  {job.company[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-6 sm:pr-0">
              <h2 className="text-lg sm:text-2xl font-bold leading-tight tracking-tight text-foreground wrap-break-word">
                {job.title}
              </h2>
              <p className="text-sm sm:text-base font-semibold mt-1 text-muted-foreground">
                {job.company}
              </p>
            </div>
          </div>

          {/* Date */}
          <p className="text-[10px] sm:text-[11px] font-semibold mb-4 text-muted-foreground/60">
            {formatRelativeTime(job.postedAt)}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {job.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 border border-purple-500/20">
                <Award size={11} />
                Önə çıxan
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border bg-muted/40 text-foreground border-border">
                <Banknote size={11} />
                {job.salary}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
              <MapPin size={11} />
              {job.location || job.city}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20">
              <span className="shrink-0 scale-90">{locConfig.icon}</span>
              {locConfig.label}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
              <Briefcase size={11} />
              {jobTypeConfig[job.jobType] || jobTypeConfig.any}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              <Clock size={11} />
              {expLabel}
            </span>
          </div>

          {/* Top Apply Button (Visible on desktop) */}
          {job.featured && (
            <div className="hidden sm:block mt-6">
              <PostJobModal onSuccess={onApply}>
                <button className="px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-black/10">
                  Müraciət Et
                </button>
              </PostJobModal>
            </div>
          )}
        </div>

        {/* Description Area */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 pb-24">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-5 sm:mb-6">İş haqqında</h3>
          {job.description ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none
                [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:first:mt-0
                [&_p]:text-[15px] [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
                [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:pl-0 [&_ul]:list-none
                [&_li]:text-[15px] [&_li]:text-muted-foreground [&_li]:leading-relaxed
                [&_li]:flex [&_li]:items-start [&_li]:gap-2.5
                [&_li]:before:content-['•'] [&_li]:before:text-primary/60 [&_li]:before:font-bold [&_li]:before:mt-0"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
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

      {/* Fixed Bottom Apply Button Container */}
      <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-border bg-card/95 backdrop-blur-md">
        <PostJobModal onSuccess={onApply}>
          <button className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] shadow-xl">
            Müraciət Et
          </button>
        </PostJobModal>
      </div>
    </div>
  );
}

