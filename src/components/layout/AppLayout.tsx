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
    <div className="min-h-screen flex" style={{ background: "hsl(var(--background))" }}>
      <Sidebar />

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isOpen ? "lg:ml-[260px]" : "ml-0"
        )}
      >
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3"
          style={{
            background: "hsl(var(--background))",
            borderBottom: "1px solid hsl(var(--border-subtle))",
          }}
        >
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "hsl(var(--foreground-muted))" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "hsl(var(--foreground))")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "hsl(var(--foreground-muted))")
            }
          >
            <Menu size={18} />
          </button>
          <span
            className="text-sm font-medium"
            style={{ color: "hsl(var(--foreground-muted))" }}
          >
            WDS Jobs
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
