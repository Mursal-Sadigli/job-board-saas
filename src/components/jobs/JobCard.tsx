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

const expLevelConfig: Record<string, { label: string; bgClass: string; textClass: string; borderClass: string }> = {
  junior: { label: "Junior", bgClass: "bg-emerald-50", textClass: "text-emerald-700", borderClass: "border-emerald-200" },
  mid: { label: "Mid Level", bgClass: "bg-indigo-50", textClass: "text-indigo-700", borderClass: "border-indigo-200" },
  senior: { label: "Senior", bgClass: "bg-amber-50", textClass: "text-amber-700", borderClass: "border-amber-200" },
  lead: { label: "Lead", bgClass: "bg-rose-50", textClass: "text-rose-700", borderClass: "border-rose-200" },
  any: { label: "Any", bgClass: "bg-slate-50", textClass: "text-slate-600", borderClass: "border-slate-200" },
};

export default function JobCard({ job }: JobCardProps) {
  const locConfig = locationTypeConfig[job.locationType];
  const expConfig = expLevelConfig[job.experienceLevel];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer group hover:border-indigo-500 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const next = el.nextElementSibling as HTMLElement;
                if (next) next.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full items-center justify-center font-bold text-lg text-indigo-600 ${
              job.companyLogo ? "hidden" : "flex"
            }`}
          >
            {job.company[0]}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-base leading-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-sm mt-0.5 text-slate-500">
                {job.company}
              </p>
            </div>
            {/* Time + New badge */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-xs text-slate-400">
                {formatRelativeTime(job.postedAt)}
              </span>
              {job.isNew && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mt-3">
            {job.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Award size={12} />
                Featured
              </span>
            )}

            {/* Location */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
              <MapPin size={12} />
              {job.location || `${job.city}${job.state ? `, ${job.state}` : ""}`}
            </span>

            {/* Location type */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
              {locConfig.icon}
              {locConfig.label}
            </span>

            {/* Job type */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
              <Briefcase size={12} />
              {jobTypeConfig[job.jobType]}
            </span>

            {/* Experience */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${expConfig.bgClass} ${expConfig.textClass} ${expConfig.borderClass}`}
            >
              <Clock size={12} />
              {expConfig.label}
            </span>

            {/* Salary */}
            {job.salary && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <DollarSign size={12} />
                {job.salary}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
