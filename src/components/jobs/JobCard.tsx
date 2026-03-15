"use client";

import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import { formatRelativeTime } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import {
  MapPin,
  Briefcase,
  Clock,
  Award,
  Building,
  Globe,
  Network,
  Banknote,
  Heart,
  Eye,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  isSelected?: boolean;
}

const locationTypeConfig = {
  "in-office": { label: "Ofisdə", icon: <Building size={12} /> },
  hybrid: { label: "Hibrid", icon: <Network size={12} /> },
  remote: { label: "Uzaqdan", icon: <Globe size={12} /> },
  any: { label: "İstənilən", icon: <MapPin size={12} /> },
};

const jobTypeConfig: Record<string, string> = {
  "full-time": "Tam iş günü",
  "part-time": "Yarımştat",
  contract: "Müqavilə",
  internship: "Təcrübəçi",
  any: "İstənilən",
};

const expLevelConfig: Record<string, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  any: "İstənilən",
};

export default function JobCard({ job, onClick, isSelected }: JobCardProps) {
  const [logoError, setLogoError] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null); // null means not mounted yet
  const [optimisticLikes, setOptimisticLikes] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (job?.id) {
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      setIsLiked(likedJobs.includes(job.id));
    }
  }, [job?.id]);

  const views = job?.viewsCount ?? 0;
  
  // Məntiqli göstərici: əgər optimistic deyilərsə bazadakı likesCount (və ya 0) istifadə olunur.
  const baseLikes = job?.likesCount ?? 0;
  const displayLikes = optimisticLikes !== null ? optimisticLikes : baseLikes;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (isLiked) return; // Prevent multiple likes

    // Optimistic UI Update: 
    setIsLiked(true);
    setOptimisticLikes(displayLikes + 1);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      await fetch(`${API_BASE}/api/jobs/${job.id}/like`, { method: "POST" });
      
      // Save to localStorage
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      localStorage.setItem('likedJobs', JSON.stringify([...likedJobs, job.id]));
    } catch (err) {
      console.error("Failed to like job", err);
      // Revert optimism if failed
      setIsLiked(false);
      setOptimisticLikes(null); // Return to base
    }
  };

  const locConfig = locationTypeConfig[job.locationType] || locationTypeConfig.any;
  const expLabel = expLevelConfig[job.experienceLevel] || expLevelConfig.any;

  const showLogo = job.companyLogo && !logoError;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "border rounded-2xl p-4 sm:p-5 cursor-pointer group transition-all duration-300 relative overflow-hidden backdrop-blur-xl",
        job.featured 
          ? "bg-white dark:bg-purple-950/20 shadow-lg shadow-purple-500/5 dark:shadow-purple-950/40 border-purple-500/20 dark:border-purple-500/40" 
          : "bg-card dark:bg-slate-900/40 border-border dark:border-white/20 shadow-sm dark:shadow-black/20",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md dark:ring-white/10"
          : job.featured
            ? "hover:border-purple-500/40"
            : "hover:border-primary/20 hover:shadow-md"
      )}
    >
      {/* Background Glow for Featured */}
      {job.featured && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-full -mr-16 -mt-16 pointer-events-none" />
      )}

      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative z-10">
        {/* Company Logo */}
        <div className="shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.25rem] bg-background dark:bg-slate-900 border border-border dark:border-white/10 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
          {showLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-2 sm:p-3 dark:brightness-[1.2]"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-xl sm:text-2xl text-muted-foreground/40">
              {job.company[0]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 w-full min-w-0">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-bold text-base sm:text-lg leading-snug text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground font-semibold tracking-wide">
                {job.company}
              </p>
            </div>
            {/* Time + New badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                {isMounted ? formatRelativeTime(job.postedAt) : "..."}
              </span>
              {job.isNew && (
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] bg-foreground text-background shadow-sm">
                  Yeni
                </span>
              )}
            </div>
          </div>

          {/* Footer: Tags and Stats */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mt-1">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
              {job.featured && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                < Award size={11} className="shrink-0" />
                Önə çıxan
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <MapPin size={11} className="shrink-0" />
              {job.location || job.city}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="shrink-0 scale-90">{locConfig.icon}</span>
              {locConfig.label}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Briefcase size={11} className="shrink-0" />
              {jobTypeConfig[job.jobType] || jobTypeConfig.any}
            </span>
            {job.salary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-bold bg-muted/40 text-foreground border border-border">
                <Banknote size={11} className="shrink-0" />
                {job.salary}
              </span>
            )}
            </div>

            {/* Stats (Views & Likes) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 sm:pb-0.5 self-start sm:self-end">
              <div 
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                title={`${views} baxış`}
              >
                <Eye size={15} className="stroke-[2.5]" />
                <span className="text-[11px] sm:text-xs font-bold">{views}</span>
              </div>
              <button 
                className={cn(
                  "flex items-center gap-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-sm",
                  isLiked 
                    ? "text-rose-500" 
                    : "text-muted-foreground hover:text-rose-500 group/like"
                )}
                title={`${displayLikes} bəyənmə`}
                onClick={handleLike}
                disabled={isLiked === null || isLiked} // Disable if not mounted or already liked
              >
                <Heart 
                  size={15} 
                  className={cn(
                    "stroke-[2.5]",
                    isLiked ? "fill-rose-500" : "group-hover/like:fill-rose-500/20 active:scale-95 transition-transform"
                  )} 
                />
                <span className={cn(
                  "text-[11px] sm:text-xs font-bold",
                  !isLiked && "group-hover/like:text-rose-500"
                )}>
                  {displayLikes}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
