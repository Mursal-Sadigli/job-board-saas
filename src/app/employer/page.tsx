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
  Menu,
  CreditCard,
  ArrowLeftRight,
  LogOut,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  FileText,
  Calendar,
  PieChart
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import Image from "next/image";

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
  screening: "İlkin seçim",
  interview: "Müsahibə",
  offer: "Təklif",
  hired: "İşə qəbul",
  rejected: "İmtina",
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
    title: "UX Mühəndis, Android XR",
    locationType: "remote",
    jobType: "full-time",
    salary: "$225 / saat",
    description: `<p><strong>Minimum tələblər:</strong></p><ul><li>Bakalavr dərəcəsi və ya ekvivalent təcrübə.</li><li>Front-end inkişaf, texniki UX dizayn və ya prototipləşdirmə sahəsində 4 illik təcrübə.</li><li>Android UI prototipləşdirmə və ya inkişaf təcrübəsi.</li><li>Android Compose təcrübəsi.</li></ul><p><strong>Arzuolunan tələblər:</strong></p><ul><li>Native, təmiz və uyğun Android tətbiqlərinin hazırlanmasında 5 illik təcrübə.</li><li>Front-end mühəndisi, UX mühəndisi, kreativ və ya dizayn texnoloqu sahəsində 3 illik təcrübə.</li><li>Unity/Unreal və ya digər mühərriklərdən istifadə edərək XR proqram təminatının hazırlanması təcrübəsi.</li></ul>`,
    isActive: true,
    isFeatured: true,
    applicants: mockApplicants,
    city: "Nyu York",
    district: "NY",
    experienceLevel: "mid",
  },
  {
    id: "1",
    title: "Full Stack Proqramçı III",
    locationType: "in-office",
    jobType: "full-time",
    salary: "$150k - $200k",
    description: "<p>Nyu Yorkdakı komandamıza qoşulmaq üçün Full Stack Proqramçı axtarırıq.</p>",
    isActive: true,
    isFeatured: false,
    applicants: [],
    city: "Nyu York",
    district: "NY",
    experienceLevel: "senior",
  },
  {
    id: "2",
    title: "Baş Proqramçı, Frontend",
    locationType: "hybrid",
    jobType: "full-time",
    salary: "$200k+",
    description: "<p>Frontend arxitektura komandamıza qoşulun.</p>",
    isActive: true,
    isFeatured: false,
    applicants: [],
    city: "Los Qatos",
    district: "CA",
    experienceLevel: "lead",
  },
  {
    id: "4",
    title: "Məhsul Dizayneri",
    locationType: "hybrid",
    jobType: "part-time",
    salary: "$90 / saat",
    description: "UI/UX eksperti axtarılır.",
    isActive: true,
    isFeatured: true,
    applicants: mockApplicants,
    city: "Bakı",
    district: "",
    experienceLevel: "mid",
    deadline: "2026-12-31" 
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
    <div className="mt-12 border-t border-border pt-12">
      <h3 className="text-xl font-bold text-foreground mb-8">
        Müraciətlər
      </h3>

      {/* Filters Summary / Quick Toggles */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button className="h-8 px-3 rounded-lg border border-border bg-muted/40 text-[11px] font-bold text-muted-foreground flex items-center gap-2 hover:bg-muted transition-colors">
          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">4</span>
          Mərhələ
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
        <button className="h-8 px-3 rounded-lg border border-border bg-muted/40 text-[11px] font-bold text-muted-foreground flex items-center gap-2 hover:bg-muted transition-colors">
          Reytinq
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
      </div>

      <div className="border border-border dark:border-white/10 rounded-xl overflow-hidden bg-muted/10 dark:bg-card backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-white/10 bg-muted/30 dark:bg-white/5">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">AD</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    MƏRHƏLƏ
                    <div className="flex flex-col">
                      <ChevronUp size={10} className="text-muted-foreground/60 -mb-0.5" />
                      <ChevronDown size={10} className="text-muted-foreground/60 -mt-0.5 shadow-sm" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    REYTİNQ
                    <div className="flex flex-col">
                      <ChevronUp size={10} className="text-muted-foreground/60 -mb-0.5" />
                      <ChevronDown size={10} className="text-muted-foreground/60 -mt-0.5" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    TƏQDİM TARİXİ
                    <div className="flex flex-col">
                      <ChevronUp size={10} className="text-muted-foreground/60 -mb-0.5" />
                      <ChevronDown size={10} className="text-muted-foreground/60 -mt-0.5" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/10">
              {filteredAndSorted.map((app) => (
                <tr key={app.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-md", app.color)}>
                        {app.initials}
                      </div>
                      <span className="text-[13px] font-bold text-foreground">{app.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full border border-border dark:border-white/10 flex items-center justify-center bg-muted dark:bg-white/5">
                          {app.stage === "applied" ? (
                             <span className="text-[10px] font-bold text-muted-foreground">?</span>
                          ) : (
                             <Star size={10} className="text-muted-foreground" />
                          )}
                       </div>
                       <div className="relative flex items-center">
                          <select
                            className="text-[13px] font-bold text-foreground bg-transparent focus:outline-none cursor-pointer appearance-none pr-5"
                            value={app.stage}
                            onChange={(e) => updateApplicant(app.id, { stage: e.target.value as Stage })}
                          >
                            <option value="applied">Müraciət</option>
                            <option value="screening">İlkin seçim</option>
                            <option value="interview">Müsahibə</option>
                            <option value="offer">Təklif</option>
                            <option value="hired">İşə qəbul</option>
                            <option value="rejected">İmtina</option>
                          </select>
                          <ChevronDown size={12} className="text-muted-foreground absolute right-0 pointer-events-none" />
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
                            app.rating >= s ? "fill-foreground text-foreground" : "fill-none text-muted-foreground/30"
                          )}
                        />
                      ))}
                      <ChevronDown size={12} className="ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString("az-AZ", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cədvəl Altı - Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-border dark:border-white/10 bg-muted/30 dark:bg-white/5 flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <span className="text-[11px] font-bold text-muted-foreground">Hər səhifədə</span>
             <div className="relative flex items-center">
                <select className="bg-transparent text-[11px] font-bold text-foreground focus:outline-none cursor-pointer appearance-none pr-5 hover:text-primary transition-colors">
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
                <ChevronDown size={10} className="text-muted-foreground/60 absolute right-0 pointer-events-none" />
             </div>
           </div>
           <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
             Səhifə 1 / 1
           </div>
           <div className="flex items-center gap-2 sm:gap-4">
              <button disabled className="text-muted-foreground/40">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/></svg>
              </button>
              <button disabled className="text-muted-foreground/40">
                <ChevronLeft size={16} />
              </button>
              <button disabled className="text-muted-foreground/40">
                <ChevronRight size={16} />
              </button>
              <button disabled className="text-muted-foreground/40">
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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              "h-7 px-3 flex items-center rounded-full text-[11px] font-bold border",
              job.isActive
                ? "bg-foreground text-background border-foreground dark:border-white/20"
                : "bg-muted text-muted-foreground border-border dark:border-white/10"
            )}>
              {job.isActive ? "Aktiv" : "Deaktiv"}
            </span>
            {job.isFeatured && (
              <span className="h-7 px-3 flex items-center rounded-full text-[11px] font-bold bg-primary text-primary-foreground">
                Önə Çıxarılmış
              </span>
            )}
            {job.salary && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-border dark:border-white/10 bg-muted/30 text-[11px] font-bold text-muted-foreground">
                <Banknote size={12} className="text-muted-foreground/60" />
                {job.salary}
              </span>
            )}
            {(job.city || job.district) && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-border dark:border-white/10 bg-muted/30 text-[11px] font-bold text-muted-foreground">
                <MapPin size={12} className="text-muted-foreground/60" />
                {[job.city, job.district].filter(Boolean).join(", ")}
              </span>
            )}
            {locConfig && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-border dark:border-white/10 bg-muted/30 text-[11px] font-bold text-muted-foreground">
                <Globe size={12} className="text-muted-foreground/60" />
                {locConfig.label}
              </span>
            )}
            <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-border dark:border-white/10 bg-muted/30 text-[11px] font-bold text-muted-foreground">
              <Briefcase size={12} className="text-muted-foreground/60" />
              {jobTypeLabel}
            </span>
            {job.experienceLevel && (
              <span className="h-7 px-3 flex items-center gap-1.5 rounded-lg border border-border dark:border-white/10 bg-muted/30 dark:bg-white/5 text-[11px] font-bold text-muted-foreground">
                <User size={12} className="text-muted-foreground/60" />
                {job.experienceLevel === "junior" ? "Kiçik mütəxəssis" : 
                 job.experienceLevel === "mid" ? "Orta mütəxəssis" : 
                 job.experienceLevel === "senior" ? "Baş mütəxəssis" : "Rəhbər"}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onEdit(job)}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-muted dark:bg-white/5 hover:bg-muted/80 dark:hover:bg-white/10 text-[11px] font-bold text-foreground transition-all border border-border dark:border-white/10 shadow-sm"
            >
              <Pencil size={12} className="text-muted-foreground" />
              Redaktə
            </button>
            <button
              onClick={() => {
                if (job.isActive) {
                  onDelist(job.id!);
                } else {
                  setIsPublishDialogOpen(true);
                }
              }}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-muted hover:bg-muted/80 text-[11px] font-bold text-foreground transition-all border border-border dark:border-white/10 shadow-sm"
            >
              {job.isActive ? (
                <>
                  <EyeOff size={12} className="text-muted-foreground" />
                  Deaktiv et
                </>
              ) : (
                <>
                  <Eye size={12} className="text-emerald-500" />
                  Dərc et
                </>
              )}
            </button>
            {job.isFeatured && (
              <button
                onClick={() => onToggleFeatured(job.id!)}
                className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-muted hover:bg-muted/80 text-[11px] font-bold text-foreground transition-all border border-border dark:border-white/10 shadow-sm"
              >
                <Star size={12} className="fill-primary text-primary" />
                Önə Çıxarma
              </button>
            )}
            <button
              onClick={() => onDelete(job.id!)}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 dark:border-red-900/30 hover:bg-destructive hover:text-destructive-foreground text-[11px] font-bold transition-all shadow-sm dark:bg-red-950/20 dark:hover:bg-red-950/40"
            >
              <Trash2 size={12} />
              Sil
            </button>
          </div>
        </div>
      </div>

      {/* Qualifications Section */}
      <div className="mb-10">
         <div 
           className={cn(
             "text-[13px] leading-relaxed prose prose-sm dark:prose-invert max-w-none text-muted-foreground",
             "**:text-muted-foreground **:marker:text-muted-foreground/60 prose-p:my-4 prose-ul:my-4 prose-li:my-1",
             "prose-strong:text-foreground prose-strong:text-base prose-strong:font-bold",
             !expanded && isLong && "line-clamp-10"
           )} 
           dangerouslySetInnerHTML={{ __html: job.description }} 
         />
         {isLong && (
           <button
             onClick={() => setExpanded(!expanded)}
             className="mt-4 text-[13px] font-bold text-foreground hover:underline underline-offset-4"
           >
             {expanded ? "Daha az göstər" : "Daha çox oxu"}
           </button>
         )}
      </div>

      <ApplicationsSection applicants={job.applicants} jobId={job.id!} />

      {/* Internal Dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl border-border dark:border-white/10 bg-card p-8 shadow-2xl backdrop-blur-xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-foreground text-center">
              Vakansiyanı Dərc Et
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center text-sm leading-relaxed">
              Dərc edildikdən sonra bu vakansiya iş axtaranlar üçün görünən olacaq.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-3 mt-8">
            <Button variant="ghost" onClick={() => setIsPublishDialogOpen(false)} className="rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold border-none text-xs">
              Ləğv et
            </Button>
            <Button onClick={() => { onDelist(job.id!); setIsPublishDialogOpen(false); }} className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs">
              Bəli, Dərc et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
      "rounded-2xl border border-border dark:border-white/10 bg-card p-5 flex flex-col lg:flex-row lg:items-center gap-4 hover:shadow-lg dark:hover:shadow-white/5 transition-all cursor-pointer group backdrop-blur-xl",
      isSelected && "ring-2 ring-foreground/20 dark:ring-white/20"
    )}>
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-muted dark:bg-white/5 flex items-center justify-center shrink-0">
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
            job.isActive ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400" : "bg-muted dark:bg-white/5 text-muted-foreground"
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
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
        {job.applicants.length > 0 && (
          <button onClick={onView} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold text-foreground transition-colors">
            <Users size={13} />
            {job.applicants.length} Müraciət
          </button>
        )}
        <button
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border dark:border-white/10 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Redaktə et"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelist}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border dark:border-white/10 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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

// ------- Main Employer Page -------
export default function EmployerPage() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [activeView, setActiveView] = useState<"jobs" | "job-detail">("jobs");
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);

  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [delistedExpanded, setDelistedExpanded] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    router.push(href);
  };


  return (
    <div className="p-6 pt-0 lg:p-10 lg:pt-10 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pl-12 pr-6 lg:pl-16 sm:pr-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Vakansiyalar</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 font-medium">İş elanlarınızı idarə edin</p>
        </div>
        <PostJobModal onSuccess={addJob}>
          <button className="h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-foreground text-background text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto mt-2 sm:mt-0">
            <Plus size={16} />
            Yeni Vakansiya
          </button>
        </PostJobModal>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ümumi Elanlar", value: jobs.length, color: "bg-slate-100 dark:bg-white/5" },
          { label: "Aktiv Elanlar", value: activeJobs.length, color: "bg-emerald-50 dark:bg-emerald-950/30" },
          { label: "Deaktiv Elanlar", value: delistedJobs.length, color: "bg-orange-50 dark:bg-orange-950/30" },
          { label: "Ümumi Müraciətlər", value: jobs.reduce((s, j) => s + j.applicants.length, 0), color: "bg-purple-50 dark:bg-purple-950/30" },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-2xl p-4 border border-border/60 dark:border-white/10 shadow-sm", stat.color)}>
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

      {/* Job Detail View - Overlays the list when active */}
      {activeView === "job-detail" && selectedJob && (
        <div className="fixed inset-0 z-60 bg-background/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-4xl bg-card border-l border-border h-full overflow-y-auto animate-in slide-in-from-right duration-300">
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
          </div>
        </div>
      )}

      {/* Organization Switcher Modal */}
      {orgSwitcherOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOrgSwitcherOpen(false)}
          />
          <div className="relative bg-card rounded-3xl shadow-2xl border border-border p-6 z-10 min-w-[320px]">
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
              afterSelectOrganizationUrl={ROUTES.employer.root}
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
