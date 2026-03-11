"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton, useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 z-50 transition-all duration-300 ease-in-out border-r border-border h-full",
          isCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </aside>

      {/* Main content area */}
      <div 
        className={cn(
          "flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"
        )}
      >
        {/* Top bar (Header) */}
        <header className="shrink-0 h-[65px] flex items-center justify-between px-6 bg-background border-b border-border z-40">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all shadow-sm outline-none cursor-pointer active:scale-95">
                  <Menu size={20} />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[260px] border-r border-border">
                  <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Collapse Trigger */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95"
            >
              <Menu size={20} className={cn("transition-transform duration-300", isCollapsed && "rotate-90")} />
            </button>

            <h1 className="text-lg font-black text-foreground tracking-tighter hidden sm:block">
              WDS JOBS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <button className="h-9 px-4 rounded-lg bg-card border border-border text-xs font-bold hover:bg-muted transition-all">
                        Giriş
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="h-9 px-4 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all">
                        Qeydiyyat
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>
        </header>

        {/* Page content - This will be scrollable depending on children (like JobBoardPage) */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
