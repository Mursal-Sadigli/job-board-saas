"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { Loader2, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  // Public endpoint-dən statusu götürürük
  const { data: settings, error, isLoading } = useSWR(
    "/api/public/settings",
    async (url) => {
      const res = await fetch(`${API_URL}${url}`);
      return res.json();
    },
    { refreshInterval: 30000 } // Hər 30 saniyədən bir yoxla
  );

  // Admin profilini yoxlayırıq (YALNIZ msadigli2025@gmail.com)
  const isAdminUser = user?.primaryEmailAddress?.emailAddress === "msadigli2025@gmail.com";

  // Admin route-ları hər zaman açıqdır
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isLoading || !userLoaded) return <>{children}</>; 

  // --- YENİ MƏNTİQ ---
  // Texniki Baxış AKTİVDİRSƏ 
  // + İstifadəçi DAXİL OLUBSA (Log In) 
  // + İstifadəçi ADMİN DEYİLSƏ 
  // + Admin səhifəsində DEYİLSƏ
  if (settings?.maintenanceMode && isSignedIn && !isAdminUser && !isAdminRoute) {
    return (
      <html lang="az">
        <body className="antialiased font-sans">
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-8 text-center animate-in fade-in duration-700">
            <div className="relative mb-10 text-blue-600 group">
              <div className="w-28 h-28 bg-blue-100 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center animate-bounce duration-1500 border-4 border-white dark:border-slate-900 shadow-xl shadow-blue-500/10">
                <Wrench size={54} className="group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full animate-ping" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-slate-900 dark:text-white max-w-2xl leading-tight">
              Sizin Hesabınız Hazırda <br/> <span className="text-blue-600">Yenilənmə Rejimindədir</span>
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 max-w-lg text-lg md:text-xl font-medium leading-relaxed">
              Öz hesabınıza daxil olarkən bəzi xidmətlər hazırda deaktiv edilib. 
              Sizin təhlükəsizliyiniz və məlumatlarınızın qorunması üçün bir azdan yenidən cəhd edin.
            </p>

            <div className="mt-12 p-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              SİSTEM YENİLƏNİR...
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Digər hallarda (QONAQLAR, ADMİN və ya qapalı rejim) saytı göstər
  return <>{children}</>;
}
