"use client";

import { useState } from "react";
import {
  Building2,
  BarChart3,
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
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PostJobModal, type JobFormData } from "@/components/employer/PostJobModal";

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
  applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  screening: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  interview: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  hired: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const locationTypeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  "in-office": { label: "Ofisdə", icon: <Building size={11} /> },
  hybrid: { label: "Hibrid", icon: <Network size={11} /> },
  remote: { label: "Uzaqdan", icon: <Globe size={11} /> },
};

const jobTypeLabels: Record<string, string> = {
  "full-time": "Tam iş günü",
  "part-time": "Yarımştat",
  contract: "Müqavilə",
  internship: "Təcrübəçi",
};

// ------- Mock applicants -------
const mockApplicants: Applicant[] = [
  { id: "1", name: "Əli Əliyev", initials: "ƏƏ", color: "bg-blue-500", stage: "interview", rating: 4, appliedAt: "2025-06-02" },
  { id: "2", name: "Nigar Həsənova", initials: "NH", color: "bg-purple-500", stage: "applied", rating: 3, appliedAt: "2025-06-05" },
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
          className="p-0.5 transition-transform hover:scale-110"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange?.(s)}
        >
          <Star
            size={15}
            className={cn(
              "transition-colors",
              (hovered || value) >= s
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ------- Applications Section -------
function ApplicationsSection({ applicants, jobId }: { applicants: Applicant[]; jobId: string }) {
  const [list, setList] = useState(applicants);
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  const updateApplicant = (id: string, patch: Partial<Applicant>) => {
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const filtered = list.filter((a) => {
    if (stageFilter !== "all" && a.stage !== stageFilter) return false;
    if (ratingFilter !== "all" && a.rating !== ratingFilter) return false;
    return true;
  });

  return (
    <div className="mt-6 border-t border-border pt-6">
      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <Users size={16} className="text-muted-foreground" />
        Müraciətlər
        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
          {list.length}
        </span>
      </h3>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <select
          className="h-8 rounded-lg border border-border bg-muted/30 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as Stage | "all")}
        >
          <option value="all">Bütün Mərhələlər</option>
          {Object.entries(stageLabels).map(([v, l]) => (
            <option key={v} value={v} className="bg-card">{l}</option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-border bg-muted/30 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          value={ratingFilter}
          onChange={(e) =>
            setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
        >
          <option value="all">Bütün Reytinqlər</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r} className="bg-card">{"⭐".repeat(r)}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center rounded-xl border border-dashed border-border">
          <Users size={28} className="mx-auto text-muted-foreground/20 mb-2" />
          <p className="text-sm text-muted-foreground">Müraciət tapılmadı</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 px-4 py-2.5 bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Ad</span>
            <span>Mərhələ</span>
            <span>Reytinq</span>
            <span>Müraciət tarixi</span>
          </div>
          {/* Rows */}
          <div className="divide-y divide-border">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 items-center px-4 py-3 hover:bg-muted/20 transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0", app.color)}>
                    {app.initials}
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{app.name}</span>
                </div>

                {/* Stage */}
                <div>
                  <select
                    className={cn(
                      "text-[11px] font-bold border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring bg-transparent cursor-pointer",
                      stageColors[app.stage]
                    )}
                    value={app.stage}
                    onChange={(e) => updateApplicant(app.id, { stage: e.target.value as Stage })}
                  >
                    {Object.entries(stageLabels).map(([v, l]) => (
                      <option key={v} value={v} className="bg-card text-foreground">{l}</option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <StarRating
                  value={app.rating}
                  onChange={(v) => updateApplicant(app.id, { rating: v })}
                />

                {/* Date */}
                <span className="text-xs text-muted-foreground">
                  {new Date(app.appliedAt).toLocaleDateString("az-AZ", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ------- Job Card -------
const DESCRIPTION_TRUNCATE = 300;

function JobCard({
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
  const [showApps, setShowApps] = useState(false);

  const locConfig = locationTypeConfig[job.locationType];
  const jobTypeLabel = jobTypeLabels[job.jobType];
  const descText = job.description.replace(/<[^>]*>/g, "");
  const isLong = descText.length > DESCRIPTION_TRUNCATE;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Card Header - always visible */}
      <div className="px-5 pt-5 pb-4">
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground leading-tight">{job.title}</h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {/* Status badge */}
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                job.isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", job.isActive ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                {job.isActive ? "Aktiv" : "Deaktiv"}
              </span>
              {/* Featured badge */}
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Star size={9} className="fill-amber-500 text-amber-500" />
                  Önə Çıxan
                </span>
              )}
              {/* Location type */}
              {locConfig && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {locConfig.icon}
                  {locConfig.label}
                </span>
              )}
              {/* Job type */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Briefcase size={9} />
                {jobTypeLabel}
              </span>
              {/* Location */}
              {(job.city || job.district) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/5 text-slate-600 dark:text-slate-400 border border-border">
                  <MapPin size={9} />
                  {[job.district, job.city].filter(Boolean).join(", ")}
                </span>
              )}
              {/* Salary */}
              {job.salary && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-card text-foreground border border-border">
                  <Banknote size={9} className="text-muted-foreground/60" />
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Edit */}
            <button
              onClick={() => onEdit(job)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Redaktə et"
            >
              <Pencil size={14} />
            </button>
            {/* Delist / Relist */}
            <button
              onClick={() => onDelist(job.id!)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                job.isActive
                  ? "text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10"
                  : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
              )}
              title={job.isActive ? "Deaktiv et" : "Aktiv et"}
            >
              {job.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            {/* Featured toggle */}
            <button
              onClick={() => onToggleFeatured(job.id!)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                job.isFeatured
                  ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                  : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
              )}
              title={job.isFeatured ? "Önə çıxmanı ləğv et" : "Önə çıxar"}
            >
              <Star size={14} className={cn(job.isFeatured && "fill-amber-500")} />
            </button>
            {/* Delete */}
            <button
              onClick={() => onDelete(job.id!)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              title="Sil"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        {descText && (
          <div className="mt-2">
            {isLong && !expanded ? (
              <>
                <div
                  className="text-sm text-muted-foreground leading-relaxed **:text-muted-foreground prose prose-sm dark:prose-invert max-w-none line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
                <button
                  onClick={() => setExpanded(true)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-foreground/80 transition-colors"
                >
                  Daha çox oxu
                  <ChevronDown size={13} />
                </button>
              </>
            ) : (
              <>
                <div
                  className="text-sm text-muted-foreground leading-relaxed **:text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
                {isLong && (
                  <button
                    onClick={() => setExpanded(false)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-foreground/80 transition-colors"
                  >
                    Daha az göstər
                    <ChevronUp size={13} />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Toggle Applications */}
        <button
          onClick={() => setShowApps(!showApps)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Users size={13} />
          Müraciətlər ({job.applicants.length})
          {showApps ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Applications section */}
      {showApps && (
        <div className="px-5 pb-5">
          <ApplicationsSection applicants={job.applicants} jobId={job.id!} />
        </div>
      )}
    </div>
  );
}

// ------- Main Employer Page -------
export default function EmployerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editOpen, setEditOpen] = useState(false);

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
  };

  const activeCount = jobs.filter((j) => j.isActive).length;
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants.length, 0);

  return (
    <div className="h-full min-h-[calc(100vh-65px)] overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-white/5 transition-all">
                <Building2 size={24} className="text-white dark:text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl">
                  İşəgötürən Paneli
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Vakansiyalarınızı və namizədləri vahid paneldən idarə edin.
                </p>
              </div>
            </div>

            <PostJobModal onSuccess={addJob}>
              <button className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 group">
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                İş Elanı Paylaş
              </button>
            </PostJobModal>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Aktiv Elanlar", value: activeCount, icon: <Building2 size={18} />, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Cəmi Müraciətlər", value: totalApplicants, icon: <Users size={18} />, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Cəmi Elanlar", value: jobs.length, icon: <BarChart3 size={18} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="bg-card/50 rounded-[2.5rem] border border-dashed border-border p-12 text-center flex flex-col items-center justify-center shadow-inner transition-colors">
            <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6">
              <Building2 size={36} className="text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Hələ heç bir iş elanı yoxdur
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed font-medium">
              Müraciətləri və baxışları təqib etmək üçün ilk vakansiyanızı dərhal əlavə edin.
            </p>
            <PostJobModal onSuccess={addJob}>
              <button className="h-11 px-8 rounded-2xl border border-border bg-background text-sm font-bold text-foreground hover:bg-muted/50 transition-all active:scale-95 shadow-sm">
                Yeni elan yarat
              </button>
            </PostJobModal>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                İş Elanları ({jobs.length})
              </h2>
            </div>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onDelist={handleDelist}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal – controlled */}
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
