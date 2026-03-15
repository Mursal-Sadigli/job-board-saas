export type LocationType = "any" | "in-office" | "hybrid" | "remote";
export type JobType =
  | "any"
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";
export type ExperienceLevel = "any" | "junior" | "mid" | "senior" | "lead";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: LocationType;
  city: string;
  state: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salary?: string;
  postedAt: string;
  featured: boolean;
  isNew: boolean;
  description?: string;
  isActive: boolean;
  applicants: any[]; // Temporarily any to avoid complex circular dependencies
  viewsCount?: number;
  likesCount?: number;
}

export interface JobFilters {
  title: string;
  locationType: LocationType;
  city: string;
  state: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
}

export const DEFAULT_FILTERS: JobFilters = {
  title: "",
  locationType: "any",
  city: "",
  state: "any",
  jobType: "any",
  experienceLevel: "any",
};
