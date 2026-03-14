import { useState, useMemo, useEffect } from "react";
import { Job, JobFilters, DEFAULT_FILTERS } from "@/types/job";

export function useJobs() {
  const [dbJobs, setDbJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<JobFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("http://localhost:5000/api/jobs");
        if (response.ok) {
          const data = await response.json();
          // Map backend Job to frontend Job type if necessary
          const mappedJobs = data.map((j: any) => ({
            ...j,
            company: j.employer?.companyName || j.company,
            companyLogo: j.employer?.logoUrl || "/images/logos/google.png", // fallback
            // city and state are missing in DB currently, we extract from location if possible
            city: j.location?.split(',')[0]?.trim() || "",
            state: j.location?.split(',')[1]?.trim() || "any",
            isNew: true,
            featured: j.isFeatured
          }));
          setDbJobs(mappedJobs);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const jobs = useMemo(() => {
    return dbJobs.filter((job: Job) => {
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
  }, [dbJobs, appliedFilters]);

  const applyFilters = () => setAppliedFilters({ ...filters });
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  return { jobs, filters, setFilters, applyFilters, resetFilters, isLoading };
}
