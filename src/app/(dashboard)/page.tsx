"use client";

import { useJobs } from "@/hooks/useJobs";
import JobFiltersPanel from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";

export default function JobBoardPage() {
  const { jobs, filters, setFilters, applyFilters, resetFilters } = useJobs();

  return (
    <div className="flex h-[calc(100vh-53px)]">
      {/* Left: Filter panel */}
      <div className="w-72 flex-shrink-0">
        <JobFiltersPanel
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </div>

      {/* Right: Job list */}
      <div
        className="flex-1 overflow-y-auto px-6 py-5"
        style={{ background: "hsl(var(--background))" }}
      >
        <JobList jobs={jobs} />
      </div>
    </div>
  );
}
