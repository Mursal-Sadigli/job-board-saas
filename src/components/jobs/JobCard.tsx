"use client";

import { Job } from "@/types/job";
import { formatRelativeTime } from "@/utils/formatters";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Award,
  Monitor,
  Wifi,
  Users,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface JobCardProps {
  job: Job;
}

const locationTypeConfig = {
  "in-office": { label: "In Office", icon: <Monitor size={12} /> },
  hybrid: { label: "Hybrid", icon: <Users size={12} /> },
  remote: { label: "Remote", icon: <Wifi size={12} /> },
  any: { label: "Any", icon: <MapPin size={12} /> },
};

const jobTypeConfig: Record<string, string> = {
  "full-time": "Full Time",
  "part-time": "Part Time",
  contract: "Contract",
  internship: "Internship",
  any: "Any",
};

const expLevelConfig: Record<string, { label: string; color: string }> = {
  junior: { label: "Junior", color: "rgba(16,185,129,0.15)" },
  mid: { label: "Mid Level", color: "rgba(99,102,241,0.15)" },
  senior: { label: "Senior", color: "rgba(245,158,11,0.15)" },
  lead: { label: "Lead", color: "rgba(239,68,68,0.15)" },
  any: { label: "Any", color: "rgba(107,114,128,0.15)" },
};

export default function JobCard({ job }: JobCardProps) {
  const locConfig = locationTypeConfig[job.locationType];
  const expConfig = expLevelConfig[job.experienceLevel];

  return (
    <div
      className="card-hover rounded-xl p-4 cursor-pointer group"
      style={{
        background: "hsl(var(--surface))",
        border: "1px solid hsl(var(--border-subtle))",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(99,102,241,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "hsl(var(--border-subtle))";
      }}
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="company-logo"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const next = el.nextElementSibling as HTMLElement;
                if (next) next.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="company-logo-placeholder"
            style={{ display: job.companyLogo ? "none" : "flex" }}
          >
            {job.company[0]}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3
                className="font-semibold text-base leading-tight group-hover:text-indigo-400 transition-colors"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {job.title}
              </h3>
              <p
                className="text-sm mt-0.5"
                style={{ color: "hsl(var(--foreground-muted))" }}
              >
                {job.company}
              </p>
            </div>
            {/* Time + New badge */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span
                className="text-xs"
                style={{ color: "hsl(var(--foreground-subtle))" }}
              >
                {formatRelativeTime(job.postedAt)}
              </span>
              {job.isNew && (
                <span className="badge badge-new text-xs px-2 py-0.5">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5">
            {job.featured && (
              <span className="badge badge-featured">
                <Award size={11} />
                Featured
              </span>
            )}

            {/* Location */}
            <span className="badge badge-location">
              <MapPin size={11} />
              {job.location || `${job.city}${job.state ? `, ${job.state}` : ""}`}
            </span>

            {/* Location type */}
            <span className="badge badge-location">
              {locConfig.icon}
              {locConfig.label}
            </span>

            {/* Job type */}
            <span className="badge badge-location">
              <Briefcase size={11} />
              {jobTypeConfig[job.jobType]}
            </span>

            {/* Experience */}
            <span
              className="badge"
              style={{
                background: expConfig.color,
                color: "hsl(var(--foreground-muted))",
                border: "1px solid hsl(var(--border-subtle))",
              }}
            >
              <Clock size={11} />
              {expConfig.label}
            </span>

            {/* Salary */}
            {job.salary && (
              <span className="badge badge-location">
                <DollarSign size={11} />
                {job.salary}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
