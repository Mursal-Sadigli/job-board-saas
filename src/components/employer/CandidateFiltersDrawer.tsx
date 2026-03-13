"use client";

import { useState } from "react";
import { 
  X, 
  Filter, 
  RotateCcw, 
  Check, 
  Briefcase, 
  Star, 
  MapPin, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CandidateStatus } from "@/types/ats";
import { cn } from "@/utils/cn";
import { Separator } from "@/components/ui/separator";

interface FilterState {
  status: CandidateStatus[];
  experience: string;
  minScore: number;
  location: string;
}

interface CandidateFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const STATUS_OPTIONS: { label: string; value: CandidateStatus; color: string }[] = [
  { label: "Müraciət", value: "Applied", color: "text-blue-500" },
  { label: "Seçim", value: "Screening", color: "text-purple-500" },
  { label: "Müsahibə", value: "Interview", color: "text-orange-500" },
  { label: "Təklif", value: "Offered", color: "text-emerald-500" },
  { label: "İşə Alındı", value: "Hired", color: "text-green-500" },
  { label: "İmtina", value: "Rejected", color: "text-red-500" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Hamısı", value: "all" },
  { label: "0-1 il", value: "0-1" },
  { label: "1-3 il", value: "1-3" },
  { label: "3-5 il", value: "3-5" },
  { label: "5-10 il", value: "5-10" },
  { label: "10+ il", value: "10+" },
];

export function CandidateFiltersDrawer({ 
  open, 
  onOpenChange, 
  onApplyFilters,
  initialFilters 
}: CandidateFiltersDrawerProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleStatus = (status: CandidateStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleReset = () => {
    const resetState: FilterState = {
      status: [],
      experience: "all",
      minScore: 0,
      location: ""
    };
    setFilters(resetState);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent showCloseButton={false} className="w-full sm:max-w-md p-0 border-l border-border dark:border-white/10 bg-background dark:bg-[#020617] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-border dark:border-white/5 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Filter size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">Filtrlər</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Namizəd süzgəci</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl hover:bg-muted dark:hover:bg-white/5"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          {/* Status Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Users size={14} className="opacity-50" /> STATUS
              </h3>
              {filters.status.length > 0 && (
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, status: [] }))}
                  className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Təmizlə
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((option) => {
                const isSelected = filters.status.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleStatus(option.value)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all active:scale-[0.98]",
                      isSelected 
                        ? "bg-primary/5 border-primary text-primary" 
                        : "bg-muted/30 border-border dark:border-white/5 text-muted-foreground hover:bg-muted shadow-xs"
                    )}
                  >
                    <span className={cn(isSelected ? "text-primary" : option.color)}>{option.label}</span>
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border dark:bg-white/5" />

          {/* Experience Section */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Briefcase size={14} className="opacity-50" /> TƏCRÜBƏ
            </h3>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((option) => {
                const isSelected = filters.experience === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({ ...prev, experience: option.value }))}
                    className={cn(
                      "px-4 py-2 rounded-xl border text-[10px] font-bold transition-all active:scale-[0.95]",
                      isSelected 
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                        : "bg-muted/30 border-border dark:border-white/5 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border dark:bg-white/5" />

          {/* Matching Score Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Star size={14} className="opacity-50" /> UYĞUNLUQ BALI (MIN)
              </h3>
              <span className="text-xs font-black text-primary">{filters.minScore}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minScore}
              onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-muted dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[9px] font-black text-muted-foreground/40 px-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <Separator className="bg-border dark:bg-white/5" />

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <MapPin size={14} className="opacity-50" /> MƏKAN
            </h3>
            <input 
              type="text"
              placeholder="Şəhər və ya ölkə..."
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border dark:border-white/5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-border dark:border-white/5 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1 h-12 rounded-xl font-black text-xs gap-2 border-border dark:border-white/10 hover:bg-muted dark:hover:bg-white/5"
          >
            <RotateCcw size={14} /> Sıfırla
          </Button>
          <Button 
            onClick={() => {
              onApplyFilters(filters);
              onOpenChange(false);
            }}
            className="flex-2 h-12 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Tətbiq Et
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
