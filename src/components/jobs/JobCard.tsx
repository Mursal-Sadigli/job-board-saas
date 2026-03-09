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
  "in-office": { label: "Ofisdə", icon: <Monitor size={12} /> },
  hybrid: { label: "Hibrid", icon: <Users size={12} /> },
  remote: { label: "Uzaqdan", icon: <Wifi size={12} /> },
  any: { label: "Fərqi yoxdur", icon: <MapPin size={12} /> },
};

const jobTypeConfig: Record<string, string> = {
  "full-time": "Tam iş günü",
  "part-time": "Yarımştat",
  contract: "Müqavilə",
  internship: "Təcrübəçi",
  any: "Fərqi yoxdur",
};

const expLevelConfig: Record<string, string> = {
  junior: "Başlanğıc",
  mid: "Orta",
  senior: "Peşəkar",
  lead: "Rəhbər",
  any: "Fərqi yoxdur",
};

export default function JobCard({ job }: JobCardProps) {
  const locConfig = locationTypeConfig[job.locationType] || locationTypeConfig.any;
  const expLabel = expLevelConfig[job.experienceLevel] || expLevelConfig.any;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer group hover:border-slate-400 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
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
            className={`w-full h-full items-center justify-center font-bold text-lg text-slate-700 ${
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
              <h3 className="font-semibold text-base leading-tight text-slate-900 group-hover:underline transition-all">
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
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-sm">
                  Yeni
                </span>
              )}
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mt-3">
            {job.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                <Award size={12} className="text-slate-600" />
                Önə çıxan
              </span>
            )}

            {/* Location */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
              <MapPin size={12} className="text-slate-400" />
              {job.location || `${job.city}${job.state ? `, ${job.state}` : ""}`}
            </span>

            {/* Location type */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
              <span className="text-slate-400">{locConfig.icon}</span>
              {locConfig.label}
            </span>

            {/* Job type */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
              <Briefcase size={12} className="text-slate-400" />
              {jobTypeConfig[job.jobType] || jobTypeConfig.any}
            </span>

            {/* Experience */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-50 text-slate-600 border-slate-200"
            >
              <Clock size={12} className="text-slate-400" />
              {expLabel}
            </span>

            {/* Salary */}
            {job.salary && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                <DollarSign size={12} className="text-slate-400" />
                {job.salary}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
