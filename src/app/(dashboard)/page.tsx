"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Filter, GripVertical } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { Job } from "@/types/job";
import JobFiltersPanel from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import JobDetailPanel from "@/components/jobs/JobDetailPanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";

export default function JobBoardPage() {
  const { jobs, filters, setFilters, applyFilters, resetFilters } = useJobs();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Resizable logic
  const [leftWidth, setLeftWidth] = useState(480);
  const isResizing = useRef(false);
  const requestRef = useRef<number | null>(null);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }

    requestRef.current = requestAnimationFrame(() => {
      // Calculate new width: mouse X - filter panel width (256px)
      const newWidth = e.clientX - 256;
      if (newWidth > 400 && newWidth < 900) {
        setLeftWidth(newWidth);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    if (window.innerWidth < 1024) {
      setIsDetailOpen(true);
    }
  };

  const handleApply = () => {
    setSelectedJob(null);
    setIsDetailOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-65px)] overflow-hidden bg-background dark:bg-[#0b0e14]">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-20 px-4 py-3 bg-background dark:bg-[#0b0e14] border-b border-border dark:border-white/10 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-foreground">İş Elanları</h2>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted transition-all cursor-pointer bg-card shadow-sm outline-none active:scale-95">
            <Filter size={14} />
            Filtrlər
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[300px] border-l border-border dark:border-white/10 dark:bg-[#0b0e14]">
            <div className="h-full pt-10">
              <JobFiltersPanel
                filters={filters}
                onChange={setFilters}
                onApply={() => {
                  applyFilters();
                  setIsFilterOpen(false);
                }}
                onReset={resetFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Left Filter panel */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-border dark:border-white/10 h-full overflow-hidden">
        <JobFiltersPanel
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </aside>

      {/* Middle: Job list */}
      <main
        style={{ 
          width: (selectedJob && typeof window !== 'undefined' && window.innerWidth >= 1024) 
            ? `${leftWidth}px` 
            : "100%" 
        }}
        className={cn(
          "h-full overflow-y-auto bg-muted/5 dark:bg-white/2 transition-all duration-300",
          selectedJob ? "lg:shrink-0" : "flex-1",
          "px-4 py-3 sm:py-5"
        )}
      >
        <div className="hidden lg:flex items-center justify-between mb-6">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-foreground tracking-tighter">İş Elanları</h1>
            <p className="text-xs text-muted-foreground font-medium">Sizin üçün ən uyğun vakansiyalar</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{jobs.length} vakansiya</p>
          </div>
        </div>
        <JobList
          jobs={jobs}
          selectedJobId={selectedJob?.id}
          onSelect={handleSelectJob}
        />
      </main>

      {/* Resizer Handle */}
      {selectedJob && (
        <div
          onMouseDown={startResizing}
          className="hidden lg:flex w-1.5 hover:w-1.5 group cursor-col-resize items-center justify-center bg-transparent transition-all relative z-30"
        >
          {/* Visual line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border dark:bg-white/10 group-hover:bg-primary group-hover:w-[2px] transition-all" />
          
          {/* Handle indicator */}
          <div className="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 rounded-full bg-primary items-center justify-center text-white shadow-lg shadow-primary/20 pointer-events-none transition-all scale-110">
            <GripVertical size={10} strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Desktop: Right detail panel */}
      {selectedJob && (
        <div className="hidden lg:flex flex-1 h-full overflow-hidden">
          <JobDetailPanel
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
          />
        </div>
      )}

      {/* Mobile: Detail panel as Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent 
          side="bottom" 
          className="p-0 h-[92vh] max-h-[92vh] rounded-t-[2.5rem] overflow-hidden border-none lg:hidden"
          showCloseButton={false}
        >
          {selectedJob && (
            <JobDetailPanel
              job={selectedJob}
              onClose={() => setIsDetailOpen(false)}
              onApply={handleApply}
            />
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}

