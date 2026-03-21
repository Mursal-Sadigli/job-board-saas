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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-all" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Overlay for Desktop Collapsed State */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
        isCollapsed ? "w-20" : "w-72",
        sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className={cn(
            "h-20 flex items-center px-6 border-b border-slate-50 dark:border-slate-800 transition-all",
            isCollapsed && !sidebarOpen ? "justify-center px-0" : "justify-between"
          )}>
            {(!isCollapsed || sidebarOpen) ? (
              <Link href="/" className="flex items-center gap-2.5 animate-in fade-in zoom-in duration-300">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                  W
                </div>
                <h2 className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin <span className="text-slate-900 dark:text-white">Panel</span>
                </h2>
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                W
              </div>
            )}
            
            {/* Collapse Toggle for Desktop */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>

            {/* Close for Mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                    active 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <item.icon size={20} className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-white" : "text-slate-400 group-hover:text-blue-500"
                  )} />
                  {(!isCollapsed || sidebarOpen) && (
                    <span className="animate-in slide-in-from-left-2 duration-300 flex-1 truncate">
                      {item.name}
                    </span>
                  )}
                  {active && (!isCollapsed || sidebarOpen) && (
                    <ChevronRight size={14} className="animate-in slide-in-from-right-2" />
                  )}
                  {isCollapsed && !sidebarOpen && active && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section at Bottom */}
          <div className="p-4 border-t border-slate-50 dark:border-slate-800">
             <div className={cn(
               "flex items-center gap-3 px-2 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 transition-all",
               isCollapsed && !sidebarOpen ? "justify-center px-0" : ""
             )}>
                <UserButton afterSignOutUrl="/" />
                {(!isCollapsed || sidebarOpen) && (
                  <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">İdarəçi</p>
                    <p className="text-[10px] text-slate-500 truncate lowercase">M. Sadigli</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              size="icon"
              className="lg:hidden rounded-xl h-10 w-10 border-slate-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <div className="hidden sm:flex items-center bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl px-4 py-2 w-72 gap-3 border border-slate-200/50 dark:border-slate-700/50 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all group">
               <Search size={18} className="text-slate-400 group-focus-within:text-blue-500" />
               <input 
                 type="text" 
                 placeholder="Sürətli axtarış..." 
                 className="bg-transparent text-sm border-none focus:ring-0 w-full text-slate-700 dark:text-slate-200 p-0"
               />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl relative text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
               <Bell size={20} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </Button>
          </div>
        </header>

        {/* Page Content Holder */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
           <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
