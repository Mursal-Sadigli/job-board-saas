"use client";

import { useState } from "react";
import { 
  X, 
  DollarSign, 
  Calendar as CalendarIcon, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Info
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-background dark:bg-[#020617] rounded-[32px] shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="text-primary animate-pulse" size={24} />
                İş Təklifi Hazırla
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-medium">
                {candidate.name} üçün rəsmi təklif detalları
              </p>
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="rounded-full hover:bg-muted"
            >
                <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Əmək haqqı (Net)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
                <Input 
                    placeholder="Məs: 2500" 
                    className="pl-10 h-14 rounded-2xl bg-muted/20 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold"
                />
              </div>
            </div>
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Valyuta</label>
              <Input 
                value="AZN" 
                readOnly 
                className="h-14 rounded-2xl bg-muted/10 border-border dark:border-white/5 font-black text-center"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">İşə başlama tarixi</label>
            <div className="relative group">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
              <Input 
                type="date" 
                className="pl-10 h-14 rounded-2xl bg-muted/20 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
             <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-1">
                <Info size={16} />
             </div>
             <div className="space-y-1">
                <p className="text-xs font-black text-primary uppercase tracking-widest">Məlumat</p>
                <p className="text-[11px] text-primary/60 font-medium leading-relaxed">
                   Təklif təsdiqləndikdən sonra namizədə müqavilə nümunəsi və detallı məlumatlar avtomatik göndəriləcək.
                </p>
             </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1 h-14 rounded-2xl font-black border-border dark:border-white/10 hover:bg-muted"
            >
                Ləğv Et
            </Button>
            <Button 
                onClick={handleSend}
                disabled={loading}
                className="flex-[2] h-14 rounded-2xl font-black bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
