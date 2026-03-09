"use client";

import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/utils/cn";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isOpen ? "lg:ml-[260px]" : "ml-0"
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200 shadow-sm">
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-medium text-slate-600">
            WDS Jobs
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
