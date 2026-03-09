"use client";

import { useState } from "react";
import { Bell, Save, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notificationSchema,
  NotificationFormData,
} from "@/validators/notificationSchema";

export default function NotificationsPage() {
  const [saved, setSaved] = useState(false);
  const [daily, setDaily] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { dailyEmailEnabled: false, filterPrompt: "" },
  });

  const onSubmit = (_data: NotificationFormData) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div
      className="h-full overflow-y-auto px-6 py-6"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={20} style={{ color: "hsl(var(--primary))" }} />
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-outfit)", color: "hsl(var(--foreground))" }}
          >
            Notifications
          </h1>
        </div>
        <p className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>
          Manage your job alert preferences
        </p>
      </div>

      {/* Container */}
      <div
        className="rounded-xl p-6 max-w-xl"
        style={{
          background: "hsl(var(--surface))",
          border: "1px solid hsl(var(--border-subtle))",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Daily Email Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Daily Email Notifications
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "hsl(var(--foreground-subtle))" }}
              >
                Receive a daily digest of new matching jobs
              </p>
            </div>
            <div
              className={`toggle-track ${daily ? "checked" : ""}`}
              onClick={() => setDaily((p) => !p)}
            >
              <div className="toggle-thumb" />
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid hsl(var(--border-subtle))" }} />

          {/* Filter Prompt */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Filter Prompt
            </label>
            <p
              className="text-xs"
              style={{ color: "hsl(var(--foreground-subtle))" }}
            >
              Describe the kind of jobs you're looking for (used by AI to filter notifications)
            </p>
            <textarea
              {...register("filterPrompt")}
              placeholder="e.g. Senior frontend engineer roles at startups in San Francisco, preferably remote or hybrid..."
              rows={4}
              className="input-base resize-none"
              style={{ lineHeight: "1.6" }}
            />
            {errors.filterPrompt && (
              <p className="text-xs" style={{ color: "hsl(var(--danger))" }}>
                {errors.filterPrompt.message}
              </p>
            )}
          </div>

          {/* Save button */}
          <button type="submit" className="btn-primary">
            {saved ? (
              <>
                <CheckCircle size={16} />
                Saved!
              </>
            ) : (
              <>
                <Save size={16} />
                Save Notification Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
