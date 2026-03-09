import { z } from "zod";

export const notificationSchema = z.object({
  dailyEmailEnabled: z.boolean(),
  filterPrompt: z.string().max(500, "Filter prompt must be under 500 characters"),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
