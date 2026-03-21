"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  FileEdit, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const { data: stats, isLoading } = useSWR(
    "/api/admin/stats",
    async (url) => {
      const token = await getToken();
      console.log('>>> FETCHING STATS - TOKEN:', token ? 'PRESENT' : 'ABSENT');
      const res = await fetch(`${API_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error('>>> STATS FETCH FAILED:', res.status);
        throw new Error("Statistikalar yüklənmədi");
      }
      return res.json();
    }
  );

  const statCards = [
    { 
      title: "Cəmi İstifadəçilər", 
      value: stats?.totalUsers || 0, 
      change: "+12%", 
      icon: Users,
      color: "bg-blue-500",
      gradient: "from-blue-600 to-blue-400"
    },
    { 
      title: "Aktiv İş Elanları", 
      value: stats?.jobs || 0, 
      change: "+25%", 
      icon: Briefcase,
      color: "bg-emerald-500",
      gradient: "from-emerald-600 to-emerald-400"
    },
    { 
      title: "Müraciətlər", 
      value: stats?.applications || 0, 
      change: "+18%", 
      icon: FileEdit,
      color: "bg-violet-500",
      gradient: "from-violet-600 to-violet-400"
    },
    { 
      title: "Gözləyən Təsdiqlər", 
      value: "5", 
      change: "-5%", 
      icon: Clock,
      color: "bg-orange-500", 
      gradient: "from-orange-600 to-orange-400"
    },
  ];

  if (isLoading) return <div className="p-8 text-center animate-pulse italic text-muted-foreground font-medium">Məlumatlar gətirilir...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Xoş Gəlmisiniz, Admin</h2>
        <p className="text-muted-foreground">Platformanın bugünkü vəziyyətinə dair əsas göstəricilər.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className={`h-1 w-full bg-linear-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10 dark:bg-opacity-20 transition-transform group-hover:scale-110`}>
                <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.change.startsWith('+') ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.change} <span className="text-muted-foreground font-normal ml-1 text-[10px] uppercase">keçən aydan</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Platforma Aktivliyi</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground italic border-t border-slate-50 dark:border-slate-800">
            Qrafik məlumatları tezliklə burada görünəcək...
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son Müraciətlər</CardTitle>
            <TrendingUp size={16} className="text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-4 p-0">
             <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                     <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                        {item}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate leading-none">Frontend Developer müraciəti</p>
                        <p className="text-xs text-muted-foreground mt-1">Namizəd ID: #54{item}</p>
                     </div>
                     <div className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded uppercase">Yeni</div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
