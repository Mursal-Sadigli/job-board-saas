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
} from "lucide-react";

interface JobCardProps {
  job: Job;
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
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  any: "İstənilən",
};

export default function JobCard({ job }: JobCardProps) {
  const [logoError, setLogoError] = useState(false);
  const locConfig = locationTypeConfig[job.locationType] || locationTypeConfig.any;
  const expLabel = expLevelConfig[job.experienceLevel] || expLevelConfig.any;

  const showLogo = job.companyLogo && !logoError;

  return (
    <div 
      className={cn(
        "border border-border rounded-2xl p-4 sm:p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden",
        job.featured 
          ? "bg-white dark:bg-[#1e1424] border-purple-500/20 shadow-lg shadow-purple-500/5 hover:border-purple-500/40" 
          : "bg-card hover:border-primary/20 hover:shadow-md"
      )}
    >
      {/* Background Glow for Featured */}
      {job.featured && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
      )}

      <div className="flex items-start gap-4 sm:gap-6 relative z-10">
        {/* Company Logo */}
        <div className="shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.25rem] bg-background border border-border overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
          {showLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-2 sm:p-3 dark:brightness-[1.2]"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-xl sm:text-2xl text-muted-foreground/40">
              {job.company[0]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-semibold text-base sm:text-lg leading-snug text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground font-semibold tracking-wide">
                {job.company}
              </p>
            </div>
            {/* Time + New badge */}
            <div className="flex flex-col items-end gap-1.5 sm:gap-2.5 shrink-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                {formatRelativeTime(job.postedAt)}
              </span>
              {job.isNew && (
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] bg-foreground text-background shadow-xl">
                  Yeni
                </span>
              )}
            </div>
          </div>

          {/* Tags - Flex wrap on all screens, small on mobile to fit one row */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
            {job.featured && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Award size={11} className="shrink-0" />
                Önə çıxan
              </span>
            )}

            {/* Location */}
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-none">{job.location || job.city}</span>
            </span>

            {/* Location type */}
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="shrink-0 scale-90 sm:scale-100">{locConfig.icon}</span>
              <span className="truncate">{locConfig.label}</span>
            </span>

            {/* Job type */}
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Briefcase size={11} className="shrink-0" />
              <span className="truncate">{jobTypeConfig[job.jobType] || jobTypeConfig.any}</span>
            </span>

            {/* Experience */}
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Clock size={11} className="shrink-0" />
              <span className="truncate">{expLabel}</span>
            </span>

            {/* Salary */}
            {job.salary && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-bold bg-muted/40 text-foreground border border-border">
                <Banknote size={11} className="shrink-0 text-muted-foreground" />
                <span className="truncate">{job.salary}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
