"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Layers, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "İstifadəçilər", href: "/admin/users", icon: Users },
  { name: "İş Elanları", href: "/admin/jobs", icon: Briefcase },
  { name: "Kateqoriyalar", href: "/admin/categories", icon: Layers },
  { name: "Ayarlar", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoaded, userId } = useAuth();

  // Qeyd: Real layihədə burada həmçinin DB-dən gələn "role === 'ADMIN'" yoxlanışı olmalıdır.
  // Bu hissə təməl quruluşdur.

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                W
              </div>
              <span className="text-xl font-bold tracking-tight dark:text-white">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    active 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <item.icon size={18} className={cn(active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout Mini Card */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <div className="flex items-center gap-3 px-2">
                <UserButton afterSignOutUrl="/" />
                <div className="flex-1 overflow-hidden">
                   <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">Admin</p>
                   <p className="text-[10px] text-slate-500 truncate">admin@wdsjobs.com</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 lg:hidden text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 w-64 gap-2 border border-transparent focus-within:border-blue-400 transition-all">
               <Search size={16} className="text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Axtar..." 
                 className="bg-transparent text-sm border-none focus:ring-0 w-full text-slate-700 dark:text-slate-300"
               />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:bg-slate-100 rounded-full">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </Button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
               <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">İdarəçi</p>
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
