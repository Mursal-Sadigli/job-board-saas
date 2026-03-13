"use client";

import { useAuth } from "@clerk/nextjs";
import EmployerSidebar from "@/components/layout/EmployerSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!isLoaded) return null;

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "shrink-0 border-r border-border dark:border-white/10 bg-background flex-col hidden lg:flex text-muted-foreground transition-all duration-300 ease-in-out overflow-hidden z-50",
          isSidebarCollapsed ? "w-0 opacity-0" : "w-[280px] opacity-100"
        )}
      >
        <EmployerSidebar isCollapsed={isSidebarCollapsed} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top bar for mobile / collapse toggle */}
        <header className="shrink-0 h-[65px] flex items-center px-6 bg-background border-b border-border dark:border-white/10 z-40 lg:hidden">
          <Sheet>
            <SheetTrigger className="w-10 h-10 flex items-center justify-center rounded-xl bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95 outline-none cursor-pointer backdrop-blur-xl">
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] border-r border-border dark:border-white/10 bg-background">
              <EmployerSidebar />
            </SheetContent>
          </Sheet>
          <h1 className="ml-4 text-lg font-black text-foreground tracking-tighter">
            İŞƏGÖTÜRƏN
          </h1>
        </header>

        {/* Desktop Collapse Toggle Overlay */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex absolute left-6 top-6 w-11 h-11 items-center justify-center rounded-2xl bg-card dark:bg-[#0f1423] border border-border dark:border-white/10 text-muted-foreground hover:text-foreground transition-all shadow-xl active:scale-95 outline-none z-50 backdrop-blur-xl"
        >
          <Menu size={22} className={cn("transition-transform duration-300", isSidebarCollapsed && "rotate-90")} />
        </button>

        <main className="flex-1 overflow-y-auto w-full h-full relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
