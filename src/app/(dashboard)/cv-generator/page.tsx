"use client";

import { useState } from "react";
import { 
  Wand2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2,
  Download,
  Copy,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
}

export default function CVGeneratorPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<string | null>(null);

  const [personal, setPersonal] = useState({
    fullName: "", email: "", phone: "", title: "", summary: ""
  });
  const [experiences, setExperiences] = useState<Experience[]>([
    { company: "", role: "", duration: "", description: "" }
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { institution: "", degree: "", year: "" }
  ]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
  };

  const addExperience = () => setExperiences([...experiences, { company: "", role: "", duration: "", description: "" }]);
  const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExperience = (i: number, field: keyof Experience, value: string) => {
    const next = [...experiences]; next[i][field] = value; setExperiences(next);
  };

  const addEducation = () => setEducations([...educations, { institution: "", degree: "", year: "" }]);
  const removeEducation = (i: number) => setEducations(educations.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof Education, value: string) => {
    const next = [...educations]; next[i][field] = value; setEducations(next);
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${API_BASE}/api/ai/generate-cv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personal, experiences, educations, skills })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGeneratedCV(data.content);
      setStep(5);
      toast({ title: "CV Hazırdır!", description: "AI sizin üçün mükəmməl CV hazırladı." });
    } catch {
      toast({ title: "Xəta", description: "CV yaradıla bilmədi. Yenidən cəhd edin.", type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCV) {
      navigator.clipboard.writeText(generatedCV);
      toast({ title: "Kopyalandı!" });
    }
  };

  const STEPS = [
    { icon: User, label: "Şəxsi" },
    { icon: Briefcase, label: "Təcrübə" },
    { icon: GraduationCap, label: "Təhsil" },
    { icon: Layers, label: "Bacarıq" },
    { icon: Sparkles, label: "Nəticə" }
  ];

  return (
    <div className="min-h-screen px-3 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md shrink-0">
            <Wand2 size={20} />
          </div>
          AI CV Generator
        </h1>
        <p className="text-xs text-muted-foreground font-medium pl-1">2 dəqiqədə peşəkar CV hazırlayın</p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 shrink-0 flex-1 min-w-0">
            <div className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              step === idx + 1
                ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-110"
                : step > idx + 1
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-border bg-card text-muted-foreground"
            )}>
              {step > idx + 1 ? <CheckCircle2 size={14} /> : <s.icon size={14} />}
            </div>
            <span className={cn(
              "text-[9px] sm:text-[10px] font-black uppercase tracking-widest truncate w-full text-center",
              step === idx + 1 ? "text-primary" : "text-muted-foreground"
            )}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border dark:border-white/10 shadow-xl overflow-hidden">

        {/* STEP 1 — Şəxsi məlumatlar */}
        {step === 1 && (
          <div className="p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "fullName", label: "Ad Soyad", placeholder: "Əli Vəliyev" },
                { name: "email", label: "E-poçt", placeholder: "ali@example.com" },
                { name: "phone", label: "Telefon", placeholder: "+994 50 000 00 00" },
                { name: "title", label: "Vəzifə", placeholder: "Frontend Developer" },
              ].map(f => (
                <div key={f.name} className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-0.5">{f.label}</label>
                  <Input
                    name={f.name}
                    value={personal[f.name as keyof typeof personal]}
                    onChange={handlePersonalChange}
                    placeholder={f.placeholder}
                    className="rounded-xl h-11"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-0.5">Xülasə</label>
              <textarea
                name="summary"
                value={personal.summary}
                onChange={handlePersonalChange}
                rows={3}
                className="w-full rounded-xl bg-background border border-border dark:border-white/10 p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                placeholder="Özünüz haqqında qısa məlumat..."
              />
            </div>
          </div>
        )}

        {/* STEP 2 — İş Təcrübəsi */}
        {step === 2 && (
          <div className="p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-right-4 duration-400">
            {experiences.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3 relative">
                {experiences.length > 1 && (
                  <button onClick={() => removeExperience(idx)} className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Şirkət" value={exp.company} onChange={e => updateExperience(idx, "company", e.target.value)} className="rounded-xl h-10 text-sm" />
                  <Input placeholder="Vəzifə" value={exp.role} onChange={e => updateExperience(idx, "role", e.target.value)} className="rounded-xl h-10 text-sm" />
                  <Input placeholder="Müddət (2020 - 2023)" value={exp.duration} onChange={e => updateExperience(idx, "duration", e.target.value)} className="rounded-xl h-10 text-sm sm:col-span-2" />
                </div>
                <textarea
                  placeholder="Nailiyyətlər və məsuliyyətlər..."
                  value={exp.description}
                  onChange={e => updateExperience(idx, "description", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl bg-background border border-border dark:border-white/10 p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                />
              </div>
            ))}
            <Button variant="outline" onClick={addExperience} className="w-full h-11 rounded-xl border-dashed border-2 gap-2 text-muted-foreground hover:text-primary hover:border-primary text-sm">
              <Plus size={16} /> Yeni Təcrübə
            </Button>
          </div>
        )}

        {/* STEP 3 — Təhsil */}
        {step === 3 && (
          <div className="p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-right-4 duration-400">
            {educations.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3 relative">
                {educations.length > 1 && (
                  <button onClick={() => removeEducation(idx)} className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input placeholder="Müəssisə" value={edu.institution} onChange={e => updateEducation(idx, "institution", e.target.value)} className="rounded-xl h-10 text-sm sm:col-span-2" />
                  <Input placeholder="İl (2024)" value={edu.year} onChange={e => updateEducation(idx, "year", e.target.value)} className="rounded-xl h-10 text-sm" />
                  <Input placeholder="İxtisas / Dərəcə" value={edu.degree} onChange={e => updateEducation(idx, "degree", e.target.value)} className="rounded-xl h-10 text-sm sm:col-span-3" />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addEducation} className="w-full h-11 rounded-xl border-dashed border-2 gap-2 text-muted-foreground text-sm">
              <Plus size={16} /> Yeni Təhsil
            </Button>
          </div>
        )}

        {/* STEP 4 — Bacarıqlar & Generate */}
        {step === 4 && (
          <div className="p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bacarıqlar</label>
              <Input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Bacarığı yazıb Enter sıxın..."
                className="rounded-xl h-11"
              />
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="rounded-lg px-3 py-1 gap-1.5 bg-primary/5 text-primary border-primary/20 text-xs font-bold">
                      {skill}
                      <button onClick={() => setSkills(skills.filter(s => s !== skill))}>
                        <Trash2 size={10} className="text-red-500" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20 shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} className="animate-pulse" />
                <h3 className="text-base font-black">Hazırsınız?</h3>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Bütün məlumatlar toplandı. AI sizin üçün ən uyğun CV-ni hazırlayacaq.</p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !personal.fullName}
                className="w-full rounded-xl h-11 font-black gap-2 text-sm"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isGenerating ? "Generasiya olunur..." : "CV Yarat"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5 — Nəticə */}
        {step === 5 && generatedCV && (
          <div className="p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-400">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black flex items-center gap-2">
                <FileText size={18} className="text-primary" /> Önizləmə
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="rounded-lg gap-1.5 text-xs font-bold h-8">
                  <Copy size={13} /> Kopyala
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5 text-xs font-bold h-8">
                  <Download size={13} /> PDF
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-dashed border-border min-h-[400px] prose prose-sm dark:prose-invert max-w-none overflow-y-auto max-h-[60vh]">
              <ReactMarkdown>{generatedCV}</ReactMarkdown>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="gap-2 text-muted-foreground text-sm">
              <ArrowLeft size={15} /> Geri
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex items-center justify-between sm:justify-end gap-3 pb-6">
          <Button
            variant="outline"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="rounded-xl gap-2 font-bold h-11 disabled:opacity-30 text-sm flex-1 sm:flex-none sm:w-32"
          >
            <ArrowLeft size={16} /> Geri
          </Button>
          <Button
            onClick={() => setStep(s => Math.min(4, s + 1))}
            className="rounded-xl gap-2 font-black h-11 shadow-lg shadow-primary/20 text-sm flex-1 sm:flex-none sm:w-36"
          >
            Növbəti <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
