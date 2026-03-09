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
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "hsl(var(--surface-2))" }}
        >
          <SearchX size={24} style={{ color: "hsl(var(--foreground-subtle))" }} />
        </div>
        <div className="text-center">
          <p
            className="font-semibold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            No jobs found
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "hsl(var(--foreground-subtle))" }}
          >
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Count */}
      <div className="flex items-center gap-2 mb-1">
        <Briefcase size={14} style={{ color: "hsl(var(--primary))" }} />
        <span
          className="text-sm font-medium"
          style={{ color: "hsl(var(--foreground-muted))" }}
        >
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Cards */}
      {jobs.map((job, i) => (
        <div
          key={job.id}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
}
