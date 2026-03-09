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

export default function JobDetailPanel({ job, onClose }: JobDetailPanelProps) {
  const [logoError, setLogoError] = useState(false);
  const locConfig = locationTypeConfig[job.locationType] || locationTypeConfig.any;
  const expLabel = expLevelConfig[job.experienceLevel] || expLevelConfig.any;
  const showLogo = job.companyLogo && !logoError;

  return (
    <div className="flex flex-col h-full bg-card border-l border-border overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          "px-6 pt-6 pb-5 shrink-0 relative",
          job.featured
            ? "bg-[#1a1025] dark:bg-[#1a1025]"
            : "bg-card"
        )}
      >
        {/* Close button (mobile) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        )}

        {/* Company + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-white/10 border border-white/10 overflow-hidden flex items-center justify-center shadow-lg">
            {showLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-contain p-2"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-black text-2xl text-white/40">
                {job.company[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={cn(
              "text-xl font-bold leading-snug tracking-tight truncate",
              job.featured ? "text-white" : "text-foreground"
            )}>
              {job.title}
            </h2>
            <p className={cn(
              "text-sm font-semibold mt-0.5",
              job.featured ? "text-white/60" : "text-muted-foreground"
            )}>
              {job.company}
            </p>
          </div>
        </div>

        {/* Date */}
        <p className={cn(
          "text-[11px] font-semibold mb-3",
          job.featured ? "text-white/40" : "text-muted-foreground/60"
        )}>
          {formatRelativeTime(job.postedAt)}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {job.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Award size={11} />
              Önə çıxan
            </span>
          )}
          {job.salary && (
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border",
              job.featured
                ? "bg-white/10 text-white border-white/20"
                : "bg-muted/40 text-foreground border-border"
            )}>
              <Banknote size={11} />
              {job.salary}
            </span>
          )}
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border",
            job.featured
              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
          )}>
            <MapPin size={11} />
            {job.location || job.city}
          </span>
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border",
            job.featured
              ? "bg-white/10 text-white/80 border-white/20"
              : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
          )}>
            <span className="shrink-0 scale-90">{locConfig.icon}</span>
            {locConfig.label}
          </span>
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border",
            job.featured
              ? "bg-white/10 text-white/80 border-white/20"
              : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
          )}>
            <Briefcase size={11} />
            {jobTypeConfig[job.jobType] || jobTypeConfig.any}
          </span>
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border",
            job.featured
              ? "bg-white/10 text-white/80 border-white/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          )}>
            <Clock size={11} />
            {expLabel}
          </span>
        </div>

        {/* Apply button in header for featured */}
        {job.featured && (
          <div className="mt-4">
            <PostJobModal>
              <button className="px-5 py-2 rounded-lg bg-white text-slate-900 text-sm font-bold hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-black/20">
                Müraciət Et
              </button>
            </PostJobModal>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {job.description ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none
              [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:first:mt-0
              [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-3
              [&_ul]:space-y-1.5 [&_ul]:mb-3 [&_ul]:pl-0 [&_ul]:list-none
              [&_li]:text-sm [&_li]:text-muted-foreground [&_li]:leading-relaxed
              [&_li]:flex [&_li]:items-start [&_li]:gap-2
              [&_li]:before:content-['•'] [&_li]:before:text-primary/60 [&_li]:before:font-bold [&_li]:before:mt-0"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <Briefcase size={32} className="text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">
              Bu vakansiya üçün ətraflı məlumat mövcud deyil.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Apply Button */}
      <div className="shrink-0 px-6 py-4 border-t border-border bg-card">
        <PostJobModal>
          <button className="w-full h-11 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] shadow-lg">
            Müraciət Et
          </button>
        </PostJobModal>
      </div>
    </div>
  );
}
