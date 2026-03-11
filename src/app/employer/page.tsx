"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  Plus,
  Pencil,
  EyeOff,
  Eye,
  Star,
  Trash2,
  MapPin,
  Banknote,
  Briefcase,
  Globe,
  Network,
  Building,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PostJobModal, type JobFormData } from "@/components/employer/PostJobModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
import { ROUTES } from "@/routes/paths";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, ArrowLeftRight, LogOut, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";

// ------- Types -------
const FALLBACK_USER = {
  firstName: "Qonaq",
  lastName: "",
  email: "giriş edilməyib",
};
type Applicant = {
  id: string;
  name: string;
  initials: string;
  color: string;
  stage: Stage;
  rating: number;
  appliedAt: string;
};

type Stage =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

type Job = JobFormData & {
  id: string;
  applicants: Applicant[];
};

// ------- Config -------
const stageLabels: Record<Stage, string> = {
  applied: "Müraciət",
  screening: "Seçim",
  interview: "Müsahibə",
  offer: "Təklif",
  hired: "Qəbul",
  rejected: "Rədd",
};

const stageColors: Record<Stage, string> = {
  applied: "text-foreground", 
  screening: "text-amber-500",
  interview: "text-purple-500",
  offer: "text-emerald-500",
  hired: "text-green-500",
  rejected: "text-red-500",
};

const locationTypeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  "in-office": { label: "Ofisdə", icon: <Building size={12} /> },
  hybrid: { label: "Hibrid", icon: <Network size={12} /> },
  remote: { label: "Uzaqdan", icon: <Globe size={12} /> },
};

const jobTypeLabels: Record<string, string> = {
  "full-time": "Tam iş günü",
  "part-time": "Yarımştat",
  contract: "Müqavilə",
  internship: "Təcrübəçi",
};

// ------- Mock applicants -------
const mockApplicants: Applicant[] = [
  { id: "1", name: "Sally Smith", initials: "SS", color: "bg-[#8B5CF6]", stage: "applied", rating: 4, appliedAt: "2025-06-02" },
  { id: "2", name: "Kyle Cook", initials: "KC", color: "bg-slate-500", stage: "applied", rating: 4, appliedAt: "2025-06-05" },
];

const MOCK_JOBS: Job[] = [
  {
    id: "3",
    title: "UX Engineer, Android XR",
    locationType: "remote",
    jobType: "full-time",
    salary: "$225 / hr",
    description: `<p><strong>Minimum qualifications:</strong></p><ul><li>Bachelor's degree or equivalent practical experience.</li><li>4 years of experience with front-end development, technical UX design, or prototyping.</li><li>Experience with Android UI prototyping or development.</li><li>Experience with Android Compose.</li></ul><p><strong>Preferred qualifications:</strong></p><ul><li>5 years of experience developing native, clean, and compatible Android applications.</li><li>3 years of experience as a front-end developer, UX Engineer, creative or design technologist, or in a prototyping design environment.</li><li>Experience with XR software development using unity/unreal or other engines.</li></ul>`,
    isActive: true,
    isFeatured: true,
    applicants: mockApplicants,
    city: "New York",
    district: "NY",
    experienceLevel: "mid",
  },
  {
    id: "1",
    title: "Software Engineer III, Full Stack",
    locationType: "in-office",
    jobType: "full-time",
    salary: "$150k - $200k",
    description: "<p>We are looking for a Software Engineer III to join our team in New York.</p>",
    isActive: true,
    isFeatured: false,
    applicants: [],
    city: "New York",
    district: "NY",
    experienceLevel: "senior",
  },
  {
    id: "2",
    title: "Staff Software Engineer, Frontend",
    locationType: "hybrid",
    jobType: "full-time",
    salary: "$200k+",
    description: "<p>Join our frontend architecture team.</p>",
    isActive: true,
    isFeatured: false,
    applicants: [],
    city: "Los Gatos",
    district: "CA",
    experienceLevel: "lead",
  },
  {
    id: "4",
    title: "Product Designer",
    locationType: "hybrid",
    jobType: "part-time",
    salary: "$90 / hr",
    description: "Looking for a UI/UX expert.",
    isActive: true,
    isFeatured: true,
    applicants: mockApplicants,
    city: "Baku",
    district: "",
    experienceLevel: "mid",
    deadline: "2026-12-31" /* adding a mock deadline to test */
  }
];

