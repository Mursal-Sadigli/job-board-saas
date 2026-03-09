"use client";

import { Job } from "@/types/job";
import JobCard from "./JobCard";
import { Briefcase, SearchX } from "lucide-react";

interface JobListProps {
  jobs: Job[];
}

export default function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-card rounded-[2.5rem] border border-dashed border-border shadow-inner">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-muted/20 border border-border shadow-sm">
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
    <div className="flex flex-col gap-4">
      {/* Count Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase size={14} className="text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground/80 tracking-tight">
            {jobs.length} vakansiya mövcuddur
          </span>
        </div>
      </div>

      {/* Cards */}
      {jobs.map((job, i) => (
        <div
          key={job.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
        >
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
}
