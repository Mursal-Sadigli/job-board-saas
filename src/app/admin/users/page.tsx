"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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

const mockUsers = [
  { id: "1", name: "Elvin Məmmədov", email: "elvin@example.com", role: "ADMIN", status: "Aktiv", createdAt: "2024-01-15" },
  { id: "2", name: "Günay Həsənova", email: "gunay@example.com", role: "CANDIDATE", status: "Aktiv", createdAt: "2024-02-20" },
  { id: "3", name: "Rəşad Əliyev", email: "rashad@company.com", role: "EMPLOYER", status: "Pauzada", createdAt: "2024-03-05" },
  { id: "4", name: "Aygün Quliyeva", email: "aygun@example.com", role: "CANDIDATE", status: "Aktiv", createdAt: "2024-03-10" },
  { id: "5", name: "Orxan Bağırov", email: "orxan@tech.az", role: "EMPLOYER", status: "Bloklanıb", createdAt: "2024-03-12" },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">Admin</Badge>;
      case 'EMPLOYER': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">İşəgötürən</Badge>;
      case 'CANDIDATE': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Namizəd</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Aktiv': return <div className="flex items-center gap-1.5 text-emerald-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Aktiv</div>;
      case 'Bloklanıb': return <div className="flex items-center gap-1.5 text-red-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Bloklanıb</div>;
      case 'Pauzada': return <div className="flex items-center gap-1.5 text-amber-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Pauzada</div>;
      default: return status;
    }
  };

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

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white dark:bg-slate-900 border-b pb-4">
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
                <TableHead className="font-bold py-4">İstifadəçi</TableHead>
                <TableHead className="font-bold">Rol</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Qeydiyyat</TableHead>
                <TableHead className="text-right font-bold">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-slate-600">{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-200">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-slate-50">
                          <ShieldCheck size={16} className="text-blue-500" />
                          <span>Rolu dəyiş</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-slate-50">
                          <FileEdit size={16} className="text-amber-500" />
                          <span>Redaktə et</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600 focus:text-red-600 rounded-lg cursor-pointer py-2 focus:bg-red-50">
                          <Trash2 size={16} />
                          <span>Sil</span>
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
