"use client";

import { useState } from "react";
import { 
  Briefcase, 
  Search, 
  ChevronRight,
  Filter,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { MOCK_JOBS } from "@/api/jobs";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Aggregate applications from mock jobs
  const allApplications = MOCK_JOBS.flatMap(job => 
    (job.applicants || []).map(app => ({
      ...app,
      jobTitle: job.title,
      jobId: job.id
    }))
  );

  const filteredApps = allApplications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Müraciətlər</h1>
          <p className="text-sm text-muted-foreground mt-1">Vakansiyalar üzrə aktiv müraciətlərin idarə edilməsi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl gap-2 font-bold text-sm h-11 px-5 border-border dark:border-white/10">
            <Filter size={16} />
            Filtrlər
          </Button>
        </div>
      </div>

      {/* Kanban-ish summary or List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Yeni", count: filteredApps.filter(a => a.stage === "Applied").length, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Müsahibə", count: filteredApps.filter(a => a.stage === "Interview").length, icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Təklif", count: filteredApps.filter(a => a.stage === "Offered").length, icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "İmtina Qərarı", count: filteredApps.filter(a => a.stage === "Rejected").length, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
        ].map(stat => (
          <div key={stat.label} className="p-5 rounded-2xl border border-border dark:border-white/10 bg-card dark:bg-[#0f1423] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-2xl font-black text-foreground">{stat.count}</span>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" size={18} />
        <Input 
          placeholder="Namizəd və ya vakansiya adına görə axtar..." 
          className="pl-12 h-12 rounded-2xl bg-card border-border dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Applications Table */}
      <div className="bg-card dark:bg-[#0f1423] rounded-3xl border border-border dark:border-white/10 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-white/10 bg-muted/20">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Namizəd / Vakansiya</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Mərhələ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Reytinq</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-right">Tarix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5">
              {filteredApps.map((app) => (
                <tr key={app.id} className="group hover:bg-muted/30 transition-all duration-300">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-foreground">{app.name}</span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                        <Briefcase size={10} className="opacity-50" />
                        {app.jobTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className="rounded-lg border-border bg-muted/30 font-bold text-[10px] uppercase tracking-wider px-3 py-1">
                      {app.stage}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={12} 
                          className={cn(s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/30")} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-xs font-bold text-muted-foreground">
                      {new Date(app.appliedAt).toLocaleDateString("az-AZ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
