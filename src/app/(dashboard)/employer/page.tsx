"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PostJobModal, type JobFormData } from "@/components/employer/PostJobModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ------- Types -------
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return <ChevronDown size={12} className={cn("text-foreground transition-transform", sortOrder === "asc" && "rotate-180")} />;
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      <h3 className="text-xl font-bold text-foreground mb-6">
        Müraciətlər
      </h3>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as Stage | "all")}
            className="h-8 rounded-lg border border-border bg-card px-3 pr-8 text-xs font-semibold text-foreground appearance-none shadow-sm hover:bg-muted/50 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">Bütün Mərhələlər ({list.length})</option>
            {Object.entries(stageLabels).map(([v, l]) => (
              <option key={v} value={v} className="bg-card text-foreground">{l}</option>
            ))}
          </select>
          <ChevronDown size={12} className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        
        <div className="relative">
          <select
             value={ratingFilter}
             onChange={(e) => setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
             className="h-8 rounded-lg border border-border bg-card px-3 pr-8 text-xs font-semibold text-foreground appearance-none shadow-sm hover:bg-muted/50 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
             <option value="all">Bütün Reytinqlər</option>
             {[5,4,3,2,1].map(r => (
               <option key={r} value={r} className="bg-card text-foreground">{r} Ulduz</option>
             ))}
          </select>
          <ChevronDown size={12} className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="py-10 text-center rounded-2xl border border-dashed border-border bg-card/30">
          <Users size={28} className="mx-auto text-muted-foreground/20 mb-2" />
          <p className="text-sm text-muted-foreground">Müraciət tapılmadı</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/20 text-xs font-bold text-muted-foreground select-none">
            <button onClick={() => handleSort("name")} className="flex items-center gap-1.5 hover:text-foreground transition-colors group text-left">
               Ad <SortIcon field="name" />
            </button>
            <button onClick={() => handleSort("stage")} className="flex items-center gap-1.5 hover:text-foreground transition-colors group text-left w-fit">
               Mərhələ <SortIcon field="stage" />
            </button>
            <button onClick={() => handleSort("rating")} className="flex items-center gap-1.5 hover:text-foreground transition-colors group text-left w-fit">
               Reytinq <SortIcon field="rating" />
            </button>
            <button onClick={() => handleSort("appliedAt")} className="flex items-center gap-1.5 hover:text-foreground transition-colors group text-left w-fit">
               Müraciət Tarixi <SortIcon field="appliedAt" />
            </button>
            <span className="w-10"></span>
          </div>
          {/* Rows */}
          <div className="divide-y divide-border">
            {filteredAndSorted.map((app) => (
              <div
                key={app.id}
                className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 items-center px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0", app.color)}>
                    {app.initials}
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{app.name}</span>
                </div>

                {/* Stage */}
                <div className="flex items-center gap-1.5">
                  <div className="relative group">
                    <select
                      className={cn(
                        "text-sm font-medium focus:outline-none bg-transparent cursor-pointer appearance-none pr-4",
                        stageColors[app.stage]
                      )}
                      value={app.stage}
                      onChange={(e) => updateApplicant(app.id, { stage: e.target.value as Stage })}
                    >
                      {Object.entries(stageLabels).map(([v, l]) => (
                        <option key={v} value={v} className="bg-card text-foreground">{l}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="text-muted-foreground absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Rating */}
                <StarRating
                  value={app.rating}
                  onChange={(v) => updateApplicant(app.id, { rating: v })}
                />

                {/* Date */}
                <span className="text-sm text-foreground">
                  {new Date(app.appliedAt).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {/* Actions */}
                <div className="flex justify-end min-w-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer">
                      <MoreHorizontal size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl dark:bg-[#1C1F26] border border-border">
                      <DropdownMenuItem className="cursor-pointer text-sm font-medium py-2.5 px-3 rounded-lg focus:bg-slate-100 dark:focus:bg-white/5">
                        CV-ə Bax
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled className="text-sm font-medium text-muted-foreground py-2.5 px-3 rounded-lg">
                        Əhatə Məktubu Yoxdur
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {/* Pagination footer */}
            <div className="px-5 py-3 flex items-center justify-end gap-6 text-xs font-semibold text-muted-foreground">
               <div className="flex items-center gap-2">
                 Səhifəbaşına Sətir
                 <div className="relative">
                   <select className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer border rounded-md px-2 py-1 appearance-none pr-6">
                     <option value="10">10</option>
                     <option value="20">20</option>
                   </select>
                   <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>
               </div>
               <div>
                 Səhifə 1 (Cəmi 1)
               </div>
               <div className="flex items-center gap-1">
                  <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors disabled:opacity-50">«</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors disabled:opacity-50">‹</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors disabled:opacity-50">›</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors disabled:opacity-50">»</button>
               </div>
            </div>
          </div>
        </div>
      )}
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
  
  const locConfig = locationTypeConfig[job.locationType];
  const jobTypeLabel = jobTypeLabels[job.jobType];
  
  const descText = job.description.replace(/<[^>]*>/g, "");
  const isLong = descText.length > 500; // expanded slightly

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">
            {job.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
              job.isActive
                ? "bg-slate-100 dark:bg-white text-slate-900 dark:text-slate-900 border-border"
                : "bg-muted text-muted-foreground border-border"
            )}>
              {job.isActive ? "Aktiv" : "Deaktiv"}
            </span>
            {job.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#8B5CF6] text-white">
                Önə Çıxarılmış
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-border bg-card">
                <Banknote size={12} className="text-muted-foreground" />
                {job.salary}
              </span>
            )}
            {(job.city || job.district) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-border bg-card">
                <MapPin size={12} className="text-muted-foreground" />
                {[job.city, job.district].filter(Boolean).join(", ")}
              </span>
            )}
            {locConfig && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-border bg-card">
                {locConfig.icon}
                {locConfig.label === "Uzaqdan" ? "Remote" : locConfig.label}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-border bg-card">
              <Briefcase size={12} className="text-muted-foreground" />
              {jobTypeLabel === "Tam iş günü" ? "Full Time" : jobTypeLabel}
            </span>
            {job.experienceLevel && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-border bg-card text-foreground">
                <User size={12} className="text-muted-foreground" />
                {job.experienceLevel === "junior" ? "Junior" : 
                 job.experienceLevel === "mid" ? "Mid Level" : 
                 job.experienceLevel === "senior" ? "Senior" : "Lead"}
              </span>
            )}
            {job.deadline && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                 Son Tarix: {new Date(job.deadline).toLocaleDateString("az-AZ")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => onEdit(job)}
            className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground transition-colors shadow-sm"
          >
            <Pencil size={14} className="text-muted-foreground" />
            Redaktə Et
          </button>
          <button
            onClick={() => onDelist(job.id!)}
            className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground transition-colors shadow-sm"
          >
            {job.isActive ? <EyeOff size={14} className="text-muted-foreground" /> : <Eye size={14} className="text-emerald-500" />}
            {job.isActive ? "Deaktiv Et" : "Aktivləşdir"}
          </button>
          <button
            onClick={() => onToggleFeatured(job.id!)}
            className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground transition-colors shadow-sm"
          >
            <Star size={14} className={cn(job.isFeatured ? "fill-[#8B5CF6] text-[#8B5CF6]" : "text-muted-foreground")} />
            {job.isFeatured ? "Önə Çıxmanı Ləğv Et" : "Önə Çıxart"}
          </button>
          <button
            onClick={() => onDelete(job.id!)}
            className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white dark:hover:bg-red-500 text-sm font-semibold transition-colors shadow-sm"
          >
            <Trash2 size={14} />
            Sil
          </button>
        </div>
      </div>

      <div className="mb-8">
         <div 
           className={cn(
             "text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none text-foreground/80",
             "**:text-foreground/80 **:marker:text-foreground/80 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5",
             !expanded && isLong && "line-clamp-6"
           )} 
           dangerouslySetInnerHTML={{ __html: job.description }} 
         />
         {isLong && (
           <button
             onClick={() => setExpanded(!expanded)}
             className="mt-3 text-sm font-bold text-foreground hover:underline underline-offset-4"
           >
             {expanded ? "Daha az göstər" : "Daha çox oxuyun"}
           </button>
         )}
      </div>

      <ApplicationsSection applicants={job.applicants} jobId={job.id!} />
    </div>
  );
}

// ------- Main Employer Page -------
export default function EmployerPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [delistedExpanded, setDelistedExpanded] = useState(true);

  const activeJobs = jobs.filter(j => j.isActive);
  const delistedJobs = jobs.filter(j => !j.isActive);
  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs.find(j => j.isActive) || jobs[0] || null;

  useEffect(() => {
    if (!selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0].id!);
    }
  }, [jobs, selectedJobId]);

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

  return (
    <div className="flex bg-background h-full min-h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[300px] shrink-0 border-r border-border bg-slate-50 dark:bg-[#0B0F19] flex-col hidden lg:flex">
         <div className="pt-6 pb-4 px-6 flex items-center justify-between">
           <div className="p-0">
             <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1.5">WDS Jobs</h2>
             <span className="text-sm font-bold text-slate-900 dark:text-foreground">İş Elanları</span>
           </div>
           <PostJobModal onSuccess={addJob}>
             <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-muted-foreground transition-colors group">
               <Plus size={16} className="group-hover:text-slate-900 dark:group-hover:text-white" />
             </button>
           </PostJobModal>
         </div>

         <div className="flex-1 overflow-y-auto w-full custom-scrollbar py-2">
            {/* Active Group */}
            <div className="mb-4">
               <button 
                 onClick={() => setActiveExpanded(!activeExpanded)}
                 className="flex items-center justify-between w-full px-6 py-2 text-xs font-bold text-muted-foreground hover:text-slate-900 dark:hover:text-white mb-1"
               >
                  <span>Aktiv</span>
                  <ChevronDown size={14} className={cn("transition-transform", !activeExpanded && "-rotate-90")} />
               </button>
               {activeExpanded && activeJobs.map(job => (
                 <button
                   key={job.id}
                   onClick={() => setSelectedJobId(job.id!)}
                   className={cn(
                     "w-full flex items-center justify-between px-6 py-2.5 text-sm text-left truncate transition-colors border-l-2",
                     selectedJobId === job.id 
                       ? "bg-slate-200/70 dark:bg-white/5 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium shadow-sm" 
                       : "border-transparent text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                   )}
                 >
                   <span className="truncate pr-3 pl-1">{job.title}</span>
                   {job.applicants.length > 0 && (
                     <span className={cn(
                       "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                       selectedJobId === job.id
                        ? "bg-slate-900 text-white dark:bg-white/20 dark:text-white"
                        : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-white/50"
                     )}>
                       {job.applicants.length}
                     </span>
                   )}
                 </button>
               ))}
            </div>

            {/* Delisted Group */}
            {delistedJobs.length > 0 && (
              <div>
                 <button 
                   onClick={() => setDelistedExpanded(!delistedExpanded)}
                   className="flex items-center justify-between w-full px-6 py-2 text-xs font-bold text-muted-foreground hover:text-slate-900 dark:hover:text-white mb-1"
                 >
                    <span>Deaktivlər</span>
                    <ChevronDown size={14} className={cn("transition-transform", !delistedExpanded && "-rotate-90")} />
                 </button>
                 {delistedExpanded && delistedJobs.map(job => (
                   <button
                     key={job.id}
                     onClick={() => setSelectedJobId(job.id!)}
                     className={cn(
                       "w-full flex items-center justify-between px-6 py-2.5 text-sm text-left truncate transition-colors border-l-2",
                       selectedJobId === job.id 
                         ? "bg-slate-200/70 dark:bg-white/5 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium shadow-sm" 
                         : "border-transparent text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                     )}
                   >
                     <span className="truncate pr-3 pl-1">{job.title}</span>
                     {job.applicants.length > 0 && (
                       <span className={cn(
                         "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                         selectedJobId === job.id
                          ? "bg-slate-900 text-white dark:bg-white/20 dark:text-white"
                          : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-white/50"
                       )}>
                         {job.applicants.length}
                       </span>
                     )}
                   </button>
                 ))}
              </div>
            )}
         </div>
      </div>

      {/* Right Detail Pane */}
      <div className="flex-1 overflow-y-auto bg-background p-6 lg:p-10 custom-scrollbar border-l border-border/50">
         {selectedJob ? (
           <EmployerJobDetail 
             job={selectedJob}
             onEdit={handleEdit}
             onDelist={handleDelist}
             onToggleFeatured={handleToggleFeatured}
             onDelete={handleDelete}
           />
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
             <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 shadow-sm">
               <Building2 size={40} className="text-muted-foreground/40" />
             </div>
             <h3 className="text-2xl font-bold text-foreground mb-3">İş elanı tapılmadı</h3>
             <p className="text-sm text-muted-foreground mb-8 font-medium leading-relaxed">
               Detalları görmək üçün siyahıdan birinə klikləyin və ya başlamaq üçün yeni bir elan yaradın.
             </p>
             <PostJobModal onSuccess={addJob}>
               <button className="h-11 px-8 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-lg shadow-slate-900/10 dark:shadow-white/5 active:scale-95 transition-all">
                 <Plus size={16} />
                 İş Elanı Paylaş
               </button>
             </PostJobModal>
           </div>
         )}
      </div>

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