// ------- Star Rating -------
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className="p-0 transition-transform hover:scale-110 focus:outline-none"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange?.(s)}
        >
          <Star
            size={14}
            className={cn(
              "transition-colors",
              (hovered || value) >= s
                ? "fill-foreground text-foreground"
                : "fill-none text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export type SortField = "name" | "stage" | "rating" | "appliedAt";
export type SortOrder = "asc" | "desc";

// ------- Applications Section -------
function ApplicationsSection({ applicants, jobId }: { applicants: Applicant[]; jobId: string }) {
  const [list, setList] = useState(applicants);
  
  // Filters
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("appliedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const updateApplicant = (id: string, patch: Partial<Applicant>) => {
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const filteredAndSorted = list
    .filter((a) => {
      if (stageFilter !== "all" && a.stage !== stageFilter) return false;
      if (ratingFilter !== "all" && a.rating !== ratingFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "stage":
          comparison = stageLabels[a.stage].localeCompare(stageLabels[b.stage]);
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "appliedAt":
          comparison = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <div className="mt-12 border-t border-slate-800/80 pt-12">
      <h3 className="text-xl font-bold text-white mb-8">
        Applications
      </h3>

      {/* Filters Summary / Quick Toggles */}
      <div className="flex items-center gap-2 mb-8">
        <button className="h-8 px-3 rounded-lg border border-slate-800 bg-slate-900/40 text-[11px] font-bold text-slate-300 flex items-center gap-2 hover:bg-slate-800 transition-colors">
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">4</span>
          Stage
          <ChevronDown size={12} className="text-slate-500" />
        </button>
        <button className="h-8 px-3 rounded-lg border border-slate-800 bg-slate-900/40 text-[11px] font-bold text-slate-300 flex items-center gap-2 hover:bg-slate-800 transition-colors">
          Rating
          <ChevronDown size={12} className="text-slate-500" />
        </button>
      </div>

      <div className="border border-slate-800/50 rounded-xl overflow-hidden bg-slate-900/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-900/40">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    Stage
                    <div className="flex flex-col">
                      <ChevronUp size={10} className="text-slate-600 -mb-0.5" />
                      <ChevronDown size={10} className="text-slate-600 -mt-0.5 shadow-sm" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    Rating
                    <div className="flex flex-col">
                      <ChevronUp size={10} className="text-slate-600 -mb-0.5" />
                      <ChevronDown size={10} className="text-slate-600 -mt-0.5" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    Applied On
                    <div className="flex flex-col">
                      <ChevronUp size={10} className="text-slate-600 -mb-0.5" />
                      <ChevronDown size={10} className="text-slate-600 -mt-0.5" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredAndSorted.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-lg", app.color)}>
                        {app.initials}
                      </div>
                      <span className="text-[13px] font-bold text-slate-200">{app.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center bg-slate-800">
                          {app.stage === "applied" ? (
                             <span className="text-[10px] font-bold text-slate-400">?</span>
                          ) : (
                             <Star size={10} className="text-slate-400" />
                          )}
                       </div>
                       <div className="relative flex items-center">
                          <select
                            className="text-[13px] font-bold text-slate-300 bg-transparent focus:outline-none cursor-pointer appearance-none pr-5"
                            value={app.stage}
                            onChange={(e) => updateApplicant(app.id, { stage: e.target.value as Stage })}
                          >
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <ChevronDown size={12} className="text-slate-500 absolute right-0 pointer-events-none" />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={cn(
                            app.rating >= s ? "fill-white text-white" : "fill-none text-slate-700"
                          )}
                        />
                      ))}
                      <ChevronDown size={12} className="ml-1 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-400">
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cədvəl Altı - Pagination */}
        <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-900/40 flex items-center justify-end gap-8">
           <div className="flex items-center gap-3">
             <span className="text-[11px] font-bold text-slate-500">Rows per page</span>
             <div className="relative flex items-center">
                <select className="bg-transparent text-[11px] font-bold text-slate-300 focus:outline-none cursor-pointer appearance-none pr-5 hover:text-white transition-colors">
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
                <ChevronDown size={10} className="text-slate-600 absolute right-0 pointer-events-none" />
             </div>
           </div>
           <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
             Page 1 of 1
           </div>
           <div className="flex items-center gap-4">
              <button disabled className="text-slate-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/></svg>
              </button>
              <button disabled className="text-slate-700">
                <ChevronLeft size={16} />
              </button>
              <button disabled className="text-slate-700">
                <ChevronRight size={16} />
              </button>
              <button disabled className="text-slate-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// ------- Job Detail -------
function EmployerJobDetail({
  job,
  onEdit,
  onDelist,
  onToggleFeatured,
  onDelete,
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onDelist: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  
  const locConfig = locationTypeConfig[job.locationType];
  const jobTypeLabel = jobTypeLabels[job.jobType];
  
  const descText = job.description.replace(/<[^>]*>/g, "");
  const isLong = descText.length > 300; 

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              "h-7 px-3 flex items-center rounded-full text-[11px] font-bold border",
              job.isActive
                ? "bg-white text-[#0B0F19] border-white"
                : "bg-slate-800 text-slate-400 border-slate-700"
            )}>
              {job.isActive ? "Active" : "Delisted"}
            </span>
            {job.isFeatured && (
              <span className="h-7 px-3 flex items-center rounded-full text-[11px] font-bold bg-[#6366F1] text-white">
                Featured
              </span>
            )}
            {job.salary && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-300">
                <Banknote size={12} className="text-slate-500" />
                {job.salary}
              </span>
            )}
            {(job.city || job.district) && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-300">
                <MapPin size={12} className="text-slate-500" />
                {[job.city, job.district].filter(Boolean).join(", ")}
              </span>
            )}
            {locConfig && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-300">
                <Globe size={12} className="text-slate-500" />
                {locConfig.label === "Uzaqdan" ? "Remote" : locConfig.label}
              </span>
            )}
            <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-300">
              <Briefcase size={12} className="text-slate-500" />
              {jobTypeLabel === "Tam iş günü" ? "Full Time" : jobTypeLabel}
            </span>
            {job.experienceLevel && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-300">
                <User size={12} className="text-slate-500" />
                {job.experienceLevel === "junior" ? "Junior" : 
                 job.experienceLevel === "mid" ? "Mid Level" : 
                 job.experienceLevel === "senior" ? "Senior" : "Lead"}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(job)}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white transition-all"
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              onClick={() => {
                if (job.isActive) {
                  onDelist(job.id!);
                } else {
                  setIsPublishDialogOpen(true);
                }
              }}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white transition-all"
            >
              {job.isActive ? (
                <>
                  <EyeOff size={12} />
                  Delist
                </>
              ) : (
                <>
                  <Eye size={12} className="text-emerald-400" />
                  Publish
                </>
              )}
            </button>
            {job.isFeatured && (
              <button
                onClick={() => onToggleFeatured(job.id!)}
                className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white transition-all"
              >
                <Star size={12} className="fill-white" />
                UnFeature
              </button>
            )}
            <button
              onClick={() => onDelete(job.id!)}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-950/30 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white text-[11px] font-bold transition-all"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Qualifications Section */}
      <div className="mb-10">
         <div 
           className={cn(
             "text-[13px] leading-relaxed prose prose-sm dark:prose-invert max-w-none text-slate-300",
             "**:text-slate-300 **:marker:text-slate-500 prose-p:my-4 prose-ul:my-4 prose-li:my-1",
             "prose-strong:text-white prose-strong:text-base prose-strong:font-bold",
             !expanded && isLong && "line-clamp-10"
           )} 
           dangerouslySetInnerHTML={{ __html: job.description }} 
         />
         {isLong && (
           <button
             onClick={() => setExpanded(!expanded)}
             className="mt-4 text-[13px] font-bold text-white hover:underline underline-offset-4"
           >
             {expanded ? "Show Less" : "Read More"}
           </button>
         )}
      </div>

      <ApplicationsSection applicants={job.applicants} jobId={job.id!} />

      {/* Internal Dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl border-slate-800 bg-[#1C1F26] p-8 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-white text-center">
              Publish Job Listing
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center text-sm leading-relaxed">
              Once published, this job will be visible to all candidates on the job board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-3 mt-8">
            <Button variant="ghost" onClick={() => setIsPublishDialogOpen(false)} className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border-none">
              Cancel
            </Button>
            <Button onClick={() => { onDelist(job.id!); setIsPublishDialogOpen(false); }} className="rounded-xl bg-white text-slate-900 hover:bg-slate-200 font-bold">
              Yes, Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ------- Main Employer Page -------
// ------- Job Card Component -------
function JobCard({
  job,
  isSelected,
  onView,
  onEdit,
  onDelist,
  onToggleFeatured,
  onDelete,
}: {
  job: Job;
  isSelected: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelist: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}) {
  const locConfig = locationTypeConfig[job.locationType];
  const jobTypeLabel = jobTypeLabels[job.jobType];
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all cursor-pointer group",
      isSelected && "ring-2 ring-foreground/20"
    )}>
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
        <Briefcase size={20} className="text-muted-foreground" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0" onClick={onView}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-[15px] font-bold text-foreground truncate">{job.title}</h3>
          {job.isFeatured && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6] text-white">Önə Çıxarılmış</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn(
            "text-[11px] font-bold px-2 py-0.5 rounded-full",
            job.isActive ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"
          )}>
            {job.isActive ? "Aktiv" : "Deaktiv"}
          </span>
          {(job.city || job.district) && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin size={11} />
              {[job.city, job.district].filter(Boolean).join(", ")}
            </span>
          )}
          {locConfig && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              {locConfig.icon} {locConfig.label}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Briefcase size={11} /> {jobTypeLabel}
          </span>
          {job.salary && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Banknote size={11} /> {job.salary}
            </span>
          )}
        </div>
      </div>

      {/* Applicants + Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {job.applicants.length > 0 && (
          <button onClick={onView} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold text-foreground transition-colors">
            <Users size={13} />
            {job.applicants.length} Müraciət
          </button>
        )}
        <button
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Redaktə et"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelist}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={job.isActive ? "Deaktiv et" : "Aktivləşdir"}
        >
          {job.isActive ? <EyeOff size={14} /> : <Eye size={14} className="text-emerald-500" />}
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
          title="Sil"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function EmployerPage() {
  const { user } = useUser();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<"jobs" | "job-detail">("jobs");
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);

  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [delistedExpanded, setDelistedExpanded] = useState(true);

  const activeJobs = jobs.filter(j => j.isActive);
  const delistedJobs = jobs.filter(j => !j.isActive);
  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  const displayName = user
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : FALLBACK_USER.firstName;
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress || FALLBACK_USER.email;
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "??";

  const addJob = (data: JobFormData) => {
    const newJob: Job = {
      ...data,
      id: data.id || crypto.randomUUID(),
      applicants: mockApplicants,
    };
    setJobs((prev) => {
      const existing = prev.findIndex((j) => j.id === newJob.id);
      if (existing >= 0) {
         const updated = [...prev];
         updated[existing] = { ...newJob, applicants: prev[existing].applicants };
         return updated;
      }
      return [newJob, ...prev];
    });
    if (!data.id) {
       setSelectedJobId(newJob.id);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setEditOpen(true);
  };

  const handleEditSuccess = (data: JobFormData) => {
    addJob(data);
    setEditingJob(null);
    setEditOpen(false);
  };

  const handleDelist = (id: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, isActive: !j.isActive } : j)));
  };

  const handleToggleFeatured = (id: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, isFeatured: !j.isFeatured } : j)));
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (selectedJobId === id) {
       setSelectedJobId(null);
    }
  };

  const handleNavigate = (href: string) => {
    setDropdownOpen(false);
    router.push(href);
  };

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      {/* Left Sidebar - Image style */}
      <div className="w-[280px] shrink-0 border-r border-border bg-[#0B0F19] flex flex-col hidden lg:flex text-slate-300">
        {/* Header with Title and Add Button */}
        <div className="px-5 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-800">
              <Briefcase size={12} className="text-slate-400" />
            </div>
            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Job Listings</span>
          </div>
          <PostJobModal onSuccess={addJob}>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <Plus size={16} />
            </button>
          </PostJobModal>
        </div>

        {/* Navigation / Groups */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1 custom-scrollbar">
          {/* Active Jobs Accordion */}
          <div>
            <button
              onClick={() => setActiveExpanded(!activeExpanded)}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold hover:text-white transition-colors group"
            >
              <ChevronDown 
                size={14} 
                className={cn("text-slate-500 transition-transform duration-200", !activeExpanded && "-rotate-90")} 
              />
              <span className={cn(activeExpanded ? "text-white" : "text-slate-400")}>Active</span>
            </button>
            {activeExpanded && (
              <div className="mt-1 flex flex-col gap-0.5">
                {activeJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveView("job-detail");
                    }}
                    className={cn(
                      "w-full text-left px-8 py-2 text-[13px] font-medium transition-all truncate",
                      selectedJobId === job.id
                        ? "bg-slate-800/80 text-white rounded-lg shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg"
                    )}
                  >
                    {job.title}
                    {job.applicants.length > 0 && (
                      <span className="ml-2 text-[11px] text-slate-500 font-bold">{job.applicants.length}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delisted Jobs Accordion */}
          <div className="mt-2">
            <button
              onClick={() => setDelistedExpanded(!delistedExpanded)}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold hover:text-white transition-colors group"
            >
              <ChevronDown 
                size={14} 
                className={cn("text-slate-500 transition-transform duration-200", !delistedExpanded && "-rotate-90")} 
              />
              <span className={cn(delistedExpanded ? "text-white" : "text-slate-400")}>Delisted</span>
            </button>
            {delistedExpanded && (
              <div className="mt-1 flex flex-col gap-0.5">
                {delistedJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveView("job-detail");
                    }}
                    className={cn(
                      "w-full text-left px-8 py-2 text-[13px] font-medium transition-all truncate",
                      selectedJobId === job.id
                        ? "bg-slate-800/80 text-white rounded-lg shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg"
                    )}
                  >
                    {job.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-slate-800/50 flex flex-col gap-4">
          <Link
            href={ROUTES.jobBoard}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700/50">
              <Building2 size={16} />
            </div>
            Job Board
          </Link>

          {/* User Profile Info section */}
          {user && (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger className="w-full flex items-center gap-3 px-1 py-2 hover:bg-slate-800/30 rounded-xl transition-all outline-none">
                <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 bg-white shadow-sm overflow-hidden">
                   <svg width="24" height="24" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                   </svg>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[13px] font-bold text-white truncate uppercase tracking-tight">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate font-medium">
                    {displayEmail}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-300 shrink-0 text-slate-600",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                sideOffset={12}
                className="w-[260px] rounded-2xl p-2 border-slate-800 shadow-2xl bg-[#1C1F26] text-white"
              >
                {/* Profile items */}
                <DropdownMenuItem
                  className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all font-medium text-sm"
                  onClick={() => handleNavigate(ROUTES.employer)}
                >
                  <Building2 size={16} className="text-slate-500 shrink-0" />
                  <span>Təşkilatı İdarə Et</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all font-medium text-sm"
                  onClick={() => handleNavigate(ROUTES.settings.notifications)}
                >
                  <Users size={16} className="text-slate-500 shrink-0" />
                  <span>İstifadəçi Parametrləri</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all font-medium text-sm"
                  onClick={() => {
                    setDropdownOpen(false);
                    setOrgSwitcherOpen(true);
                  }}
                >
                  <ArrowLeftRight size={16} className="text-slate-500 shrink-0" />
                  <span>Təşkilatı Dəyiş</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-slate-800" />

                <SignOutButton>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-semibold text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LogOut size={16} className="shrink-0" />
                    <span>Çıxış</span>
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Right Content Pane - Dark theme */}
      <div className="flex-1 overflow-y-auto bg-[#0B0F19] custom-scrollbar border-l border-slate-800/30">
        {activeView === "job-detail" && selectedJob ? (
          <div className="p-6 lg:p-10">
            <button
              onClick={() => setActiveView("jobs")}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Elanlar Siyahısına Qayıt
            </button>
            <EmployerJobDetail
              job={selectedJob}
              onEdit={handleEdit}
              onDelist={handleDelist}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div className="p-6 lg:p-10 max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">İş Elanları</h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Vakansiyalarınızı idarə edin</p>
              </div>
              <PostJobModal onSuccess={addJob}>
                <button className="h-10 px-5 flex items-center gap-2 rounded-xl bg-foreground text-background text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">
                  <Plus size={16} />
                  Yeni Vakansiya
                </button>
              </PostJobModal>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Ümumi Elanlar", value: jobs.length, color: "bg-slate-100 dark:bg-white/5" },
                { label: "Aktiv Elanlar", value: activeJobs.length, color: "bg-emerald-50 dark:bg-emerald-950/30" },
                { label: "Deaktiv Elanlar", value: delistedJobs.length, color: "bg-orange-50 dark:bg-orange-950/30" },
                { label: "Ümumi Müraciətlər", value: jobs.reduce((s, j) => s + j.applicants.length, 0), color: "bg-purple-50 dark:bg-purple-950/30" },
              ].map((stat) => (
                <div key={stat.label} className={cn("rounded-2xl p-4 border border-border/60", stat.color)}>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Jobs Grid */}
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/30">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Briefcase size={32} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Hələ elan yoxdur</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">İlk vakansiyangızı əlavə edərək istedadlı namizədləri cəlb edin.</p>
                <PostJobModal onSuccess={addJob}>
                  <button className="h-10 px-6 flex items-center gap-2 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 active:scale-95 transition-all">
                    <Plus size={15} />
                    İlk Vakansiyam
                  </button>
                </PostJobModal>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Active Section */}
                {activeJobs.length > 0 && (
                  <div className="mb-2">
                    <button
                      onClick={() => setActiveExpanded(!activeExpanded)}
                      className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 hover:text-foreground transition-colors"
                    >
                      <ChevronDown size={14} className={cn("transition-transform", !activeExpanded && "-rotate-90")} />
                      Aktiv ({activeJobs.length})
                    </button>
                    {activeExpanded && (
                      <div className="flex flex-col gap-3">
                        {activeJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            isSelected={selectedJobId === job.id}
                            onView={() => { setSelectedJobId(job.id); setActiveView("job-detail"); }}
                            onEdit={() => handleEdit(job)}
                            onDelist={() => handleDelist(job.id)}
                            onToggleFeatured={() => handleToggleFeatured(job.id)}
                            onDelete={() => handleDelete(job.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Delisted Section */}
                {delistedJobs.length > 0 && (
                  <div>
                    <button
                      onClick={() => setDelistedExpanded(!delistedExpanded)}
                      className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 hover:text-foreground transition-colors"
                    >
                      <ChevronDown size={14} className={cn("transition-transform", !delistedExpanded && "-rotate-90")} />
                      Deaktiv ({delistedJobs.length})
                    </button>
                    {delistedExpanded && (
                      <div className="flex flex-col gap-3">
                        {delistedJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            isSelected={selectedJobId === job.id}
                            onView={() => { setSelectedJobId(job.id); setActiveView("job-detail"); }}
                            onEdit={() => handleEdit(job)}
                            onDelist={() => handleDelist(job.id)}
                            onToggleFeatured={() => handleToggleFeatured(job.id)}
                            onDelete={() => handleDelete(job.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Organization Switcher Modal */}
      {orgSwitcherOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOrgSwitcherOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#1C1F26] rounded-3xl shadow-2xl border border-border p-6 z-10 min-w-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Təşkilatı Dəyiş</h3>
              <button
                onClick={() => setOrgSwitcherOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <OrganizationSwitcher
              appearance={{
                elements: {
                  rootBox: "w-full",
                  organizationSwitcherTrigger: "w-full",
                },
              }}
              hidePersonal={false}
              afterSelectOrganizationUrl={ROUTES.employer}
              afterSelectPersonalUrl={ROUTES.jobBoard}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingJob && (
        <PostJobModal
          key={editingJob.id}
          initialData={editingJob}
          onSuccess={handleEditSuccess}
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setEditingJob(null);
          }}
        />
      )}
    </div>
  );
}
