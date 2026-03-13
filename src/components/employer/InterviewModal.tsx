"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Video,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface InterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: any) => void;
  initialCandidateName?: string;
}

export function InterviewModal({ open, onOpenChange, onSuccess, initialCandidateName }: InterviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [candidateName, setCandidateName] = useState(initialCandidateName || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Online");

  // Namizəd adı kənardan gəldikdə onu set et
  useEffect(() => {
    if (open && initialCandidateName) {
      setCandidateName(initialCandidateName);
    } else if (!open) {
      setCandidateName(initialCandidateName || "");
    }
  }, [open, initialCandidateName]);

  const handleCreate = () => {
    if (!candidateName || !date || !time) {
        toast({
            title: "Xəta",
            description: "Zəhmət olmasa bütün vacib sahələri doldurun.",
            type: "error"
        });
        return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      onSuccess({
          id: Math.random().toString(),
          candidateName: candidateName,
          role: "Developer",
          date: date,
          time: time,
          type: type,
          status: "Upcoming",
          interviewer: "Siz"
      });
      toast({
        title: "Müsahibə Yaradıldı!",
        description: `${candidateName} ilə müsahibə cədvələ əlavə edildi.`,
        type: "success"
      });
      // Reset form
      setCandidateName("");
      setDate("");
      setTime("");
      setType("Online");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] p-0 overflow-hidden border-none bg-background dark:bg-[#020617] backdrop-blur-3xl rounded-3xl sm:rounded-[40px] shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 sm:p-10 pb-0 shrink-0">
          <div className="space-y-1 pr-8 sm:pr-0">
            <DialogTitle className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <CalendarDays className="text-primary shrink-0" size={24} />
              Yeni Müsahibə
            </DialogTitle>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Müsahibə vaxtını və detallarını təyin edin
            </p>
          </div>
        </DialogHeader>

        <div className="p-6 sm:p-10 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-2">
            <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Namizəd</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
              <Input 
                placeholder="Namizədin adı..." 
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="pl-11 h-12 sm:h-14 rounded-2xl bg-muted/20 dark:bg-white/5 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tarix</label>
              <div className="relative group">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
                <Input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-11 h-12 sm:h-14 rounded-2xl bg-muted/20 dark:bg-white/5 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Saat</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
                <Input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-11 h-12 sm:h-14 rounded-2xl bg-muted/20 dark:bg-white/5 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Müsahibə Növü</label>
            <Select value={type} onValueChange={(val: string | null) => val && setType(val)}>
              <SelectTrigger className="h-12 sm:h-14 rounded-2xl bg-muted/20 dark:bg-white/5 border-border dark:border-white/5 focus:ring-4 focus:ring-primary/5 font-bold text-sm sm:text-base px-5">
                <div className="flex items-center gap-3">
                    {type === "Online" ? <Video size={16} className="text-primary" /> : <MapPin size={16} className="text-primary" />}
                    <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border dark:border-white/10 bg-card dark:bg-[#0f172a]">
                <SelectItem value="Online" className="rounded-xl p-3 font-bold">Zoom / Google Meet (Online)</SelectItem>
                <SelectItem value="Ofisdə" className="rounded-xl p-3 font-bold">Ofisdə görüş</SelectItem>
                <SelectItem value="Telefon" className="rounded-xl p-3 font-bold">Telefon danışığı</SelectItem>
              </SelectContent>
            </Select>
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
                onClick={handleCreate}
                disabled={loading}
                className="order-1 sm:order-2 w-full sm:flex-2 h-12 sm:h-14 rounded-2xl font-black bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>Yarat <CheckCircle2 className="ml-2" size={18} /></>
                )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
