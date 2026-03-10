"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Filter, GripVertical } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { Job } from "@/types/job";
import JobFiltersPanel from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import JobDetailPanel from "@/components/jobs/JobDetailPanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function JobBoardPage() {
  const { jobs, filters, setFilters, applyFilters, resetFilters } = useJobs();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Resizable logic
  const [leftWidth, setLeftWidth] = useState(420);
  const isResizing = useRef(false);

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
    
    // Calculate new width: mouse X - filter panel width (256px)
    const newWidth = e.clientX - 256;
    if (newWidth > 300 && newWidth < 800) {
      setLeftWidth(newWidth);
    }
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
    setIsDetailOpen(true);
  };

  const handleApply = () => {
    setSelectedJob(null);
    setIsDetailOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-65px)] overflow-hidden bg-background">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-20 px-4 py-3 bg-background border-b border-border flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-foreground">İş Elanları</h2>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted transition-all cursor-pointer bg-card shadow-sm outline-none active:scale-95">
            <Filter size={14} />
            Filtrlər
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[300px] border-l border-border">
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
      <aside className="hidden lg:block w-64 shrink-0 border-r border-border h-full overflow-hidden">
        <JobFiltersPanel
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </aside>

      {/* Middle: Job list */}
      <main
        style={{ width: selectedJob ? `${leftWidth}px` : "100%" }}
        className={`
          h-full overflow-y-auto bg-muted/5 transition-all duration-300
          ${selectedJob ? "lg:shrink-0" : "flex-1"}
          px-4 py-5
        `}
      >
        <div className="hidden lg:flex items-center justify-between mb-6">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-foreground tracking-tighter">İş Elanları</h1>
            <p className="text-xs text-muted-foreground font-medium">Sizin üçün ən uyğun vakansiyalar</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border shadow-sm">
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
          className="hidden lg:flex w-2 hover:w-2 group cursor-col-resize items-center justify-center bg-border/20 hover:bg-primary/20 transition-all border-x border-border/50"
        >
          <div className="p-0.5 rounded-md bg-card border border-border shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
            <GripVertical size={12} />
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
        <SheetContent side="bottom" className="p-0 h-[90vh] rounded-t-2xl border-t border-border lg:hidden overflow-hidden">
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

