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
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white rounded-xl border border-slate-200">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100">
          <SearchX size={24} className="text-slate-400" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-900">
            No jobs found
          </p>
          <p className="text-sm mt-1 text-slate-500">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Count */}
      <div className="flex items-center gap-2 mb-1 px-1">
        <Briefcase size={14} className="text-indigo-600" />
        <span className="text-sm font-medium text-slate-500">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Cards */}
      {jobs.map((job, i) => (
        <div
          key={job.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
}
