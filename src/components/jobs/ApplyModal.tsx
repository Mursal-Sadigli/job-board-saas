"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  PartyPopper, 
  ArrowRight,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/utils/cn";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";

interface ApplyModalProps {
  children: React.ReactElement;
  jobId: string;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
}

export function ApplyModal({ children, jobId, jobTitle, companyName, onSuccess }: ApplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const { getToken } = useAuth();

  const handleApply = async () => {
    if (!file) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa CV faylını seçin.",
        type: "error"
      });
      return;
    }

    setIsApplying(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("resume", file);

      const response = await fetch("http://localhost:5001/api/applications/apply", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Müraciət zamanı xəta baş verdi");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setIsApplied(true);
      toast({
        title: "Müraciətiniz göndərildi!",
        description: "CV analizi tamamlandı və müraciətiniz qeydə alındı.",
        type: "success"
      });
      onSuccess?.();
    } catch (error) {
      console.error("Apply error details:", error);
      toast({
        title: "Xəta",
        description: "Müraciət göndərilərkən bir problem yarandı.",
        type: "error"
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => {
      setIsOpen(v);
      if (!v) {
        // Reset state when closing
        setTimeout(() => setIsApplied(false), 300);
      }
    }}>
      <DialogTrigger render={children} />
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[440px] p-0 overflow-hidden border-none bg-transparent shadow-none !rounded-[2rem] sm:!rounded-[32px]">
        <div className="relative bg-card dark:bg-[#0f172a] rounded-[2rem] sm:rounded-[32px] border border-border dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10">
          
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -ml-16 -mb-16 blur-2xl" />

          {!isApplied ? (
            <div className="relative z-10 text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl sm:rounded-[28px] flex items-center justify-center text-primary mx-auto shadow-inner">
                <Sparkles size={28} className="sm:size-[36px]" strokeWidth={1.5} />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Müraciət etməyə hazırsınız?</h2>
                <p className="text-[13px] sm:text-sm text-muted-foreground font-medium px-2 sm:px-4 leading-relaxed">
                  <span className="text-foreground font-bold">{companyName}</span> şirkətində <span className="text-foreground font-bold">{jobTitle}</span> vəzifəsi üçün müraciətiniz göndəriləcək.
                </p>
              </div>

              {/* File Upload UI */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-border dark:border-white/10 hover:border-primary/50 transition-all bg-muted/5">
                <input 
                  type="file" 
                  id="cv-upload" 
                  className="hidden" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="cv-upload" className="cursor-pointer space-y-2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-foreground">
                      {file ? file.name : "CV-ni buraya yükləyin (PDF)"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Maksimum 5MB</p>
                  </div>
                </label>
              </div>

              <div className="pt-2 sm:pt-4 space-y-2.5 sm:space-y-3">
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className={cn(
                    "w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100",
                    isApplying && "cursor-not-allowed"
                  )}
                >
                  {isApplying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Təsdiq edin <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full h-11 sm:h-12 rounded-xl text-muted-foreground font-bold text-xs sm:text-sm hover:text-foreground transition-colors"
                >
                  Hələ yox, geri qayıt
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 animate-in zoom-in-95 fade-in duration-500 max-h-[80vh] overflow-y-auto custom-scrollbar px-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-2xl sm:rounded-[28px] flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
                <CheckCircle2 size={32} className="sm:size-[40px]" strokeWidth={1.5} />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Təbriklər!</h2>
                <p className="text-[13px] sm:text-sm text-muted-foreground font-medium px-2 sm:px-4 leading-relaxed">
                  Müraciətiniz <span className="text-foreground font-bold">{companyName}</span> tərəfindən qəbul edildi.
                </p>
              </div>

              {analysis && (
                <div className="text-left bg-muted/30 rounded-2xl p-4 sm:p-5 border border-border dark:border-white/5 space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">AI</div>
                    <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">CV Analizi</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-1">Namizəd</h4>
                      <p className="text-sm font-bold text-foreground">{analysis.name || "Məlum deyil"}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-1.5">Bacarıqlar</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.skills?.slice(0, 8).map((skill: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-foreground capitalize">
                            {skill}
                          </span>
                        ))}
                        {analysis.skills?.length > 8 && (
                          <span className="text-[10px] font-bold text-muted-foreground px-1">+{analysis.skills.length - 8}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-1">Xülasə</h4>
                      <p className="text-[12px] leading-relaxed text-muted-foreground font-medium line-clamp-3 italic">
                        "{analysis.summary}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-foreground text-background font-black text-sm shadow-xl shadow-black/10 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <PartyPopper size={18} /> Bağla
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
