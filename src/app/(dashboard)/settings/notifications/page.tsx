"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Save, CheckCircle, Star, BellRing, Mail, MessageSquare, Briefcase, Sparkles, Smartphone, Send, ExternalLink, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
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
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    dailyDigest: true,
    newApplications: true,
    candidateMessages: true,
    jobExpiry: true,
    platformUpdates: false,
    pushNotifications: false,
    telegramNewApplications: true,
    whatsappNewApplications: true,
    minRating: "any"
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`${API_BASE}/api/users/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            const { telegramId: tgId, ...rest } = data;
            setSettings(prev => ({ ...prev, ...rest }));
            setTelegramId(tgId);
          }
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [getToken, API_BASE]);

  const handleSave = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/api/users/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationSettings: settings }),
      });

      if (response.ok) {
        setSaved(true);
        toast({
          title: "Uğurlu",
          description: "Bildiriş tənzimləmələri yadda saxlanıldı.",
        });
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        type: "error",
        description: "Məlumatları yadda saxlamaq mümkün olmadı.",
      });
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    // Special handling for minRating as it's a string, not a boolean
    if (key === 'minRating') return; 
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setMinRating = (value: string) => {
    setSettings(prev => ({ ...prev, minRating: value }));
  };

  const minRating = settings.minRating;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 sm:px-10 py-10 bg-background/50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            <BellRing className="text-primary shrink-0" size={24} />
            <span>Bildiriş Tənzimləmələri</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-xs sm:text-base font-medium">
            Platformadan hansı məlumatları və nə vaxt almaq istədiyinizi idarə edin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Toggles */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* E-poçt Bildirişləri */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-shadow/5 relative overflow-hidden backdrop-blur-xl transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
              
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
                  <Switch checked={settings.newApplications} onCheckedChange={() => toggleSetting('newApplications')} className="data-checked:bg-primary" />
                </div>
                <div className="h-px bg-border dark:bg-white/10 w-full" />
                
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Gündəlik Xülasə</p>
                    <p className="text-xs text-muted-foreground">Hər günün sonunda o gün gələn bütün müraciətlərin toplu siyahısını e-poçtla alın.</p>
                  </div>
                  <Switch checked={settings.dailyDigest} onCheckedChange={() => toggleSetting('dailyDigest')} className="data-checked:bg-primary" />
                </div>
                <div className="h-px bg-border dark:bg-white/10 w-full" />

                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Namizəd Mesajları</p>
                    <p className="text-xs text-muted-foreground">Namizədlər sizə platforma daxilində mesaj yazdıqda dərhal xəbər verilsin.</p>
                  </div>
                  <Switch checked={settings.candidateMessages} onCheckedChange={() => toggleSetting('candidateMessages')} className="data-checked:bg-primary" />
                </div>
              </div>
            </div>

            {/* Telegram Bildirişləri Section */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-shadow/5 relative overflow-hidden backdrop-blur-xl transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 dark:bg-sky-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <h3 className="text-lg font-black text-foreground mb-8 flex items-center gap-3 uppercase tracking-wider">
                <Send className="text-sky-500" size={20} />
                Telegram Bildirişləri
              </h3>

              {!telegramId ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6 flex items-start gap-4">
                  <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-amber-500 mb-1">Telegram ID tapılmadı</p>
                    <p className="text-xs text-amber-500/80 leading-relaxed mb-3">
                      Telegram bildirişlərini almaq üçün profilinizdə Telegram ID-nizi qeyd etməlisiniz.
                    </p>
                    <Link href="/settings/profile" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors">
                      Profilə get <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="text-emerald-500" size={18} />
                  <p className="text-xs font-bold text-emerald-500">
                    Telegram qoşulub (ID: {telegramId})
                  </p>
                </div>
              )}

              <div className="space-y-6 relative z-10">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Yeni Müraciətlər (Telegram)</p>
                    <p className="text-xs text-muted-foreground">Yeni müraciət gəldikdə AI reytinqi ilə birbaşa Telegram mesajı alın.</p>
                  </div>
                  <Switch 
                    checked={settings.telegramNewApplications} 
                    onCheckedChange={() => toggleSetting('telegramNewApplications')} 
                    disabled={!telegramId}
                    className="data-checked:bg-sky-500" 
                  />
                </div>

                <div className="h-px bg-border dark:bg-white/10 w-full" />

                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">WhatsApp Bildirişləri</p>
                    <p className="text-xs text-muted-foreground">Yeni müraciətlər barədə WhatsApp vasitəsilə dərhal bildiriş alın.</p>
                  </div>
                  <Switch 
                    checked={settings.whatsappNewApplications} 
                    onCheckedChange={() => toggleSetting('whatsappNewApplications')} 
                    className="data-checked:bg-emerald-500" 
                  />
                </div>
              </div>
            </div>

            {/* Sistem və Yeniliklər */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-shadow/5 backdrop-blur-xl transition-colors">
              <h3 className="text-lg font-black text-foreground mb-8 flex items-center gap-3 uppercase tracking-wider">
                <Sparkles className="text-amber-500" size={20} />
                Sistem & Yeniliklər
              </h3>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Vakansiya Xatırlatmaları</p>
                    <p className="text-xs text-muted-foreground">Aktiv vakansiyanızın bitmə müddətinə 3 gün qalmış xatırlatma alın.</p>
                  </div>
                  <Switch checked={settings.jobExpiry} onCheckedChange={() => toggleSetting('jobExpiry')} className="data-checked:bg-primary" />
                </div>
                <div className="h-px bg-border dark:bg-white/10 w-full" />
                
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Platforma Yenilikləri</p>
                    <p className="text-xs text-muted-foreground">Yeni xüsusiyyətlər, xəbərlər və endirim kampaniyaları haqqında məlumatlar.</p>
                  </div>
                  <Switch checked={settings.platformUpdates} onCheckedChange={() => toggleSetting('platformUpdates')} className="data-checked:bg-primary" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Preferences & Push */}
          <div className="space-y-6">
            
            {/* Push Notifications */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-shadow/5 relative overflow-hidden transition-all backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3 relative z-10 uppercase tracking-wider">
                <Smartphone size={20} className="text-blue-500" />
                Push Bildirişlər
              </h3>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed relative z-10 font-medium">
                Brauzerinizdən çıxsanız belə dərhal ekranınıza bildirişlərin gəlməsini istəyirsiniz?
              </p>

              <div className="flex items-center justify-between bg-muted/50 dark:bg-white/5 rounded-2xl p-4 sm:p-5 border border-border dark:border-white/10 relative z-10 backdrop-blur-md">
                <span className="font-bold text-sm text-foreground">Aktivləşdir</span>
                <div className="shrink-0">
                  <Switch 
                    checked={settings.pushNotifications} 
                    onCheckedChange={() => toggleSetting('pushNotifications')}
                    className="data-checked:bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div className="bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-shadow/5 backdrop-blur-xl transition-colors">
              <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-wider">
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
                        <span className="text-muted-foreground font-bold italic">Bütün Namizədlər</span>
                      </SelectItem>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          <StarRating count={n} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/50 dark:bg-slate-800 p-4 rounded-xl border border-border/50 dark:border-slate-700 font-medium tracking-tight">
                  Yalnız seçdiyiniz reytinqə uyğun olan və ya onu aşan namizədlər barədə bildiriş alacaqsınız. <strong className="text-foreground dark:text-white font-black underline decoration-primary/30 underline-offset-2 tracking-normal">3-5 ulduzlu</strong> namizədlər tələblərə daha çox uyğundur.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="mt-12 flex justify-center sm:justify-end pb-20">
          <button
            onClick={handleSave}
            className={cn(
              "h-14 w-full sm:w-auto px-10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 whitespace-nowrap",
              saved 
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20" 
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
            )}
          >
            {saved ? (
              <>
                <CheckCircle size={20} className="shrink-0" />
                <span>Tənzimləmələr Saxlanıldı</span>
              </>
            ) : (
              <>
                <Save size={20} className="shrink-0" />
                <span>Dəyişiklikləri Saxla</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
