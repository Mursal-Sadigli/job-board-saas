"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Download, 
  Share2,
  ExternalLink,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function CandidateProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [candidate, setCandidate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidate = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/applications/candidates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Namizəd tapılmadı");
      const data = await res.json();
      setCandidate(data);
    } catch (error) {
      console.error("Fetch candidate error:", error);
      toast({
        title: "Xəta",
        description: "Namizəd məlumatlarını yükləyərkən problem yarandı.",
        type: "error"
      });
      router.push("/employer/ats/candidates");
    } finally {
      setIsLoading(false);
    }
  }, [id, getToken, router]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${candidate?.name} - Profil`,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Kopyalandı", description: "Profil linki buferə kopyalandı." });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase text-[10px]">Profil Yüklənir...</p>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="group gap-2 hover:bg-transparent -ml-2 text-muted-foreground hover:text-foreground transition-colors h-8"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        <span className="font-bold text-xs">Geri</span>
      </Button>

      {/* Header Profile Section */}
      <div className="relative group perspective-1000">
         <div className="absolute -inset-1 bg-linear-to-r from-primary/30 to-purple-500/30 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative bg-card border border-border/50 dark:border-white/10 rounded-[22px] p-5 sm:p-6 shadow-xl backdrop-blur-xl">
           <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
             {/* Avatar */}
             <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center text-primary border border-primary/20 shadow-inner text-2xl font-black uppercase shrink-0 transform-gpu transition-all duration-500 hover:rotate-3">
               {candidate.name.substring(0, 2)}
             </div>

             <div className="flex-1 space-y-3 w-full">
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                 <div>
                   <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter leading-tight italic">{candidate.name}</h1>
                   <p className="text-primary font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center justify-center sm:justify-start gap-2">
                     <Briefcase size={10} />
                     {candidate.appliedJobTitle}
                   </p>
                 </div>
                 <div className="flex gap-2 justify-center sm:justify-start">
                    <Button onClick={handleShare} variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/60 hover:border-primary hover:text-primary transition-all active:scale-95">
                      <Share2 size={16} />
                    </Button>
                    {candidate.resumeUrl && (
                      <Button onClick={() => window.open(candidate.resumeUrl, "_blank")} className="h-9 rounded-xl gap-2 font-black px-4 text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all">
                        <Download size={16} />
                        CV-ni Aç
                      </Button>
                    )}
                 </div>
               </div>

               <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
                 <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/30">
                   <MapPin size={12} className="text-primary/60" />
                   {candidate.location}
                 </div>
                 <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/30">
                   <Mail size={12} className="text-primary/60" />
                   {candidate.email}
                 </div>
                 {candidate.phone && (
                   <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/30">
                     <Phone size={12} className="text-primary/60" />
                     {candidate.phone}
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio / Summary */}
          {candidate.bio && (
            <section className="bg-card border border-border/30 rounded-[20px] p-5 sm:p-6 space-y-3">
               <h2 className="text-lg font-black text-foreground flex items-center gap-2 tracking-tight">
                 <ChevronRight size={18} className="text-primary" />
                 Haqqında
               </h2>
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                 {candidate.bio}
               </p>
            </section>
          )}

          {/* Experience & Education Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border/30 rounded-[20px] p-5 space-y-3 hover:border-primary/20 transition-all">
               <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black flex items-center gap-2 italic text-muted-foreground">
                   <Star size={14} className="text-amber-500" />
                   UYĞUNLUQ
                 </h3>
                 <Badge className="bg-primary/10 text-primary font-black rounded-lg text-[10px]">{candidate.matchingScore}%</Badge>
               </div>
               <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${candidate.matchingScore}%` }}></div>
               </div>
            </div>

            <div className="bg-card border border-border/30 rounded-[20px] p-5 space-y-1 hover:border-primary/20 transition-all">
               <h3 className="text-sm font-black flex items-center gap-2 italic text-muted-foreground">
                 <Briefcase size={14} className="text-primary" />
                 TƏCRÜBƏ
               </h3>
               <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-foreground italic">{candidate.experienceYears}</span>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">il təcrübə</span>
               </div>
            </div>
          </div>

          {/* Education */}
          <section className="bg-card border border-border/30 rounded-[20px] p-5 sm:p-6 space-y-4">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2 tracking-tight">
              <GraduationCap size={18} className="text-primary" />
              Təhsil
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.isArray(candidate.education) ? candidate.education.map((edu: any, idx: number) => (
                <div key={idx} className="flex gap-3 p-3 rounded-xl bg-muted/10 border border-border/20 hover:border-primary/20 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary shrink-0 border border-border">
                    <GraduationCap size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-xs text-foreground leading-tight italic truncate">{typeof edu === 'string' ? edu : edu.degree}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-tighter italic truncate">{typeof edu === 'string' ? "Məlumat yoxdur" : edu.school}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-muted-foreground italic">Təhsil məlumatı göstərilməyib</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Skills & Meta */}
        <div className="space-y-6">
           <section className="bg-card border border-border/30 rounded-[20px] p-5 space-y-4">
             <h2 className="text-lg font-black text-foreground flex items-center gap-2 tracking-tight">
               <Star size={18} className="text-primary" />
               Bacarıqlar
             </h2>
             <div className="flex flex-wrap gap-1.5">
               {candidate.skills.map((skill: string) => (
                 <Badge key={skill} variant="secondary" className="rounded-lg px-2 py-1 font-black text-[9px] uppercase tracking-tighter bg-muted/30 border border-border/40">
                   {skill}
                 </Badge>
               ))}
             </div>
           </section>

           <section className="bg-linear-to-br from-primary/5 to-purple-500/5 border border-border/30 rounded-[20px] p-5 space-y-4">
              <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                <Badge className="rounded-lg font-black text-[9px] border border-primary/20 bg-primary/5 text-primary uppercase">{candidate.status}</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tarix</span>
                <span className="text-[11px] font-black text-foreground italic">{new Date(candidate.appliedAt).toLocaleDateString("az-AZ")}</span>
              </div>
              <Button 
                onClick={() => window.location.href = `mailto:${candidate.email}`}
                className="w-full h-10 rounded-xl gap-2 font-black text-xs transition-all hover:scale-[1.02] shadow-lg"
              >
                <Mail size={16} />
                Əlaqə
              </Button>
           </section>
        </div>
      </div>
    </div>
  );
}
