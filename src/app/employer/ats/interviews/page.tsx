"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Video, 
  MapPin, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { InterviewModal } from "@/components/employer/InterviewModal";

const DAYS = ["B.e.", "Ç.ə.", "Ç.", "C.ə.", "C.", "Ş.", "B."];
const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const MOCK_INTERVIEWS = [
  {
    id: "i1",
    candidateName: "Murad Əliyev",
    role: "Senior React Developer",
    date: "2024-03-20",
    time: "14:00 - 15:00",
    type: "Online",
    status: "Upcoming",
    interviewer: "Samir Quliyev",
    link: "https://zoom.us/j/123456789"
  },
  {
    id: "i2",
    candidateName: "Aysel Məmmədova",
    role: "Product Designer",
    date: "2024-03-21",
    time: "11:30 - 12:30",
    type: "Ofisdə",
    status: "Upcoming",
    interviewer: "Leyla Əhmədova",
    location: "Bakı, Nizami küç. 10"
  },
  {
    id: "i3",
    candidateName: "Kənan Həsənov",
    role: "Backend Engineer",
    date: "2024-03-18",
    time: "10:00 - 11:00",
    type: "Online",
    status: "Completed",
    interviewer: "Zaur Əliyev"
  }
];

export default function InterviewsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (data: any) => {
      setInterviews(prev => [data, ...prev]);
  };

  return (
    <div className="p-4 sm:p-6 lg:px-20 lg:py-12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">Müsahibələr</h1>
          <p className="text-sm text-muted-foreground mt-1">Planlaşdırılmış görüşlər və müsahibə cədvəli</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50 mr-2">
            <button 
              onClick={() => setView("list")}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Siyahı
            </button>
            <button 
              onClick={() => setView("calendar")}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                view === "calendar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Təqvim
            </button>
          </div>
          <Button 
            onClick={() => setModalOpen(true)}
            className="rounded-xl gap-2 font-bold text-sm h-11 px-5 shadow-xl shadow-primary/10 bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            Yeni Müsahibə
          </Button>
        </div>
      </div>

      <InterviewModal 
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={handleCreate}
      />

      {view === "list" ? (
        <div className="space-y-4">
          {interviews.map((interview) => {
            const isUpcoming = interview.status === "Upcoming";
            return (
              <div 
                key={interview.id}
                className="group bg-card dark:bg-[#0f1423] p-5 rounded-3xl border border-border dark:border-white/10 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground">{interview.candidateName}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{interview.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Tarix və Vaxt</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {interview.date.includes("-") ? new Date(interview.date).toLocaleDateString("az-AZ", { day: 'numeric', month: 'long' }) : interview.date}
                        <span className="text-muted-foreground ml-2 font-medium">{interview.time}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {interview.type === "Online" ? <Video size={14} /> : <MapPin size={14} />}
                        <span className="text-xs font-bold uppercase tracking-wider">Məkan / Növ</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {interview.type} 
                        {interview.location && <span className="text-muted-foreground ml-2 font-medium">({interview.location})</span>}
                      </p>
                    </div>

                    <div className="space-y-1 hidden lg:block">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Müsahibəçi</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">{interview.interviewer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={isUpcoming ? "default" : "secondary"}
                      className={cn(
                        "rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                        isUpcoming ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isUpcoming ? "Gözlənilir" : "Tamamlanıb"}
                    </Badge>
                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-muted group-hover:bg-muted/50 transition-colors">
                      <MoreHorizontal size={18} className="text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card dark:bg-[#0f1423] rounded-3xl sm:rounded-[40px] border border-border dark:border-white/10 shadow-2xl overflow-hidden backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Calendar Controller */}
          <div className="p-5 sm:p-8 border-b border-border dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl font-black text-foreground">Mart 2024</h3>
                <div className="flex items-center bg-muted/30 rounded-xl p-1 border border-border/50">
                   <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"><ChevronLeft size={14} /></Button>
                   <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"><ChevronRight size={14} /></Button>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                   <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500 animate-pulse" /> Müsahibə
                </div>
             </div>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 border-b border-border dark:border-white/5">
            {DAYS.map(day => (
              <div key={day} className="p-2 sm:p-4 text-center text-[8px] sm:text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest sm:tracking-[0.2em] bg-muted/10">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 overflow-x-auto">
            {CALENDAR_DAYS.map(day => {
               const hasInterview = interviews.some(i => i.date.endsWith(`-${day < 10 ? '0' + day : day}`) || i.date === "2024-03-" + day);
               const currentInterview = interviews.find(i => i.date.endsWith(`-${day < 10 ? '0' + day : day}`));
               
               return (
                  <div key={day} className="min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-r border-b border-border dark:border-white/5 hover:bg-muted/10 transition-colors group relative flex flex-col items-center sm:items-start">
                    <span className={cn(
                        "text-[10px] sm:text-xs font-black text-muted-foreground/40 sm:ml-1 sm:mt-1 block group-hover:text-foreground transition-colors",
                        day === 20 && "text-primary opacity-100 font-black",
                        hasInterview && "text-foreground/60"
                    )}>
                        {day}
                    </span>
                    
                    {hasInterview && (
                        <div className="mt-1 sm:mt-2 w-full p-1 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 text-primary animate-in zoom-in duration-300">
                           <p className="hidden sm:block text-[9px] font-black truncate leading-tight">{currentInterview?.candidateName}</p>
                           <p className="text-[7px] sm:text-[8px] font-bold text-primary/70 sm:text-primary/60 truncate sm:mt-0.5 text-center sm:text-left">
                                {currentInterview?.time.split(" - ")[0]}
                           </p>
                        </div>
                    )}

                    {day === 20 && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] animate-pulse" />
                    )}
                  </div>
               );
            })}
            {/* Fill remaining empty cells */}
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[120px] bg-muted/5 border-r border-b border-border dark:border-white/5 opacity-10 sm:opacity-20" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
