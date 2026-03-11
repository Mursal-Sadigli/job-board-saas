"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function UpgradePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="flex-1 w-full h-full p-4 sm:p-8 md:p-12 overflow-y-auto bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Təfərrüatlı Planlar
          </h1>
          <p className="text-muted-foreground text-lg">
            İşə qəbul prosesinizi sürətləndirmək üçün ən uyğun planı seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <div className="rounded-2xl border border-border dark:border-slate-800 bg-card dark:bg-[#1C1F26] p-6 flex flex-col shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-2">Basic</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold text-foreground">
                ${annual ? 80 * 10 : 80}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  annual ? "bg-foreground" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${
                    annual ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-foreground/70">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-4 flex-1 mb-8 border-t border-border dark:border-slate-800 pt-6 mt-[-8px]">
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>İş elanları yaratmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Müraciətləri idarə etmək</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>1 İş elanı paylaşmaq</span>
              </div>
            </div>

            <button className="w-full h-11 rounded-lg bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">
              Bu plana keç
            </button>
          </div>

          {/* Growth Plan */}
          <div className="rounded-2xl border border-primary/50 dark:border-primary/50 bg-card dark:bg-[#1C1F26] p-6 flex flex-col relative shadow-md">
            <div className="absolute top-6 right-6 px-2.5 py-1 rounded bg-foreground text-background text-[10px] font-bold tracking-wide">
              Aktiv
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Growth</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold text-foreground">
                ${annual ? 200 * 10 : 200}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  annual ? "bg-foreground" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${
                    annual ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-foreground/70">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-4 flex-1 mb-8 border-t border-border dark:border-slate-800 pt-6 mt-[-8px]">
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>1 Önə çıxarılmış elan</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>İş elanları yaratmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Müraciətləri idarə etmək</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>3 İş elanı paylaşmaq</span>
              </div>
            </div>

            <button className="w-full h-11 rounded-lg bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">
              Bu plana keç
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-border dark:border-slate-800 bg-card dark:bg-[#1C1F26] p-6 flex flex-col shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-2">Enterprise</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold text-foreground">
                ${annual ? 800 * 10 : 800}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  annual ? "bg-foreground" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${
                    annual ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-foreground/70">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-4 flex-1 mb-8 border-t border-border dark:border-slate-800 pt-6 mt-[-8px]">
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>İş elanları yaratmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Müraciətləri idarə etmək</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>15 İş elanı paylaşmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-foreground/80">
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Limitsiz önə çıxarılmış elan</span>
              </div>
            </div>

            <button className="w-full h-11 rounded-lg bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">
              Bu plana keç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
