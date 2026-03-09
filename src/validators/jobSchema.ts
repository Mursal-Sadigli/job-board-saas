import { z } from "zod";

export const jobFilterSchema = z.object({
  title: z.string(),
  locationType: z.enum(["any", "in-office", "hybrid", "remote"]),
  city: z.string(),
  state: z.string(),
  jobType: z.enum(["any", "full-time", "part-time", "contract", "internship"]),
  experienceLevel: z.enum(["any", "junior", "mid", "senior", "lead"]),
});

export type JobFilterFormData = z.infer<typeof jobFilterSchema>;
