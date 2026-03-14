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
interface ApplyModalProps {
  children: React.ReactElement;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
}

export function ApplyModal({ children, jobTitle, companyName, onSuccess }: ApplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsApplying(false);
    setIsApplied(true);
    
    toast({
      title: "Müraciətiniz göndərildi!",
      description: "Tezliklə qeyd etdiyiniz email vasitəsilə sizinlə əlaqə saxlanılacaq.",
      type: "success",
      duration: 6000
    });

    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v: boolean) => {
      setIsOpen(v);
      if (!v) {
        // Reset state when closing after success
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
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 animate-in zoom-in-95 fade-in duration-500">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-2xl sm:rounded-[28px] flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
                <CheckCircle2 size={32} className="sm:size-[40px]" strokeWidth={1.5} />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Təbriklər!</h2>
                <p className="text-[13px] sm:text-sm text-muted-foreground font-medium px-2 sm:px-4 leading-relaxed">
                  Müraciətiniz <span className="text-foreground font-bold">{companyName}</span> tərəfindən qəbul edildi. Uğurlar arzulayırıq!
                </p>
              </div>

              <div className="pt-2 sm:pt-4">
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
