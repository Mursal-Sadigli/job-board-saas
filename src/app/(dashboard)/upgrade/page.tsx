"use client";

import { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";

export default function UpgradePage() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { getToken } = useAuth();

  const handleUpgrade = async (planName: string, amount: number) => {
    console.log(`Upgrade triggered for ${planName} (${amount} AZN)...`);
    setLoading(planName);
    try {
      const token = await getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      
      const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ planName, amount })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Ödəniş sessiyası yaradıla bilmədi");
      }
      
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Sessiya linki alınmadı");
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast({
        title: "Xəta",
        description: error.message || "Bir xəta baş verdi. Lütfən yenidən cəhd edin.",
        type: "error"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex-1 w-full h-full p-4 sm:p-8 md:p-12 overflow-y-auto bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Təfərrüatlı Planlar
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto md:mx-0">
            İşə qəbul prosesinizi sürətləndirmək üçün ən uyğun planı seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Basic Plan */}
          <div className="rounded-2xl border border-border dark:border-slate-800 bg-card dark:bg-[#1C1F26] p-5 sm:p-6 md:p-8 flex flex-col shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">Başlanğıc</h3>
            <div className="flex items-end gap-1 mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl font-bold text-foreground">
                {annual ? 29 * 10 : 29} ₼
              </span>
              <span className="text-xs md:text-sm text-muted-foreground mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-6 md:mb-8">
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
              <span className="text-[11px] md:text-xs font-medium text-foreground/70">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-3 md:space-y-4 flex-1 mb-6 md:mb-8 border-t border-border dark:border-slate-800 pt-5 md:pt-6 mt-[-8px]">
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

            <button 
              disabled={loading !== null}
              onClick={() => handleUpgrade("Başlanğıc", annual ? 290 : 29)}
              className="w-full h-10 md:h-11 rounded-lg bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === "Başlanğıc" ? "Yüklənir..." : "Bu plana keç"}
            </button>
          </div>

          {/* Growth Plan */}
          <div className="rounded-2xl border border-primary/50 dark:border-primary/50 bg-card dark:bg-[#1C1F26] p-5 sm:p-6 md:p-8 flex flex-col relative shadow-md">
            <div className="absolute top-5 right-5 md:top-6 md:right-6 px-2.5 py-1 rounded bg-foreground text-background text-[10px] font-bold tracking-wide">
              Aktiv
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">İnkişaf</h3>
            <div className="flex items-end gap-1 mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl font-bold text-foreground">
                {annual ? 79 * 10 : 79} ₼
              </span>
              <span className="text-xs md:text-sm text-muted-foreground mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-6 md:mb-8">
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
              <span className="text-[11px] md:text-xs font-medium text-foreground/70">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-3 md:space-y-4 flex-1 mb-6 md:mb-8 border-t border-border dark:border-slate-800 pt-5 md:pt-6 mt-[-8px]">
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

            <button 
              disabled={loading !== null}
              onClick={() => handleUpgrade("İnkişaf", annual ? 790 : 79)}
              className="w-full h-10 md:h-11 rounded-lg bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === "İnkişaf" ? "Yüklənir..." : "Bu plana keç"}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-border dark:border-slate-800 bg-card dark:bg-[#1C1F26] p-5 sm:p-6 md:p-8 flex flex-col shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">Korporativ</h3>
            <div className="flex items-end gap-1 mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl font-bold text-foreground">
                {annual ? 199 * 10 : 199} ₼
              </span>
              <span className="text-xs md:text-sm text-muted-foreground mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-6 md:mb-8">
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
              <span className="text-[11px] md:text-xs font-medium text-foreground/70">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-3 md:space-y-4 flex-1 mb-6 md:mb-8 border-t border-border dark:border-slate-800 pt-5 md:pt-6 mt-[-8px]">
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

            <button 
              disabled={loading !== null}
              onClick={() => handleUpgrade("Korporativ", annual ? 1990 : 199)}
              className="w-full h-10 md:h-11 rounded-lg bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === "Korporativ" ? "Yüklənir..." : "Bu plana keç"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
