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

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Müsahibələr</h1>
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
          <Button className="rounded-xl gap-2 font-bold text-sm h-11 px-5 shadow-xl shadow-primary/10">
            <Plus size={18} />
            Yeni Müsahibə
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <div className="space-y-4">
          {MOCK_INTERVIEWS.map((interview) => (
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
                      {new Date(interview.date).toLocaleDateString("az-AZ", { day: 'numeric', month: 'long' })}
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
                    variant={interview.status === "Upcoming" ? "default" : "secondary"}
                    className={cn(
                      "rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                      interview.status === "Upcoming" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {interview.status === "Upcoming" ? "Gözlənilir" : "Tamamlanıb"}
                  </Badge>
                  <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-muted group-hover:bg-muted/50 transition-colors">
                    <MoreHorizontal size={18} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card dark:bg-[#0f1423] p-8 rounded-4xl border border-border dark:border-white/10 shadow-xl min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
            <CalendarIcon size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground">Təqvim Görünüşü</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
              Təqvim inteqrasiyası üzərində iş gedir. Tezliklə bütün müsahibələrinizi təqvim üzərindən idarə edə biləcəksiniz.
            </p>
          </div>
          <Button variant="outline" onClick={() => setView("list")} className="rounded-xl font-bold border-border dark:border-white/10">
            Siyahı görünüşünə qayıt
          </Button>
        </div>
      )}
    </div>
  );
}
