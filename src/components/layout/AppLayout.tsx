"use client";

import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[260px] flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-[260px]">
        {/* Mobile Top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200 shadow-sm">
          <Sheet>
            <SheetTrigger className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              <Menu size={18} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px] border-r-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-medium text-slate-900">
            WDS İşlər
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
