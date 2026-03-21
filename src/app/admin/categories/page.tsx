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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Layers
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockCategories = [
  { id: "1", name: "İnformasiya Texnologiyaları", slug: "it", jobsCount: 154, createdAt: "2024-01-10" },
  { id: "2", name: "Dizayn və Yaradıcılıq", slug: "design", jobsCount: 42, createdAt: "2024-01-12" },
  { id: "3", name: "Marketinq və Satış", slug: "marketing", jobsCount: 89, createdAt: "2024-01-15" },
  { id: "4", name: "Maliyyə və Mühasibat", slug: "finance", jobsCount: 63, createdAt: "2024-01-20" },
  { id: "5", name: "Müştəri Xidmətləri", slug: "customer-service", jobsCount: 28, createdAt: "2024-02-01" },
];

export default function CategoriesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kateqoriyalar</h2>
          <p className="text-muted-foreground">İş elanları üçün kateqoriyaları idarə edin.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20">
          <Plus size={18} />
          Yeni Kateqoriya
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Statistics Cards for Categories */}
        <Card className="border-none shadow-sm md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
           <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">Cəmi Kateqoriya</CardTitle>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">12</div>
           </CardHeader>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input 
                  placeholder="Kateqoriya axtar..." 
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
                <TableHead className="font-bold py-4">Kateqoriya Adı</TableHead>
                <TableHead className="font-bold">Slug (URL)</TableHead>
                <TableHead className="font-bold">İş Sayı</TableHead>
                <TableHead className="font-bold">Yaradılma Tarixi</TableHead>
                <TableHead className="text-right font-bold">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCategories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Layers size={16} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{cat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs text-slate-600 font-mono">/{cat.slug}</code>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-300">{cat.jobsCount} iş</TableCell>
                  <TableCell className="text-slate-500">{cat.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-200">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-slate-50">
                          <Edit2 size={16} className="text-amber-500" />
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
