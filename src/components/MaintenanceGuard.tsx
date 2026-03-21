"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { Loader2, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const pathname = usePathname();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  // Public endpoint-dən statusu götürürük
  const { data: settings, error, isLoading } = useSWR(
    "/api/public/settings",
    async (url) => {
      const res = await fetch(`${API_URL}${url}`);
      return res.json();
    },
    { refreshInterval: 60000 } // Hər 1 dəqiqədən bir yoxla
  );

  // Admin profilini yoxlayırıq (Clerk metadata və ya e-poçt vasitəsilə)
  const isAdminUser = 
    user?.publicMetadata?.role === "ADMIN" || 
    user?.primaryEmailAddress?.emailAddress === "msadigli2025@gmail.com";

  // Əgər /admin route-undadırsa, heç vaxt texniki baxış rejimini göstərmə (admin həmişə görsün)
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isLoading || !userLoaded) return <>{children}</>; 

  // Texniki Baxış rejimi AKTİVDİRSƏ və bu istifadəçi ADMİN DEYİLSƏ
  if (settings?.maintenanceMode && !isAdminUser && !isAdminRoute) {
    return (
      <html lang="az">
        <body className="antialiased">
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 text-center animate-in fade-in duration-500">
            <div className="relative mb-8 text-blue-600">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center animate-bounce duration-1000">
                <Wrench size={48} />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping" />
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tighter mb-4 text-slate-900 dark:text-white">
              Platformada Texniki Yenilənmə Gedir
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg font-medium leading-relaxed">
              Hazırda saytda təkmilləşdirmə işləri aparırıq ki, Sizə daha yaxşı təcrübə təqdim edək.
              Qısa müddət sonra yenidən xidmətinizdəyik.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
              <Loader2 className="animate-spin" size={16} />
              Zəhmət olmasa, gözləyin...
            </div>
          </div>
        </body>
      </html>
    );
  }

  return <>{children}</>;
}
