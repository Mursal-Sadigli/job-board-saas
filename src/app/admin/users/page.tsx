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
  UserPlus, 
  FileEdit, 
  Trash2, 
  ShieldCheck,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";

export default function UsersPage() {
  const { getToken } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading, error } = useSWR(
    "/api/admin/users",
    async (url) => {
      const token = await getToken();
      const res = await fetch(`${API_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "İstifadəçiləri yükləmək mümkün olmadı");
      }
      return res.json();
    }
  );

  const getRoleBadge = (role: string) => {
    switch(role?.toUpperCase()) {
      case 'ADMIN': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">Admin</Badge>;
      case 'EMPLOYER': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">İşəgötürən</Badge>;
      case 'CANDIDATE': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Namizəd</Badge>;
      default: return <Badge variant="outline">{role || 'USER'}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const userStatus = status || 'Aktiv';
    switch(userStatus) {
      case 'Aktiv': return <div className="flex items-center gap-1.5 text-emerald-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Aktiv</div>;
      case 'Bloklanıb': return <div className="flex items-center gap-1.5 text-red-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Bloklanıb</div>;
      case 'Pauzada': return <div className="flex items-center gap-1.5 text-amber-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Pauzada</div>;
      default: return userStatus;
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse italic text-muted-foreground font-medium">İstifadəçilər yüklənir...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">İstifadəçiləri yükləmək mümkün olmadı: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">İstifadəçilər</h2>
          <p className="text-muted-foreground">Sistemdəki bütün istifadəçiləri idarə edin.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 rounded-xl h-11 px-6">
          <UserPlus size={18} />
          Yeni İstifadəçi
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input 
                  placeholder="Ada və ya e-poçta görə axtar..." 
                  className="pl-10 h-11 border-slate-200 focus:border-blue-400 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex gap-2 rounded-xl h-11 border-slate-200">
                   <Filter size={18} />
                   Filtr
                </Button>
                <Button variant="outline" className="flex gap-2 rounded-xl h-11 border-slate-200">
                   Export
                </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-bold py-4 pl-6">İstifadəçi</TableHead>
                <TableHead className="font-bold">Rol</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Qeydiyyat</TableHead>
                <TableHead className="text-right font-bold pr-6">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users || []).map((user: any) => (
                <TableRow key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors border-b border-slate-50 dark:border-slate-800">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{user.name || user.firstName + ' ' + (user.lastName || '')}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none">
                        <MoreVertical size={18} className="text-slate-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-200 bg-white dark:bg-slate-900">
                        <DropdownMenuItem className="flex items-center gap-3 rounded-lg cursor-pointer py-2.5 px-3 focus:bg-slate-50 dark:focus:bg-slate-800 outline-none">
                          <ShieldCheck size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">Rolu dəyiş</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 rounded-lg cursor-pointer py-2.5 px-3 focus:bg-slate-50 dark:focus:bg-slate-800 outline-none">
                          <FileEdit size={16} className="text-amber-500" />
                          <span className="text-sm font-medium">Redaktə et</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 text-red-600 focus:text-red-600 rounded-lg cursor-pointer py-2.5 px-3 focus:bg-red-50 dark:focus:bg-red-900/20 outline-none border-t border-slate-50 dark:border-slate-800 mt-1">
                          <Trash2 size={16} />
                          <span className="text-sm font-medium">Sil</span>
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
