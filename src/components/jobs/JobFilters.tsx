"use client";

import { JobFilters } from "@/types/job";
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

import { useState, useEffect } from "react";

interface JobFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function JobFiltersPanel({
  filters,
  onChange,
  onApply,
  onReset,
}: JobFiltersProps) {
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const response = await fetch(`${API_BASE}/api/jobs/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  const update = <K extends string>(key: K, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col h-full bg-background dark:bg-[#0b0e14] border-r-0 lg:border-r border-border dark:border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-white/10 bg-background dark:bg-[#0b0e14] sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm">
            <SlidersHorizontal size={14} />
          </div>
          <h2 className="font-bold text-sm text-foreground tracking-tight">
            Filtrlər
          </h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <RotateCcw size={12} />
          Sıfırla
        </button>
      </div>

      {/* Filter fields */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
        {/* Job Title */}
        <FilterField label="Vəzifə">
          <Input
            placeholder="məs. Frontend mühəndis"
            value={filters.title}
            onChange={(e) => update("title", e.target.value)}
            className="bg-card dark:bg-[#0f1423] border-border dark:border-white/10 h-11 rounded-xl focus-visible:ring-primary/20"
          />
        </FilterField>

        {/* Location Requirement */}
        <FilterField label="İş Yeri Növü">
          <Select
            value={filters.locationType}
            onValueChange={(value) =>
              update("locationType", value)
            }
          >
            <SelectTrigger className="bg-card dark:bg-[#0f1423] border-border dark:border-white/10 h-11 rounded-xl focus:ring-primary/20">
              <SelectValue placeholder="İş növünü seçin" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border dark:border-white/10 dark:bg-[#0f1423] backdrop-blur-xl">
              <SelectItem value="any">İstənilən</SelectItem>
              <SelectItem value="in-office">Ofisdə</SelectItem>
              <SelectItem value="hybrid">Hibrid</SelectItem>
              <SelectItem value="remote">Uzaqdan</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        {/* City */}
        <FilterField label="Şəhər və ya Rayon">
          <Input
            placeholder="məs. Bakı, Gəncə"
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
            className="bg-card dark:bg-[#0f1423] border-border dark:border-white/10 h-11 rounded-xl focus-visible:ring-primary/20"
          />
        </FilterField>

        {/* Job Type */}
        <FilterField label="İş Rejimi">
          <Select
            value={filters.jobType}
            onValueChange={(value) =>
              update("jobType", value)
            }
          >
            <SelectTrigger className="bg-card dark:bg-[#0f1423] border-border dark:border-white/10 h-11 rounded-xl focus:ring-primary/20">
              <SelectValue placeholder="İş rejimi seçin" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border dark:border-white/10 dark:bg-[#0f1423] backdrop-blur-xl">
              <SelectItem value="any">İstənilən</SelectItem>
              <SelectItem value="full-time">Tam iş günü</SelectItem>
              <SelectItem value="part-time">Yarımştat</SelectItem>
              <SelectItem value="contract">Müqavilə</SelectItem>
              <SelectItem value="internship">Təcrübəçi</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        {/* Experience Level */}
        <FilterField label="Təcrübə Səviyyəsi">
          <Select
            value={filters.experienceLevel}
            onValueChange={(value) =>
              update("experienceLevel", value)
            }
          >
            <SelectTrigger className="bg-card dark:bg-[#0f1423] border-border dark:border-white/10 h-11 rounded-xl focus:ring-primary/20">
              <SelectValue placeholder="Səviyyə seçin" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border dark:border-white/10 dark:bg-[#0f1423] backdrop-blur-xl">
              <SelectItem value="any">İstənilən</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        {/* Category */}
        <FilterField label="Kateqoriya">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              update("category", value)
            }
          >
            <SelectTrigger className="bg-card dark:bg-[#0f1423] border-border dark:border-white/10 h-11 rounded-xl focus:ring-primary/20">
              <SelectValue placeholder="Kateqoriya seçin" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border dark:border-white/10 dark:bg-[#0f1423] backdrop-blur-xl">
              <SelectItem value="any">İstənilən</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
      </div>

      <div className="p-6 border-t border-border dark:border-white/10 bg-background dark:bg-[#0b0e14]">
        <Button onClick={onApply} className="w-full h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg shadow-slate-900/10 dark:shadow-white/5 active:scale-95 transition-all">
          <SlidersHorizontal size={15} className="mr-2" />
          Filtrləri Tətbiq Et
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
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}
