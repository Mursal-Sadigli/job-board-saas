"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import JobFiltersPanel from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function JobBoardPage() {
  const { jobs, filters, setFilters, applyFilters, resetFilters } = useJobs();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-65px)] overflow-hidden bg-background">
      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-20 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between shrink-0">
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
      <aside className="hidden lg:block w-72 shrink-0 border-r border-border h-full overflow-hidden">
        <JobFiltersPanel
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </aside>

      {/* Right: Job list */}
      <main className="flex-1 h-full overflow-y-auto px-4 sm:px-8 py-8 bg-muted/5 custom-scrollbar">
        <div className="max-w-4xl mx-auto lg:mx-0">
          <div className="hidden lg:flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tighter">İş Elanları</h1>
              <p className="text-sm text-muted-foreground font-medium">Sizin üçün ən uyğun vakansiyalar</p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-card border border-border shadow-sm">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{jobs.length} vakansiya</p>
            </div>
          </div>
          <JobList jobs={jobs} />
        </div>
      </main>
    </div>
  );
}
