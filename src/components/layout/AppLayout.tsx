"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 z-50 transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </div>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isCollapsed ? "lg:pl-[80px]" : "lg:pl-[260px]"
        )}
      >
        {/* Top bar (Common for both mobile and desktop desktop toggle) */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200 shadow-sm">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <Menu size={18} />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px] border-r-0">
                <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Collapse Trigger (Visible only on desktop) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu size={18} />
          </button>

          <span className="text-sm font-bold text-slate-900">
            WDS Jobs
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
