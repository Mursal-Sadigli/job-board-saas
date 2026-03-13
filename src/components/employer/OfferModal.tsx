"use client";

import { useState } from "react";
import { 
  X, 
  DollarSign, 
  Calendar as CalendarIcon, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Info,
  Briefcase
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Candidate } from "@/types/ats";

interface OfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate | null;
  onSuccess: () => void;
}

export function OfferModal({ open, onOpenChange, candidate, onSuccess }: OfferModalProps) {
  const [loading, setLoading] = useState(false);

  if (!candidate) return null;

  const handleSend = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      onSuccess();
      toast({
        title: "Təklif Göndərildi!",
        description: `${candidate.name} üçün rəsmi iş təklifi e-poçta göndərildi.`,
        type: "success"
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[550px] p-0 overflow-hidden border-none bg-background dark:bg-[#020617] backdrop-blur-3xl rounded-3xl sm:rounded-[40px] shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 sm:p-10 pb-0 shrink-0">
          <div className="space-y-1 pr-8 sm:pr-0">
            <DialogTitle className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Sparkles className="text-primary animate-pulse shrink-0" size={24} />
              İş Təklifi Hazırla
            </DialogTitle>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {candidate.name} üçün rəsmi təklif detalları
            </p>
          </div>
        </DialogHeader>

        <div className="p-6 sm:p-10 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-2">
            <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Vəzifə Adı</label>
            <div className="relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
              <Input 
                  placeholder="Məs: Senior Frontend Developer" 
                  defaultValue={candidate.appliedJobTitle}
                className="pl-11 h-12 sm:h-14 rounded-2xl bg-muted/20 dark:bg-white/5 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold text-sm sm:text-base pr-4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Əmək haqqı (Net)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
                <Input 
                  placeholder="Məs: 15-20 AZN / saat və ya 2500 AZN / ay" 
                  className="pl-11 h-12 sm:h-14 rounded-2xl bg-muted/20 dark:bg-white/5 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold text-sm sm:text-base"
                />
              </div>
            </div>
             <div className="space-y-2">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">İşə başlama tarixi</label>
              <div className="relative group">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
                <Input 
                  type="date" 
                  className="pl-11 h-12 sm:h-14 rounded-2xl bg-muted/20 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">İş haqqında məlumat</label>
            <div className="relative group">
              <Textarea 
                  placeholder="İşin əsas öhdəlikləri, tələblər, iş vaxtı və digər detalları qeyd edin..." 
                  className="w-full min-h-[120px] p-5 rounded-2xl bg-muted/20 dark:bg-white/5 border border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 outline-hidden font-bold text-sm sm:text-base resize-none custom-scrollbar"
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
             <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-1">
                <Info size={16} />
             </div>
             <div className="space-y-1 min-w-0">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">MƏLUMAT</p>
                <p className="text-[11px] sm:text-xs text-primary/70 font-medium leading-relaxed">
                   Təklif göndərildikdən sonra namizədə detallı PDF və təsdiq linki daxil olan e-poçt bildirişi çatdırılacaq.
                </p>
             </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 pt-0 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="order-2 sm:order-1 w-full sm:flex-1 h-12 sm:h-14 rounded-2xl font-black border-border dark:border-white/10 hover:bg-muted text-sm"
            >
                Ləğv Et
            </Button>
            <Button 
                onClick={handleSend}
                disabled={loading}
                className="order-1 sm:order-2 w-full sm:flex-2 h-12 sm:h-14 rounded-2xl font-black bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>Təklifi Göndər <CheckCircle2 className="ml-2" size={18} /></>
                )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
