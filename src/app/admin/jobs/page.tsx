"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  Briefcase, 
  Eye, 
  CheckCircle2, 
  XSquare,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockJobs = [
  { id: "1", title: "Senior Frontend Developer", company: "Cybernet LLC", category: "IT", type: "Full-time", isFeatured: true, status: "Aktiv", views: 1240, applied: 45 },
  { id: "2", title: "UI/UX Designer", company: "PASHA Bank", category: "Dizayn", type: "Hibrid", isFeatured: false, status: "Aktiv", views: 850, applied: 12 },
  { id: "3", title: "Marketing Manager", company: "Azercell", category: "Marketinq", type: "Ofis", isFeatured: false, status: "Gözləmədə", views: 0, applied: 0 },
  { id: "4", title: "Node.js Developer", company: "GoldenPay", category: "IT", type: "Uzaqdan", isFeatured: true, status: "Aktiv", views: 2100, applied: 89 },
  { id: "5", title: "Office Manager", company: "Baku Electronics", category: "İdarəetmə", type: "Full-time", isFeatured: false, status: "Arxivlənib", views: 420, applied: 5 },
];

export default function JobsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Aktiv': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Aktiv</Badge>;
      case 'Gözləmədə': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Gözləmədə</Badge>;
      case 'Arxivlənib': return <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none">Arxivlənib</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">İş Elanları</h2>
          <p className="text-muted-foreground">Platformadakı bütün aktiv və passiv elanlara nəzarət edin.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-11 px-6 border-slate-200">
               Arxivlənmişlər
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 rounded-xl h-11 px-6">
               <Briefcase size={18} />
               Yeni Elan Əlavə Et
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
         <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
               <span className="text-blue-600 dark:text-blue-400 font-bold text-3xl">452</span>
               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ümumi Aktiv Elanlar</span>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
               <span className="text-amber-600 dark:text-amber-400 font-bold text-3xl">12</span>
               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Təsdiq Gözləyənlər</span>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
               <span className="text-emerald-600 dark:text-emerald-400 font-bold text-3xl">8,432</span>
               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Cəmi Müraciətlər</span>
            </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white dark:bg-slate-900 border-b pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input 
                  placeholder="Başlıq və ya şirkətə görə axtar..." 
                  className="pl-10 h-11 border-slate-200 focus:border-blue-400 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-bold py-4">İş Elanı & Şirkət</TableHead>
                <TableHead className="font-bold">Kateqoriya</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Baxış/Müraciət</TableHead>
                <TableHead className="text-right font-bold">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{job.title}</span>
                        {job.isFeatured && (
                           <Badge className="bg-amber-100 text-amber-700 h-5 px-1.5 flex gap-1 items-center border-none">
                              <Star size={10} fill="currentColor" />
                              Önə Çıxan
                           </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{job.company} • {job.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className="rounded-lg text-slate-700 h-6">{job.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell className="text-slate-600 font-medium">
                     <span className="text-blue-600">{job.views}</span> / <span className="text-emerald-600">{job.applied}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 rounded-xl p-1 shadow-xl border-slate-200">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-slate-50">
                          <Eye size={16} className="text-slate-500" />
                          <span>Elana bax</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-slate-50">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Təsdiqlə</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-slate-50">
                          <XSquare size={16} className="text-red-500" />
                          <span>Rədd et</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
