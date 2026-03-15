"use client";

import { Job } from "@/types/job";
import JobCard from "./JobCard";
import { Briefcase, SearchX } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  selectedJobId?: string | null;
  onSelect?: (job: Job) => void;
}

export default function JobList({ jobs, isLoading, selectedJobId, onSelect }: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border rounded-2xl p-5 bg-card dark:bg-slate-900/40 border-border dark:border-white/10 animate-pulse">
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl bg-muted/50 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted/50 rounded-md w-3/4" />
                <div className="h-3 bg-muted/30 rounded-md w-1/4" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-muted/20 rounded-lg w-20" />
                  <div className="h-6 bg-muted/20 rounded-lg w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-card dark:bg-[#0f1423] rounded-[2.5rem] border border-dashed border-border dark:border-white/10 shadow-inner backdrop-blur-xl">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-muted/20 dark:bg-white/5 border border-border dark:border-white/10 shadow-sm">
          <SearchX size={32} className="text-muted-foreground/40" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-foreground tracking-tight">
            Nəticə tapılmadı
          </p>
          <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
            Seçdiyiniz filtrlərə uyğun heç bir iş elanı mövcud deyil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Count Header */}
      <div className="flex items-center justify-between mb-0.5 sm:mb-1 px-1">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase size={12} className="text-primary sm:size-3.5" />
          </div>
          <span className="text-[11px] sm:text-sm font-bold text-foreground/80 tracking-tight">
            {jobs.length} vakansiya mövcuddur
          </span>
        </div>
      </div>

      {/* Cards */}
      {jobs.map((job) => (
        <div
          key={job.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
        >
          <JobCard
            job={job}
            isSelected={selectedJobId === job.id}
            onClick={() => onSelect?.(job)}
          />
        </div>
      ))}
    </div>
  );
}
