"use client";

import { Job, JobFilters } from "@/types/job";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const US_STATES = [
  "Any", "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI",
  "MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA",
  "WA","WV","WI","WY"
];

interface JobFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function JobFiltersPanel({
  filters,
  onChange,
  onApply,
  onReset,
}: JobFiltersProps) {
  const update = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        background: "hsl(var(--surface))",
        borderRight: "1px solid hsl(var(--border-subtle))",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid hsl(var(--border-subtle))" }}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} style={{ color: "hsl(var(--primary))" }} />
          <h2
            className="font-semibold text-sm"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Filters
          </h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
          style={{ color: "hsl(var(--foreground-subtle))" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "hsl(var(--foreground))")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "hsl(var(--foreground-subtle))")
          }
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Filter fields */}
      <div className="flex flex-col gap-5 p-5">
        {/* Job Title */}
        <FilterField label="Job Title">
          <input
            className="input-base"
            placeholder="e.g. Frontend Engineer"
            value={filters.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </FilterField>

        {/* Location Requirement */}
        <FilterField label="Location Requirement">
          <select
            className="select-base"
            value={filters.locationType}
            onChange={(e) =>
              update("locationType", e.target.value as JobFilters["locationType"])
            }
          >
            <option value="any">Any</option>
            <option value="in-office">In Office</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </FilterField>

        {/* City */}
        <FilterField label="City">
          <input
            className="input-base"
            placeholder="e.g. San Francisco"
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </FilterField>

        {/* State */}
        <FilterField label="State">
          <select
            className="select-base"
            value={filters.state}
            onChange={(e) => update("state", e.target.value)}
          >
            {US_STATES.map((state) => (
              <option key={state} value={state === "Any" ? "any" : state}>
                {state}
              </option>
            ))}
          </select>
        </FilterField>

        {/* Job Type */}
        <FilterField label="Job Type">
          <select
            className="select-base"
            value={filters.jobType}
            onChange={(e) =>
              update("jobType", e.target.value as JobFilters["jobType"])
            }
          >
            <option value="any">Any</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </FilterField>

        {/* Experience Level */}
        <FilterField label="Experience Level">
          <select
            className="select-base"
            value={filters.experienceLevel}
            onChange={(e) =>
              update(
                "experienceLevel",
                e.target.value as JobFilters["experienceLevel"]
              )
            }
          >
            <option value="any">Any</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </FilterField>

        {/* Filter button */}
        <button onClick={onApply} className="btn-primary mt-2">
          <SlidersHorizontal size={15} />
          Apply Filters
        </button>
      </div>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "hsl(var(--foreground-subtle))" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
