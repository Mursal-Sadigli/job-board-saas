"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Tag, 
  Mail, 
  MoreHorizontal,
  Download,
  ShieldCheck,
  UserPlus,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

const MOCK_TALENT_POOL = [
  { id: "tp1", name: "Rüstəm Qasımov", role: "DevOps Engineer", experience: "8 il", tags: ["Kubernetes", "AWS", "Terraform"], rating: 5, status: "İstirahətdə" },
  { id: "tp2", name: "Günay Əliyeva", role: "Frontend Lead", experience: "6 il", tags: ["React", "Architecture", "Mentoring"], rating: 5, status: "Açıq" },
  { id: "tp3", name: "Fərid Məmmədov", role: "Mobile Developer", experience: "4 il", tags: ["Flutter", "Dart", "Firebase"], rating: 4, status: "Məşğul" },
  { id: "tp4", name: "Səbinə Rəhimova", role: "QA Automation", experience: "5 il", tags: ["Selenium", "Python", "Testing"], rating: 4, status: "Açıq" },
];

export default function TalentPoolPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">İstedad Hovuzu</h1>
          <p className="text-sm text-muted-foreground mt-1">Gələcək vakansiyalar üçün potensial namizədlər bazası</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl gap-2 font-bold text-sm h-11 px-5 border-border dark:border-white/10">
            <Download size={18} />
            Eksport
          </Button>
          <Button className="rounded-xl gap-2 font-bold text-sm h-11 px-5 shadow-xl shadow-primary/10">
            <UserPlus size={18} />
            Namizəd Əlavə Et
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" size={18} />
          <Input 
            placeholder="İstedad axtar (məs: DevOps, Architecture)..." 
            className="pl-12 h-12 rounded-2xl bg-card border-border dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-2xl gap-2 border-border dark:border-white/10 font-bold">
          <Filter size={18} />
          Filtrlər
        </Button>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_TALENT_POOL.map((talent) => (
          <div key={talent.id} className="group p-6 rounded-4xl border border-border dark:border-white/10 bg-card dark:bg-[#0f1423] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                  <Users size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{talent.name}</h3>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{talent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge className={cn(
                  "rounded-lg px-2 py-1 font-bold text-[9px] uppercase tracking-tighter",
                  talent.status === "Açıq" ? "bg-emerald-500/10 text-emerald-500" : 
                  talent.status === "Məşğul" ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground"
                )}>
                  {talent.status}
                </Badge>
                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {talent.tags.map(tag => (
                <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/30 text-muted-foreground text-xs font-bold border border-border/50">
                  <Tag size={12} className="opacity-50" />
                  {tag}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-foreground">{talent.rating}.0</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck size={14} />
                  <span className="text-xs font-bold">{talent.experience} təcrübə</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90">
                  <Mail size={18} />
                </Button>
                <Button className="h-10 px-4 rounded-xl font-bold bg-foreground text-background hover:opacity-90 transition-all active:scale-95">
                  Profil
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State / More info */}
      <div className="p-8 rounded-4xl bg-linear-to-r from-primary/5 via-transparent to-primary/5 border border-dashed border-border dark:border-white/10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground">
           <Plus size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Daha çox namizəd əlavə edin</p>
          <p className="text-xs text-muted-foreground mt-1">Geleceyin ulduzlarını hovuzda saxlayın</p>
        </div>
      </div>
    </div>
  );
}
