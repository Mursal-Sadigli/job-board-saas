"use client";

import { useState } from "react";
import { Save, CheckCircle, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function StarRating({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < count
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/25"
          }
        />
      ))}
    </span>
  );
}

export default function NotificationsPage() {
  const [saved, setSaved] = useState(false);
  const [daily, setDaily] = useState(true);
  const [minRating, setMinRating] = useState("any");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="h-full overflow-y-auto px-6 sm:px-10 py-10 bg-background">
      <h1 className="text-2xl font-black text-foreground mb-8">
        Notification Settings
      </h1>

      <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">

        {/* Daily Email Notifications */}
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Daily Email Notifications
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Receive summary emails of all new job listing applications
            </p>
          </div>
          <Switch
            checked={daily}
            onCheckedChange={setDaily}
            className="shrink-0 mt-0.5"
          />
        </div>

        <div className="h-px bg-border" />

        {/* Minimum Rating */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Minimum Rating
          </p>
          <Select value={minRating} onValueChange={(v) => setMinRating(v ?? "any")}>
            <SelectTrigger className="w-[200px] bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="any">
                <span className="text-muted-foreground text-sm font-medium">
                  Any Rating
                </span>
              </SelectItem>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  <StarRating count={n} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            Only receive notifications for candidates that meet or exceed this
            rating. Candidates 3-5 stars should meet all job requirements and
            are likely a good fit for the role.
          </p>
        </div>

        <div className="h-px bg-border" />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all active:scale-[0.98]"
        >
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
      </div>
    </div>
  );
}
