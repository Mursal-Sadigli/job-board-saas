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
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { InterviewModal } from "@/components/employer/InterviewModal";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DAYS = ["B.e.", "Ç.ə.", "Ç.", "C.ə.", "C.", "Ş.", "B."];
const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
  "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];
const YEARS = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 2 + i);

const MOCK_INTERVIEWS = [
  {
    id: "i1",
    candidateName: "Murad Əliyev",
    role: "Senior React Developer",
    date: "2026-03-20",
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
    date: "2026-03-21",
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
    date: "2026-03-18",
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
  const [editingInterview, setEditingInterview] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to today
  const [loading, setLoading] = useState(false); // Added for the new button

  const handleCreate = (data: any) => {
      if (editingInterview) {
          setInterviews(prev => prev.map(i => i.id === editingInterview.id ? { ...data, id: i.id } : i));
          setEditingInterview(null);
      } else {
          setInterviews(prev => [data, ...prev]);
      }
      setModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
      setInterviews(prev => prev.filter(i => i.id !== id));
      toast({
          title: "Silindi",
          description: "Müsahibə uğurla siyahıdan silindi.",
          type: "success"
      });
  };

  const handleEdit = (interview: any) => {
      setEditingInterview(interview);
      setModalOpen(true);
  };

  const prevMonth = () => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleMonthSelect = (monthIdx: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), monthIdx, 1));
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(prev => new Date(year, prev.getMonth(), 1));
  };

  const monthName = MONTHS[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust first day to start from Monday (0: Sun -> 6: Sun, 1: Mon -> 0: Mon)
  const startingDayPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="p-4 sm:p-6 lg:px-20 lg:py-12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">Müsahibələr</h1>
          <p className="text-sm text-muted-foreground mt-1">Planlaşdırılmış görüşlər və müsahibə cədvəli</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50 order-2 sm:order-1">
            <button 
              onClick={() => setView("list")}
              className={cn(
                "flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Siyahı
            </button>
            <button 
              onClick={() => setView("calendar")}
              className={cn(
                "flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                view === "calendar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Təqvim
            </button>
          </div>
          <Button 
            onClick={() => setModalOpen(true)}
            className="order-1 sm:order-2 rounded-xl gap-2 font-black text-sm h-11 sm:h-12 px-5 shadow-xl shadow-primary/10 bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
          >
            <Plus size={18} />
            Yeni Müsahibə
          </Button>
        </div>
      </div>

      <InterviewModal 
          open={modalOpen}
          onOpenChange={(open) => {
              setModalOpen(open);
              if (!open) setEditingInterview(null);
          }}
          onSuccess={handleCreate}
      />

      {view === "list" ? (
        <div className="space-y-4">
          {interviews.map((interview) => {
            const isUpcoming = interview.status === "Upcoming";
            return (
              <div 
                key={interview.id}
                className="group bg-card p-5 rounded-3xl border border-border dark:border-white/10 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
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
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-muted group-hover:bg-muted/50 transition-colors">
                          <MoreHorizontal size={18} className="text-muted-foreground" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="rounded-xl border-border dark:border-white/10 bg-card dark:bg-[#0f172a]">
                        <DropdownMenuItem 
                            onClick={() => handleEdit(interview)}
                            className="rounded-lg font-bold gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer"
                        >
                            <CalendarIcon size={14} /> Redaktə et
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => handleDelete(interview.id)}
                            className="rounded-lg font-bold gap-2 text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                        >
                            <X size={14} /> Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-3xl sm:rounded-[40px] border border-border dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Calendar Controller */}
          <div className="p-5 sm:p-8 border-b border-border dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" className="h-9 sm:h-11 px-2 sm:px-3 rounded-xl hover:bg-muted text-base sm:text-xl font-black text-foreground capitalize flex items-center gap-1">
                        {monthName} <MoreHorizontal size={14} className="opacity-20" />
                      </Button>
                    } />
                    <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto rounded-2xl border-border bg-card p-2 shadow-2xl">
                      {MONTHS.map((m, idx) => (
                        <DropdownMenuItem 
                          key={m} 
                          onClick={() => handleMonthSelect(idx)}
                          className={cn("rounded-xl font-bold text-xs p-3", idx === currentDate.getMonth() && "bg-primary/10 text-primary")}
                        >
                          {m}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" className="h-9 sm:h-11 px-2 sm:px-3 rounded-xl hover:bg-muted text-base sm:text-lg font-bold text-muted-foreground/60 flex items-center gap-1">
                        {year} <MoreHorizontal size={14} className="opacity-20" />
                      </Button>
                    } />
                    <DropdownMenuContent align="start" className="rounded-2xl border-border bg-card p-2 shadow-2xl">
                      {YEARS.map((y) => (
                        <DropdownMenuItem 
                          key={y} 
                          onClick={() => handleYearSelect(y)}
                          className={cn("rounded-xl font-bold text-xs p-3", y === year && "bg-primary/10 text-primary")}
                        >
                          {y}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center bg-muted/30 rounded-xl p-1 border border-border/50 ml-1">
                   <Button onClick={prevMonth} variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-card"><ChevronLeft size={16} /></Button>
                   <Button onClick={nextMonth} variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-card"><ChevronRight size={16} /></Button>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                   <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500 animate-pulse" /> Müsahibə
                </div>
             </div>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 border-b border-border dark:border-white/10">
            {DAYS.map(day => (
              <div key={day} className="p-2 sm:p-4 text-center text-[8px] sm:text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest sm:tracking-[0.2em] bg-muted/10">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 overflow-x-auto">
            {/* Weekday Padding */}
            {Array.from({ length: startingDayPadding }).map((_, i) => (
               <div key={`padding-${i}`} className="min-h-[80px] sm:min-h-[120px] bg-muted/5 border-r border-b border-border dark:border-white/5 opacity-40 sm:opacity-50" />
            ))}

            {calendarDays.map(day => {
               const dayStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
               const dayInterviews = interviews.filter(i => i.date === dayStr);
               
               return (
                  <div key={day} className="min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-r border-b border-border dark:border-white/10 hover:bg-muted/10 transition-colors group relative flex flex-col items-center sm:items-start">
                    <span className={cn(
                        "text-[10px] sm:text-xs font-black text-muted-foreground/40 sm:ml-1 sm:mt-1 block group-hover:text-foreground transition-colors",
                        (day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && year === new Date().getFullYear()) && "text-primary opacity-100 font-black",
                        dayInterviews.length > 0 && "text-foreground/60"
                    )}>
                        {day}
                    </span>
                    
                    {dayInterviews.map((i, idx) => (
                        <div key={idx} className="mt-1 sm:mt-2 w-full p-1 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 text-primary animate-in zoom-in duration-300">
                           <p className="hidden sm:block text-[9px] font-black truncate leading-tight">{i.candidateName}</p>
                           <p className="text-[7px] sm:text-[8px] font-bold text-primary/70 sm:text-primary/60 truncate sm:mt-0.5 text-center sm:text-left">
                                {i.time.split(" - ")[0]}
                           </p>
                        </div>
                    ))}
                  </div>
               );
            })}
            {/* Fill remaining cells to maintain grid shape if needed */}
            {Array.from({ length: (7 - (startingDayPadding + calendarDays.length) % 7) % 7 }).map((_, i) => (
               <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[120px] bg-muted/5 border-r border-b border-border dark:border-white/5 opacity-10 sm:opacity-20" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
