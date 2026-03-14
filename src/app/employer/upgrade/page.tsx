"use client";

import { useState } from "react";
import { 
  Check, 
  Zap, 
  Crown, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";

export default function UpgradePage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5001/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Checkout session creation failed");
      
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast({
        title: "Xəta",
        description: "Ödəniş sessiyası yaradıla bilmədi. Lütfən bir qədər sonra yenidən cəhd edin.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-24">
        {/* Navigation */}
        <button 
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-white transition-colors mb-12"
        >
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all">
            <ArrowLeft size={16} />
          </div>
          GERİ QAYIT
        </button>

        <div className="text-center space-y-4 mb-20">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full font-black text-[10px] tracking-[0.2em] uppercase">
            ABUNƏLİK PLANLARI
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white">
            İstedadlarınızı <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-primary animate-gradient bg-[length:200%_auto]">Limitsiz</span> Edin
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Pulsuz limitlərdən qurtulun və AI gücü ilə işə qəbul prosesinizi peşəkar səviyyəyə daşıyın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Free Plan */}
          <div className="p-8 lg:p-10 rounded-[40px] bg-slate-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-white">Başlanğıc</h3>
                <p className="text-sm text-slate-400 mt-1">Kiçik komandalar üçün</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-slate-500 font-bold">/ ay</span>
              </div>
              <ul className="space-y-4 pt-6 border-t border-white/5">
                {[
                  "Maksimum 3 CV analizi",
                  "Məhdud İstedad Hovuzu",
                  "Vahid iş elanı",
                  "Standart dəstək"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                      <Check size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-white/10 bg-transparent text-white font-black hover:bg-white/5 transition-all"
                disabled
              >
                CARİ PLAN
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="p-8 lg:p-12 rounded-[40px] bg-linear-to-b from-slate-900 via-slate-900 to-primary/5 border-2 border-primary/50 shadow-2xl shadow-primary/20 relative overflow-hidden transform md:scale-105 z-10">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            
            <div className="absolute top-6 right-8">
              <Badge className="bg-primary text-primary-foreground border-none px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest shadow-lg shadow-primary/20">
                TÖVSİYƏ OLUNAN
              </Badge>
            </div>

            <div className="space-y-8 relative">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/40">
                  <Crown size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Premium</h3>
                  <p className="text-sm text-primary/80 font-bold uppercase tracking-widest">Sınırsız Güc</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-white">$29</span>
                <span className="text-slate-400 font-black text-xl">.00</span>
                <span className="text-slate-500 font-bold ml-1">/ ay</span>
              </div>

              <ul className="space-y-5 pt-8 border-t border-white/10">
                {[
                  { text: "Sınırsız CV Analizi & Yükləmə", icon: <Zap className="text-primary" /> },
                  { text: "Limitsiz İstedad Hovuzu Girişi", icon: <Sparkles className="text-emerald-400" /> },
                  { text: "Sınırsız İş Elanı Paylaşımı", icon: <Check /> },
                  { text: "Prioritetli Müştəri Dəstəyi (24/7)", icon: <ShieldCheck /> },
                  { text: "Genişləndirilmiş AI Reytinqləri", icon: <Check /> }
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-base font-bold text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-white/5 dark:bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {typeof feature === 'string' ? <Check size={14} /> : feature.icon}
                    </div>
                    {typeof feature === 'string' ? feature : feature.text}
                  </li>
                ))}
              </ul>

              <Button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full h-16 rounded-[24px] bg-primary text-primary-foreground font-black text-lg shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    İNDİ YÜKSƏLT
                    <Zap size={18} className="ml-2 group-hover:animate-bounce" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-[11px] font-medium text-slate-500">
                Təhlükəsiz Stripe ödənişi • İstənilən vaxt ləğv et
              </p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-24 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8">TEXNOLOJİ PARTNYORLARIMIZ</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Placeholders for logos */}
            <div className="text-2xl font-black text-white italic">Stripe</div>
            <div className="text-2xl font-black text-white italic">Clerk</div>
            <div className="text-2xl font-black text-white italic">OpenAI</div>
            <div className="text-2xl font-black text-white italic">Prisma</div>
          </div>
        </div>
      </div>
    </div>
  );
}
