import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Job, JobFilters, DEFAULT_FILTERS, Category } from "@/types/job";

export function useJobs() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category"); // slug

  const [dbJobs, setDbJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState<JobFilters>({
    ...DEFAULT_FILTERS,
    category: categoryParam || "any"
  });
  
  const [appliedFilters, setAppliedFilters] = useState<JobFilters>({
    ...DEFAULT_FILTERS,
    category: categoryParam || "any"
  });

  useEffect(() => {
    const newCategory = categoryParam || "any";
    setFilters(prev => ({ ...prev, category: newCategory }));
    setAppliedFilters(prev => ({ ...prev, category: newCategory }));
  }, [categoryParam]);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    async function fetchJobs() {
      try {
        const response = await fetch(`${API_BASE}/api/jobs`);
        if (response.ok) {
          const data = await response.json();
          const mappedJobs = data.map((j: any) => ({
            ...j,
            company: j.employer?.companyName || j.company,
            companyLogo: j.logoUrl || j.employer?.logoUrl || "/images/logos/google.png",
            city: j.city || j.location?.split(',')[0]?.trim() || "",
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

    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE}/api/jobs/categories`);
        if (response.ok) {
          const cats = await response.json();
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }

    fetchJobs();
    fetchCategories();
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
      if (
        appliedFilters.category !== "any" &&
        job.category?.slug !== appliedFilters.category
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

  return { jobs, categories, filters, setFilters, applyFilters, resetFilters, isLoading };
}
