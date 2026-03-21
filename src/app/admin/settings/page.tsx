"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Shield, 
  CreditCard, 
  Bell, 
  Server, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  AlertTriangle,
  Mail,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";
import useSWR, { mutate } from "swr";

export default function SettingsPage() {
  const { getToken } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  // Fetch settings using SWR
  const { data: settings, error, isLoading } = useSWR(
    "/api/admin/settings",
    async (url) => {
      const token = await getToken();
      const res = await fetch(`${API_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Ayarları yükləmək mümkün olmadı");
      }
      return res.json();
    }
  );

  const [saving, setSaving] = useState(false);

  // States to hold local changes
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [jobApproval, setJobApproval] = useState(true);
  const [courseApproval, setCourseApproval] = useState(true);
  const [candidateReg, setCandidateReg] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [aiHelper, setAiHelper] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(10);
  const [scoreThreshold, setScoreThreshold] = useState(75);

  // Sync state with fetched data
  useEffect(() => {
    if (settings) {
      setMaintenanceMode(settings.maintenanceMode);
      setJobApproval(settings.jobApprovalRequired);
      setCourseApproval(settings.courseApprovalRequired);
      setCandidateReg(settings.candidateRegistration);
      setEmailNotifs(settings.emailNotifsActive);
      setAiHelper(settings.aiAnalysesEnabled);
      setDailyLimit(settings.dailyAiLimit);
      setScoreThreshold(settings.cvMatchScore);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          maintenanceMode,
          jobApprovalRequired: jobApproval,
          courseApprovalRequired: courseApproval,
          candidateRegistration: candidateReg,
          aiAnalysesEnabled: aiHelper,
          dailyAiLimit: dailyLimit,
          cvMatchScore: scoreThreshold,
          emailNotifsActive: emailNotifs
        })
      });

      if (!res.ok) throw new Error("Yadda saxlamaq mümkün olmadı");
      
      toast({ title: "Uğurlu!", description: "Ayarlar yadda saxlanıldı." });
      mutate("/api/admin/settings");
    } catch (err: any) {
      toast({ title: "Xəta!", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse italic text-muted-foreground">Ayarlar yüklənir...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Ayarları yükləmək mümkün olmadı.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Sistem Ayarları</h2>
        <p className="text-muted-foreground">Platformanın bütün konfiqurasiyalarını buradan idarə edin.</p>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="general" className="rounded-lg py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Settings className="w-4 h-4 mr-2" />
            Ümumi
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Server className="w-4 h-4 mr-2" />
            Sistem və İcazələr
          </TabsTrigger>
          <TabsTrigger value="finance" className="rounded-lg py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <CreditCard className="w-4 h-4 mr-2" />
            Maliyyə & API
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Lock className="w-4 h-4 mr-2" />
            Təhlükəsizlik
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Bell className="w-4 h-4 mr-2" />
            Bildirişlər
          </TabsTrigger>
        </TabsList>

        {/* --- SYSTEM & PERMISSIONS --- */}
        <TabsContent value="system" className="space-y-4">
          <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/20 pb-4">
              <div className="flex items-center gap-2">
                 <Shield className="text-blue-600 w-5 h-5" />
                 <CardTitle>Sistem Giriş və Prosesləri</CardTitle>
              </div>
              <CardDescription>Platformanın işləyişini və əsas icazələri tənzimləyin.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-bold">Texniki Baxım Rejimi (Maintenance)</Label>
                    {maintenanceMode && <Badge variant="destructive" className="animate-pulse">Aktiv</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Aktiv olduqda sayt adi istifadəçilər (Tələbələr) üçün bağlanır.</p>
                </div>
                <Switch 
                  checked={maintenanceMode} 
                  onCheckedChange={setMaintenanceMode} 
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {/* Job Approval */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="space-y-1">
                  <Label className="text-base font-bold">Məcburi Elan Təsdiqi</Label>
                  <p className="text-sm text-muted-foreground">İşəgötürənlərin paylaşdığı elanlar admin təsdiqi gözləyir.</p>
                </div>
                <Switch 
                  checked={jobApproval} 
                  onCheckedChange={setJobApproval}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {/* Course Approval */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="space-y-1">
                  <Label className="text-base font-bold">Məcburi Kurs Təsdiqi</Label>
                  <p className="text-sm text-muted-foreground">Müəllimlərin yüklədiyi kurs dərhal çıxmır, admin təsdiqi gözləyir.</p>
                </div>
                <Switch 
                  checked={courseApproval} 
                  onCheckedChange={setCourseApproval}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {/* Candidate Registration */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="space-y-1">
                  <Label className="text-base font-bold">Namizəd Qeydiyyatı</Label>
                  <p className="text-sm text-muted-foreground">Yeni tələbələrin və namizədlərin platformada qeydiyyatdan keçməsinə icazə ver.</p>
                </div>
                <Switch 
                  checked={candidateReg} 
                  onCheckedChange={setCandidateReg}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {/* AI Analysis Limit */}
              <div className="space-y-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-bold">AI Məsləhətçi & Analiz</Label>
                      <p className="text-sm text-muted-foreground">CV-lərin süni intellekt tərəfindən analizi funksiyasını idarə edin.</p>
                    </div>
                    <Switch 
                      checked={aiHelper} 
                      onCheckedChange={setAiHelper}
                      className="data-[state=checked]:bg-blue-600"
                    />
                 </div>
                 {aiHelper && (
                   <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                         <Label className="text-xs text-slate-500 uppercase">Gündəlik Analiz Limiti</Label>
                         <Input 
                           type="number" 
                           value={dailyLimit} 
                           onChange={(e) => setDailyLimit(parseInt(e.target.value))} 
                           className="h-10 rounded-lg" 
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-xs text-slate-500 uppercase">CV Match Score Həddi (%)</Label>
                         <Input 
                           type="number" 
                           value={scoreThreshold} 
                           onChange={(e) => setScoreThreshold(parseInt(e.target.value))} 
                           className="h-10 rounded-lg" 
                         />
                      </div>
                   </div>
                 )}
              </div>

              {/* Email Notifications System */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-bold">Email Bildiriş Sistemi</Label>
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">Sistem tərəfindən göndərilən avtomatik emailləri aktiv/deaktiv et.</p>
                </div>
                <Switch 
                  checked={emailNotifs} 
                  onCheckedChange={setEmailNotifs}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
             <Button variant="outline" className="rounded-xl px-8 h-12">Ləğv et</Button>
             <Button 
               onClick={handleSave} 
               disabled={saving}
               className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 h-12 flex gap-2"
             >
                <Save size={18} />
                {saving ? "Yadda saxlanılır..." : "Yadda Saxla"}
             </Button>
          </div>
        </TabsContent>

        {/* --- GENERAL --- */}
        <TabsContent value="general">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Ümumi Sayt Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-2">
                  <Label>Saytın Adı</Label>
                  <Input defaultValue="WDS Jobs" className="h-12 rounded-xl" />
               </div>
               <div className="grid gap-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@wdsjobs.com" className="h-12 rounded-xl" />
               </div>
               <div className="pt-4 flex justify-end">
                  <Button className="bg-blue-600 text-white rounded-xl px-8 h-11">Yadda saxla</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- FINANCE & API --- */}
        <TabsContent value="finance">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Maliyyə və API İnteqrasiyaları</CardTitle>
              <CardDescription>Ödəmə sistemləri və kənar xidmətlər üçün açarlar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Stripe Public Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" value="pk_test_51Px..." className="h-12 rounded-xl font-mono" readOnly />
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl"><Eye size={18} /></Button>
                  </div>
               </div>
               <div className="space-y-2">
                  <Label>Clerk Publishing Key</Label>
                  <Input value="pk_live_..." className="h-12 rounded-xl font-mono" />
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SECURITY --- */}
        <TabsContent value="security">
           <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Təhlükəsizlik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="space-y-1">
                       <Label className="font-bold">İki Faktorlu Autentifikasiya (2FA)</Label>
                       <p className="text-xs text-muted-foreground">Admin girişi üçün məcburi 2FA tələb et.</p>
                    </div>
                    <Switch />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="space-y-1">
                       <Label className="font-bold">Məhdud Giriş</Label>
                       <p className="text-xs text-muted-foreground">Yalnız təsdiqlənmiş IP-lərdən girişi aktiv et.</p>
                    </div>
                    <Switch />
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* --- NOTIFICATIONS --- */}
        <TabsContent value="notifications">
           <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Bildiriş Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <Label>Push Bildirişləri</Label>
                       <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <Label>Yeni Müraciət Bildirişi (Employer)</Label>
                       <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <Label>Həftəlik Statistika Emaili</Label>
                       <Switch />
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
