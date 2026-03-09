"use client";

import { Job, JobFilters } from "@/types/job";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50 border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-indigo-600" />
          <h2 className="font-semibold text-sm text-slate-900">
            Filters
          </h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Filter fields */}
      <div className="flex flex-col gap-6 p-5">
        {/* Job Title */}
        <FilterField label="Job Title">
          <Input
            placeholder="e.g. Frontend Engineer"
            value={filters.title}
            onChange={(e) => update("title", e.target.value)}
            className="bg-white"
          />
        </FilterField>

        {/* Location Requirement */}
        <FilterField label="Location Requirement">
          <Select
            value={filters.locationType}
            onValueChange={(value) =>
              update("locationType", value as JobFilters["locationType"])
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="in-office">In Office</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        {/* City */}
        <FilterField label="City">
          <Input
            placeholder="e.g. San Francisco"
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
            className="bg-white"
          />
        </FilterField>

        {/* State */}
        <FilterField label="State">
          <Select
            value={filters.state}
            onValueChange={(value) => update("state", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state} value={state === "Any" ? "any" : state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        {/* Job Type */}
        <FilterField label="Job Type">
          <Select
            value={filters.jobType}
            onValueChange={(value) =>
              update("jobType", value as JobFilters["jobType"])
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        {/* Experience Level */}
        <FilterField label="Experience Level">
          <Select
            value={filters.experienceLevel}
            onValueChange={(value) =>
              update("experienceLevel", value as JobFilters["experienceLevel"])
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        {/* Filter button */}
        <Button onClick={onApply} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <SlidersHorizontal size={15} className="mr-2" />
          Apply Filters
        </Button>
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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}
