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

const API_BASE = "http://localhost:5000";

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
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="group gap-2 hover:bg-transparent -ml-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        <span className="font-bold text-sm">Geri</span>
      </Button>

      {/* Header Profile Section */}
      <div className="relative group perspective-1000">
         <div className="absolute -inset-1 bg-linear-to-r from-primary/30 to-purple-500/30 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
         <div className="relative bg-card border border-border/50 dark:border-white/10 rounded-[30px] p-8 shadow-2xl backdrop-blur-xl">
           <div className="flex flex-col md:flex-row gap-8 items-start">
             {/* Avatar */}
             <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center text-primary border border-primary/20 shadow-inner text-4xl font-black uppercase shrink-0 transform-gpu transition-all duration-500 hover:rotate-3 hover:scale-105">
               {candidate.name.substring(0, 2)}
             </div>

             <div className="flex-1 space-y-4">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                   <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter leading-none italic">{candidate.name}</h1>
                   <p className="text-primary font-bold uppercase tracking-widest text-[11px] mt-2 flex items-center gap-2">
                     <Briefcase size={12} />
                     {candidate.appliedJobTitle}
                   </p>
                 </div>
                 <div className="flex gap-2">
                    <Button onClick={handleShare} variant="outline" size="icon" className="rounded-2xl border-border/60 hover:border-primary hover:text-primary transition-all active:scale-95 shadow-lg">
                      <Share2 size={18} />
                    </Button>
                    {candidate.resumeUrl && (
                      <Button onClick={() => window.open(candidate.resumeUrl, "_blank")} className="rounded-2xl gap-2 font-black px-6 shadow-xl shadow-primary/20 active:scale-95 transition-all">
                        <Download size={18} />
                        CV-ni Aç
                      </Button>
                    )}
                 </div>
               </div>

               <div className="flex flex-wrap gap-4 pt-2">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted/30 px-3 py-1.5 rounded-xl border border-border/40">
                   <MapPin size={16} className="text-primary/60" />
                   {candidate.location}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted/30 px-3 py-1.5 rounded-xl border border-border/40">
                   <Mail size={16} className="text-primary/60" />
                   {candidate.email}
                 </div>
                 {candidate.phone && (
                   <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted/30 px-3 py-1.5 rounded-xl border border-border/40">
                     <Phone size={16} className="text-primary/60" />
                     {candidate.phone}
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio / Summary */}
          {candidate.bio && (
            <section className="bg-card border border-border/40 rounded-[28px] p-6 sm:p-8 space-y-4">
               <h2 className="text-xl font-black text-foreground flex items-center gap-2 tracking-tight">
                 <ChevronRight size={20} className="text-primary" />
                 Haqqında
               </h2>
               <p className="text-muted-foreground leading-relaxed font-medium">
                 {candidate.bio}
               </p>
            </section>
          )}

          {/* Experience & Education Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/40 rounded-[28px] p-6 space-y-4 hover:shadow-lg transition-shadow">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black flex items-center gap-2 italic">
                   <Star size={18} className="text-amber-500" />
                   Analiz Xalı
                 </h3>
                 <Badge className="bg-primary/10 text-primary font-black rounded-lg">{candidate.matchingScore}%</Badge>
               </div>
               <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${candidate.matchingScore}%` }}></div>
               </div>
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">AI tərəfindən hesablanmış uyğunluq</p>
            </div>

            <div className="bg-card border border-border/40 rounded-[28px] p-6 space-y-4 hover:shadow-lg transition-shadow">
               <h3 className="text-lg font-black flex items-center gap-2 italic">
                 <Briefcase size={18} className="text-primary" />
                 İş Təcrübəsi
               </h3>
               <div className="flex items-baseline gap-1">
                 <span className="text-4xl font-black text-foreground italic">{candidate.experienceYears}</span>
                 <span className="text-sm font-bold text-muted-foreground uppercase">+ il təcrübə</span>
               </div>
            </div>
          </div>

          {/* Education */}
          <section className="bg-card border border-border/40 rounded-[28px] p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-black text-foreground flex items-center gap-2 tracking-tight">
              <GraduationCap size={20} className="text-primary" />
              Təhsil
            </h2>
            <div className="space-y-4">
              {Array.isArray(candidate.education) ? candidate.education.map((edu: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary shrink-0 border border-border">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-foreground leading-tight italic">{typeof edu === 'string' ? edu : edu.degree}</h4>
                    <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-tight italic">{typeof edu === 'string' ? "Məlumat yoxdur" : edu.school}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground italic">Təhsil məlumatı göstərilməyib</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Skills & Meta */}
        <div className="space-y-8">
           <section className="bg-card border border-border/40 rounded-[28px] p-6 space-y-6">
             <h2 className="text-xl font-black text-foreground flex items-center gap-2 tracking-tight">
               <Star size={20} className="text-primary" />
               Bacarıqlar
             </h2>
             <div className="flex flex-wrap gap-2">
               {candidate.skills.map((skill: string) => (
                 <Badge key={skill} variant="secondary" className="rounded-xl px-3 py-1.5 font-black text-[10px] uppercase tracking-tight bg-muted/40 hover:bg-primary/10 hover:text-primary transition-all border border-border/50">
                   {skill}
                 </Badge>
               ))}
             </div>
           </section>

           <section className="bg-linear-to-br from-primary/5 to-purple-500/5 border border-border/40 rounded-[28px] p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                <Badge className="rounded-lg font-black text-[10px] border border-primary/20 bg-primary/5 text-primary uppercase">{candidate.status}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Müraciət Tarixi</span>
                <span className="text-xs font-black text-foreground italic">{new Date(candidate.appliedAt).toLocaleDateString("az-AZ")}</span>
              </div>
              <Button 
                onClick={() => window.location.href = `mailto:${candidate.email}`}
                className="w-full h-12 rounded-2xl gap-2 font-black transition-all hover:scale-[1.02] shadow-xl"
              >
                <Mail size={18} />
                Əlaqə Saxla
              </Button>
           </section>
        </div>
      </div>
    </div>
  );
}
