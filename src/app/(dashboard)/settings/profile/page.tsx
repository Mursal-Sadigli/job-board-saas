"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle, 
  Github, 
  Linkedin, 
  Globe,
  Camera,
  Layers,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import { 
  CandidateProfile, 
  ExperienceItem, 
  EducationItem, 
  SocialLink 
} from "@/types/user";

export default function ProfilePage() {
  const { user } = useUser();
  const [saved, setSaved] = useState(false);
  
  // Initial Mock Data
  const [profile, setProfile] = useState<CandidateProfile>({
    id: user?.id || "1",
    firstName: user?.firstName || "Mursal",
    lastName: user?.lastName || "Sadigli",
    email: user?.primaryEmailAddress?.emailAddress || "msadigli2025@gmail.com",
    title: "Senior Full Stack Developer",
    bio: "Mən müasir veb texnologiyaları ilə yüksək performanslı tətbiqlər yaradan bir developerəm. React, Next.js və Node.js sahəsində 5 illik təcrübəm var.",
    location: "Bakı, Azərbaycan",
    phone: "+994 50 123 45 67",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
    experience: [
      {
        id: "e1",
        company: "Tech Solutions",
        position: "Lead Developer",
        startDate: "2021-01",
        endDate: "",
        current: true,
        description: "Böyük miqyaslı SaaS layihələrinin arxitekturasının qurulması və komandaya rəhbərlik."
      }
    ],
    education: [
      {
        id: "edu1",
        school: "Bakı Dövlət Universiteti",
        degree: "Bakalavr",
        field: "Kompüter Elmləri",
        startDate: "2015-09",
        endDate: "2019-06"
      }
    ],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/msadigli' },
      { platform: 'github', url: 'https://github.com/msadigli' }
    ]
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addSkill = (skill: string) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setProfile(prev => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: ""
    };
    setProfile(prev => ({ ...prev, education: [newEdu, ...prev.education] }));
  };

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-8 py-8 bg-background custom-scrollbar">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Profil Parametrləri
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Peşəkar şəxsiyyətinizi və bacarıqlarınızı nümayiş etdirin
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleSave}
          className={cn(
            "h-12 px-8 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20",
            saved ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90"
          )}
        >
          {saved ? (
            <div className="flex items-center gap-2">
              <CheckCircle size={18} />
              Yadda saxlanıldı
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={18} />
              Dəyişiklikləri Saxla
            </div>
          )}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Avatar & Personal Info Quick View */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5 relative overflow-hidden group">
            {/* Glossy background effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-muted border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden group/avatar">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-muted-foreground/30 uppercase">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-4 border-background">
                  <Sparkles size={16} />
                </div>
              </div>
              
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm font-bold text-primary mt-1 border-b-2 border-primary/20 pb-1 inline-block">
                {profile.title}
              </p>
              
              <div className="w-full mt-8 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group/item">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                    <Mail size={14} />
                  </div>
                  <span className="text-xs font-semibold truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group/item">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                    <Phone size={14} />
                  </div>
                  <span className="text-xs font-semibold">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group/item">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs font-semibold">{profile.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Layers size={16} className="text-amber-500" />
                </div>
                <h3 className="font-bold text-foreground">Bacarıqlar</h3>
              </div>
              <button 
                onClick={() => {
                  const s = prompt("Bacarıq əlavə edin:");
                  if (s) addSkill(s);
                }}
                className="w-8 h-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <div 
                  key={skill}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all cursor-default"
                >
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground lowercase">
                    {skill}
                  </span>
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Me Section */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Haqqında
            </h3>
            <Textarea 
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Özünüz haqqında məlumat yazın..."
              className="min-h-[150px] bg-muted/30 border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
            />
          </div>

          {/* Professional Experience */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-foreground flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                İş Təcrübəsi
              </h3>
              <Button 
                onClick={addExperience}
                variant="outline" 
                size="sm" 
                className="rounded-xl gap-2 border-border hover:bg-muted font-bold text-xs"
              >
                <Plus size={14} />
                Əlavə Et
              </Button>
            </div>

            <div className="space-y-8">
              {profile.experience.map((exp, idx) => (
                <div key={exp.id} className="relative pl-8 group">
                  {/* Timeline connector */}
                  {idx < profile.experience.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-[-2rem] w-0.5 bg-border group-hover:bg-primary/20 transition-colors" />
                  )}
                  <div className="absolute left-[3px] top-[6px] w-5 h-5 rounded-full bg-background border-4 border-primary shadow-sm z-10" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">ŞİRKƏT</label>
                        <Input 
                          value={exp.company}
                          placeholder="Məs: Google"
                          className="bg-muted/30 border-border rounded-xl h-10 font-bold"
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[idx].company = e.target.value;
                            setProfile(prev => ({ ...prev, experience: newExp }));
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">VƏZİFƏ</label>
                        <Input 
                          value={exp.position}
                          placeholder="Məs: UI/UX Designer"
                          className="bg-muted/30 border-border rounded-xl h-10 font-bold"
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[idx].position = e.target.value;
                            setProfile(prev => ({ ...prev, experience: newExp }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">BAŞLAMA</label>
                          <Input 
                            type="month"
                            value={exp.startDate}
                            className="bg-muted/30 border-border rounded-xl h-10"
                            onChange={(e) => {
                              const newExp = [...profile.experience];
                              newExp[idx].startDate = e.target.value;
                              setProfile(prev => ({ ...prev, experience: newExp }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">BİTMƏ</label>
                          <Input 
                            type="month"
                            disabled={exp.current}
                            value={exp.endDate}
                            className="bg-muted/30 border-border rounded-xl h-10"
                            onChange={(e) => {
                              const newExp = [...profile.experience];
                              newExp[idx].endDate = e.target.value;
                              setProfile(prev => ({ ...prev, experience: newExp }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 px-1">
                        <input 
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[idx].current = e.target.checked;
                            setProfile(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="w-4 h-4 rounded border-border bg-muted/30 text-primary focus:ring-primary/20"
                        />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Hazırda burada işləyirəm</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">İŞ TƏSVİRİ</label>
                    <Textarea 
                      value={exp.description}
                      placeholder="Gördüyünüz işlər haqqında qısa..."
                      className="min-h-[80px] bg-muted/30 border-border rounded-xl p-3 text-sm"
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[idx].description = e.target.value;
                        setProfile(prev => ({ ...prev, experience: newExp }));
                      }}
                    />
                  </div>
                  
                  <button 
                    onClick={() => {
                      setProfile(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) }));
                    }}
                    className="absolute top-0 right-0 w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-foreground flex items-center gap-3">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Təhsil
              </h3>
              <Button 
                onClick={addEducation}
                variant="outline" 
                size="sm" 
                className="rounded-xl gap-2 border-border hover:bg-muted font-bold text-xs"
              >
                <Plus size={14} />
                Əlavə Et
              </Button>
            </div>

            <div className="space-y-6">
              {profile.education.map((edu) => (
                <div key={edu.id} className="p-6 rounded-3xl bg-muted/20 border border-border group relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">MÜƏSSİSƏ</label>
                        <Input 
                          value={edu.school}
                          placeholder="Məs: ADA Universiteti"
                          className="bg-background border-border rounded-xl h-10 font-bold"
                          onChange={(e) => {
                            const newEdu = profile.education.map(ed => ed.id === edu.id ? { ...ed, school: e.target.value } : ed);
                            setProfile(prev => ({ ...prev, education: newEdu }));
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">DƏRƏCƏ VƏ SAHƏ</label>
                        <div className="flex gap-2">
                          <Input 
                            value={edu.degree}
                            placeholder="Məs: Bakalavr"
                            className="bg-background border-border rounded-xl h-10 font-bold w-1/3"
                            onChange={(e) => {
                              const newEdu = profile.education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed);
                              setProfile(prev => ({ ...prev, education: newEdu }));
                            }}
                          />
                          <Input 
                            value={edu.field}
                            placeholder="Məs: İnformasiya Texnologiyaları"
                            className="bg-background border-border rounded-xl h-10 font-bold flex-1"
                            onChange={(e) => {
                              const newEdu = profile.education.map(ed => ed.id === edu.id ? { ...ed, field: e.target.value } : ed);
                              setProfile(prev => ({ ...prev, education: newEdu }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">BAŞLAMA</label>
                          <Input 
                            type="month"
                            value={edu.startDate}
                            className="bg-background border-border rounded-xl h-10"
                            onChange={(e) => {
                              const newEdu = profile.education.map(ed => ed.id === edu.id ? { ...ed, startDate: e.target.value } : ed);
                              setProfile(prev => ({ ...prev, education: newEdu }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">BİTMƏ</label>
                          <Input 
                            type="month"
                            value={edu.endDate}
                            className="bg-background border-border rounded-xl h-10"
                            onChange={(e) => {
                              const newEdu = profile.education.map(ed => ed.id === edu.id ? { ...ed, endDate: e.target.value } : ed);
                              setProfile(prev => ({ ...prev, education: newEdu }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setProfile(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }));
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5">
            <h3 className="text-lg font-black text-foreground mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
              Sosial Linklər
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Linkedin size={16} className="text-[#0077b5]" />
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">LinkedIn</span>
                </div>
                <Input 
                  placeholder="linkedin.com/in/username"
                  value={profile.socialLinks.find(l => l.platform === 'linkedin')?.url || ""}
                  className="bg-muted/30 border-border rounded-xl h-12 focus:border-[#0077b5] focus:ring-[#0077b5]/10"
                />
              </div>
              <div className="group space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Github size={16} className="text-foreground" />
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">GitHub</span>
                </div>
                <Input 
                  placeholder="github.com/username"
                  value={profile.socialLinks.find(l => l.platform === 'github')?.url || ""}
                  className="bg-muted/30 border-border rounded-xl h-12 focus:border-foreground focus:ring-foreground/10"
                />
              </div>
              <div className="group space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Globe size={16} className="text-emerald-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Veb-sayt / Portfolio</span>
                </div>
                <Input 
                  placeholder="www.portfolio.com"
                  value={profile.socialLinks.find(l => l.platform === 'portfolio')?.url || ""}
                  className="bg-muted/30 border-border rounded-xl h-12 focus:border-emerald-500 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Padding */}
      <div className="h-20" />
    </div>
  );
}
