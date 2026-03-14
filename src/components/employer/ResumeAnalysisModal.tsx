"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FileUp, 
  X, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Cpu, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

// AI Extraction steps
const EXTRACTION_STEPS = [
  "Mətn çıxarılır (OCR)...",
  "Semantik analiz aparılır...",
  "Təcrübə illəri hesablanır...",
  "Texniki bacarıqlar müəyyən edilir...",
  "Təhsil məlumatları strukturlaşdırılır...",
  "Uyğunluq balı (Matching Score) hesablanır..."
];

interface ResumeAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisComplete: (data: any) => void;
}

export function ResumeAnalysisModal({ open, onOpenChange, onAnalysisComplete }: ResumeAnalysisModalProps) {
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setCurrentStep(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setStatus("uploading");
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);

      // Simulation of steps in background for UX
      let stepSize = 100 / EXTRACTION_STEPS.length;
      let currentProgress = 0;
      
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < EXTRACTION_STEPS.length - 2) {
             currentProgress += stepSize;
             setProgress(currentProgress);
             return prev + 1;
          }
          return prev;
        });
      }, 1500);

      const res = await fetch("http://localhost:5001/api/applications/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.status === 403) {
        clearInterval(stepInterval);
        toast({
          title: "Limit Dolub",
          description: "Pulsuz CV yükləmə limitiniz bitib. Lütfən planınızı yeniləyin.",
          type: "error"
        });
        setTimeout(() => {
          onOpenChange(false);
          window.location.href = "/employer/upgrade";
        }, 1500);
        return;
      }

      if (!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();
      
      clearInterval(stepInterval);
      setCurrentStep(EXTRACTION_STEPS.length - 1);
      setProgress(100);
      setStatus("completed");
      
      // Notify parent to refresh list
      onAnalysisComplete(data.aiData);
      
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Xəta",
        description: "CV analiz edilərkən xəta baş verdi.",
        type: "error"
      });
      setStatus("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (status !== "uploading" && status !== "analyzing") onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[500px] rounded-3xl border-border/60 dark:border-white/5 bg-card dark:bg-[#020617] backdrop-blur-3xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 bg-muted/30 dark:bg-white/5 border-b border-border/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight">AI CV Analizi</DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground">
                Müasir ATS mühərriki vasitəsilə dərhal nəticə
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 sm:p-8">
          {status === "idle" && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border dark:border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
              <div className="w-16 h-16 rounded-2xl bg-muted dark:bg-white/5 group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground/60 group-hover:text-primary transition-all">
                <FileUp size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">CV faylını buraya çəkin və ya seçin</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX (Maks. 5MB)</p>
              </div>
              {file && (
                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold animate-in zoom-in">
                  <FileText size={14} />
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <X size={14} className="cursor-pointer hover:opacity-70" onClick={(e) => { e.stopPropagation(); setFile(null); }} />
                </div>
              )}
            </div>
          )}

          {(status === "uploading" || status === "analyzing") && (
            <div className="space-y-8 py-4 px-2">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {status === "uploading" ? "Yüklənir..." : "Analiz Edilir..."}
                  </span>
                  <span className="text-xs font-black text-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-muted dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] dark:shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                {EXTRACTION_STEPS.map((step, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 text-xs font-medium transition-all duration-500",
                    i < currentStep ? "text-emerald-500" : i === currentStep ? "text-foreground font-bold translate-x-1" : "text-muted-foreground/30"
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center border transition-all",
                      i < currentStep ? "bg-emerald-500 border-emerald-500 text-white" : i === currentStep ? "border-primary text-primary animate-pulse" : "border-border"
                    )}>
                      {i < currentStep ? <CheckCircle2 size={12} /> : <span className="scale-75">•</span>}
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "completed" && (
            <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 relative">
                <CheckCircle2 size={40} />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin duration-[2s]" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Analiz Tamamlandı!</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs mb-8">
                Namizəd məlumatları uğurla çıxarıldı və profil yaradıldı.
              </p>
              <Button 
                onClick={() => onOpenChange(false)}
                className="w-full h-12 rounded-2xl bg-emerald-500 text-white font-black text-sm shadow-xl hover:bg-emerald-600 transition-all"
              >
                Tamamla
              </Button>
            </div>
          )}
        </div>

        <div className="p-6 bg-muted/30 dark:bg-white/5 border-t border-border/50 dark:border-white/5 flex flex-col gap-3">
          {status === "idle" && (
            <Button 
              disabled={!file} 
              onClick={startAnalysis}
              className="w-full h-12 rounded-2xl bg-foreground text-background font-black text-sm shadow-xl hover:opacity-90 transition-all"
            >
              Analizə Başla
            </Button>
          )}
          {(status === "uploading" || status === "analyzing") && (
            <div className="flex items-center justify-center gap-6 py-2">
              <div className="flex flex-col items-center gap-1">
                <Cpu size={18} className="text-primary/40" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">OCR Engine</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={18} className="text-primary/40" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap size={18} className="text-primary/40" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Fast Parse</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
