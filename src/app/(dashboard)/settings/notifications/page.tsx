"use client";

import { useState } from "react";
import { Save, CheckCircle, Star, BellRing, Mail, MessageSquare, Briefcase, Sparkles, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function StarRating({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/25"
          }
        />
      ))}
    </span>
  );
}

export default function NotificationsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    dailyDigest: true,
    newApplications: true,
    candidateMessages: true,
    jobExpiry: true,
    platformUpdates: false,
    pushNotifications: false,
  });
  const [minRating, setMinRating] = useState("any");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full overflow-y-auto px-6 sm:px-10 py-10 bg-background/50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex flex-col sm:flex-row items-center sm:items-baseline justify-center sm:justify-start gap-2 sm:gap-3">
            <BellRing className="text-primary hidden sm:block" size={28} />
            <div className="flex items-center gap-2 sm:hidden">
              <BellRing className="text-primary" size={24} />
              <span>Bildiriş</span>
            </div>
            <span className="hidden sm:inline">Bildiriş Tənzimləmələri</span>
            <span className="sm:hidden">Tənzimləmələri</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base font-medium">
            Platformadan hansı məlumatları və nə vaxt almaq istədiyinizi idarə edin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Toggles */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* E-poçt Bildirişləri */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5 relative overflow-hidden backdrop-blur-xl transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full -mr-16 -mt-16 blur-[40px]" />
              
              <h3 className="text-lg font-black text-foreground mb-8 flex items-center gap-3">
                <Mail className="text-blue-500" size={20} />
                E-poçt Bildirişləri
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Yeni Müraciətlər</p>
                    <p className="text-xs text-muted-foreground">Vakansiyalarınıza yeni bir namizəd müraciət etdikdə dərhal xəbərdar olun.</p>
                  </div>
                  <Switch checked={settings.newApplications} onCheckedChange={() => toggleSetting('newApplications')} className="dark:data-[state=unchecked]:bg-slate-700" />
                </div>
                <div className="h-px bg-border dark:bg-white/10 w-full" />
                
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Gündəlik Xülasə</p>
                    <p className="text-xs text-muted-foreground">Hər günün sonunda o gün gələn bütün müraciətlərin toplu siyahısını e-poçtla alın.</p>
                  </div>
                  <Switch checked={settings.dailyDigest} onCheckedChange={() => toggleSetting('dailyDigest')} className="dark:data-[state=unchecked]:bg-slate-700" />
                </div>
                <div className="h-px bg-border dark:bg-white/10 w-full" />

                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Namizəd Mesajları</p>
                    <p className="text-xs text-muted-foreground">Namizədlər sizə platforma daxilində mesaj yazdıqda dərhal xəbər verilsin.</p>
                  </div>
                  <Switch checked={settings.candidateMessages} onCheckedChange={() => toggleSetting('candidateMessages')} className="dark:data-[state=unchecked]:bg-slate-700" />
                </div>
              </div>
            </div>

            {/* Sistem və Yeniliklər */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5 backdrop-blur-xl transition-colors">
              <h3 className="text-lg font-black text-foreground mb-8 flex items-center gap-3">
                <Sparkles className="text-amber-500" size={20} />
                Sistem & Yeniliklər
              </h3>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Vakansiya Xatırlatmaları</p>
                    <p className="text-xs text-muted-foreground">Aktiv vakansiyanızın bitmə müddətinə 3 gün qalmış xatırlatma alın.</p>
                  </div>
                  <Switch checked={settings.jobExpiry} onCheckedChange={() => toggleSetting('jobExpiry')} className="dark:data-[state=unchecked]:bg-slate-700" />
                </div>
                <div className="h-px bg-border dark:bg-white/10 w-full" />
                
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Platforma Yenilikləri</p>
                    <p className="text-xs text-muted-foreground">Yeni xüsusiyyətlər, xəbərlər və endirim kampaniyaları haqqında məlumatlar.</p>
                  </div>
                  <Switch checked={settings.platformUpdates} onCheckedChange={() => toggleSetting('platformUpdates')} className="dark:data-[state=unchecked]:bg-slate-700" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Preferences & Push */}
          <div className="space-y-6">
            
            {/* Push Notifications */}
            <div className="bg-primary dark:bg-[#0f1423] border-transparent dark:border-white/10 border text-primary-foreground dark:text-foreground rounded-[2.5rem] p-8 shadow-2xl shadow-primary/20 dark:shadow-shadow/5 relative overflow-hidden transition-all backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-primary/20 rounded-full -mr-16 -mt-16 blur-xl dark:blur-[40px]" />
              
              <h3 className="text-lg font-black mb-6 flex items-center gap-3 relative z-10">
                <Smartphone size={20} className="dark:text-blue-500" />
                Push Bildirişlər
              </h3>
              
              <p className="text-sm text-primary-foreground/90 dark:text-muted-foreground mb-6 leading-relaxed relative z-10">
                Brauzerinizdən çıxsanız belə dərhal ekranınıza bildirişlərin gəlməsini istəyirsiniz?
              </p>

              <div className="flex items-center justify-between bg-black/20 dark:bg-white/5 rounded-2xl p-4 border border-white/10 dark:border-white/10 relative z-10 backdrop-blur-md">
                <span className="font-bold text-sm">Aktivləşdir</span>
                <Switch 
                  checked={settings.pushNotifications} 
                  onCheckedChange={() => toggleSetting('pushNotifications')}
                  className="data-[state=checked]:bg-white data-[state=checked]:border-white dark:data-[state=unchecked]:bg-slate-700 dark:data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl shadow-shadow/5 backdrop-blur-xl transition-colors">
              <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3">
                <Star className="text-emerald-500" size={20} />
                Ağıllı Filtr
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">MİNİMUM REYTİNQ</label>
                  <Select value={minRating} onValueChange={(v) => setMinRating(v ?? "any")}>
                    <SelectTrigger className="w-full bg-muted/50 dark:bg-slate-800 border-border dark:border-slate-700 rounded-xl h-12 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-slate-900 border-border dark:border-slate-700 rounded-xl">
                      <SelectItem value="any">
                        <span className="text-muted-foreground font-bold">Bütün Namizədlər</span>
                      </SelectItem>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          <StarRating count={n} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/50 dark:bg-slate-800 p-4 rounded-xl border border-border/50 dark:border-slate-700 font-medium">
                  Yalnız seçdiyiniz reytinqə uyğun olan və ya onu aşan namizədlər barədə bildiriş alacaqsınız. <strong className="text-foreground dark:text-white">3-5 ulduzlu</strong> namizədlər tələblərə daha çox uyğundur.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="mt-10 flex justify-end pb-20">
          <button
            onClick={handleSave}
            className={cn(
              "h-14 px-12 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center gap-2",
              saved 
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20" 
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
            )}
          >
            {saved ? (
              <>
                <CheckCircle size={20} />
                Tənzimləmələr Saxlanıldı
              </>
            ) : (
              <>
                <Save size={20} />
                Dəyişiklikləri Saxla
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
