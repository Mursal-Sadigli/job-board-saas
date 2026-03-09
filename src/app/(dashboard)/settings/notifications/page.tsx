"use client";

import { useState } from "react";
import { Bell, Save, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notificationSchema,
  NotificationFormData,
} from "@/validators/notificationSchema";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="h-full overflow-y-auto px-6 py-6 bg-slate-50">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={20} className="text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-900">
            Notifications
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          Manage your job alert preferences
        </p>
      </div>

      {/* Container */}
      <div className="rounded-xl p-6 max-w-xl bg-white border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Daily Email Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Daily Email Notifications
              </p>
              <p className="text-xs mt-0.5 text-slate-500">
                Receive a daily digest of new matching jobs
              </p>
            </div>
            <Switch
              checked={daily}
              onCheckedChange={setDaily}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Filter Prompt */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900">
              Filter Prompt
            </label>
            <p className="text-xs text-slate-500">
              Describe the kind of jobs you're looking for (used by AI to filter notifications)
            </p>
            <Textarea
              {...register("filterPrompt")}
              placeholder="e.g. Senior frontend engineer roles at startups in San Francisco, preferably remote or hybrid..."
              rows={4}
              className="resize-none bg-white"
            />
            {errors.filterPrompt && (
              <p className="text-xs text-rose-500">
                {errors.filterPrompt.message}
              </p>
            )}
          </div>

          {/* Save button */}
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2">
            {saved ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Notification Settings
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
