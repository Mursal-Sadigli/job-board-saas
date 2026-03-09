"use client";
import { useState, useMemo } from "react";
import { MOCK_JOBS } from "@/api/jobs";
import { Job, JobFilters, DEFAULT_FILTERS } from "@/types/job";

export function useJobs() {
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<JobFilters>(DEFAULT_FILTERS);

  const jobs = useMemo(() => {
    return MOCK_JOBS.filter((job: Job) => {
      if (
        appliedFilters.title &&
        !job.title
          .toLowerCase()
          .includes(appliedFilters.title.toLowerCase()) &&
        !job.company
          .toLowerCase()
          .includes(appliedFilters.title.toLowerCase())
      ) {
        return false;
      }
      if (
        appliedFilters.locationType !== "any" &&
        job.locationType !== appliedFilters.locationType
      ) {
        return false;
      }
      if (
        appliedFilters.city &&
        !job.city.toLowerCase().includes(appliedFilters.city.toLowerCase())
      ) {
        return false;
      }
      if (
        appliedFilters.state !== "any" &&
        job.state.toLowerCase() !== appliedFilters.state.toLowerCase()
      ) {
        return false;
      }
      if (
        appliedFilters.jobType !== "any" &&
        job.jobType !== appliedFilters.jobType
      ) {
        return false;
      }
      if (
        appliedFilters.experienceLevel !== "any" &&
        job.experienceLevel !== appliedFilters.experienceLevel
      ) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  const applyFilters = () => setAppliedFilters({ ...filters });
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  return { jobs, filters, setFilters, applyFilters, resetFilters };
}
