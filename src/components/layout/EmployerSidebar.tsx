"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Users,
  CreditCard,
  ArrowLeftRight,
  LogOut,
  ChevronDown,
  ArrowLeft,
  X,
  FileText,
  Calendar,
  PieChart,
  UserCheck,
  Star,
  Search,
} from "lucide-react";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/utils/cn";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";

const FALLBACK_USER = {
  firstName: "Qonaq",
  lastName: "",
  email: "giriş edilməyib",
};

interface EmployerSidebarProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
}

export default function EmployerSidebar({
  onNavigate,
  isCollapsed = false,
}: EmployerSidebarProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);

  const displayName = user
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : FALLBACK_USER.firstName;
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress || FALLBACK_USER.email;
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "??";

  const handleNavigate = (href: string) => {
    setDropdownOpen(false);
    onNavigate?.();
    router.push(href);
  };

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-background border-r border-border shadow-sm/5">
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 mt-8 py-8 flex flex-col gap-4 custom-scrollbar">
        <Link
          href={ROUTES.employer.root}
          onClick={() => onNavigate?.()}
          className={cn(
            "flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-sm font-bold transition-all w-full",
            pathname === ROUTES.employer.root
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Building2 size={18} className={cn("shrink-0", pathname === ROUTES.employer.root ? "text-primary-foreground" : "text-muted-foreground/60")} />
          {!isCollapsed && <span>Paneli İdarə Et</span>}
        </Link>
        
        <Link
          href={ROUTES.jobBoard}
          onClick={() => onNavigate?.()}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all w-full",
            "text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft size={18} className="shrink-0 text-muted-foreground/60" />
          {!isCollapsed && <span>Əsas Səhifəyə Qayıt</span>}
        </Link>

        {/* ATS Section */}
        {!isCollapsed && (
          <div className="mt-6 mb-2 px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              ATS Sistemi
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Link
            href={ROUTES.employer.ats.candidates}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full",
              pathname === ROUTES.employer.ats.candidates
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Users size={18} className={cn("shrink-0", pathname === ROUTES.employer.ats.candidates ? "text-primary-foreground" : "text-muted-foreground/60")} />
            {!isCollapsed && <span>Namizədlər</span>}
          </Link>

          <Link
            href={ROUTES.employer.ats.applications}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full",
              pathname === ROUTES.employer.ats.applications
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <FileText size={18} className={cn("shrink-0", pathname === ROUTES.employer.ats.applications ? "text-primary-foreground" : "text-muted-foreground/60")} />
            {!isCollapsed && <span>Müraciətlər</span>}
          </Link>

          <Link
            href={ROUTES.employer.ats.interviews}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full",
              pathname === ROUTES.employer.ats.interviews
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Calendar size={18} className={cn("shrink-0", pathname === ROUTES.employer.ats.interviews ? "text-primary-foreground" : "text-muted-foreground/60")} />
            {!isCollapsed && <span>Müsahibələr</span>}
          </Link>

          <Link
            href={ROUTES.employer.ats.analytics}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full",
              pathname === ROUTES.employer.ats.analytics
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <PieChart size={18} className={cn("shrink-0", pathname === ROUTES.employer.ats.analytics ? "text-primary-foreground" : "text-muted-foreground/60")} />
            {!isCollapsed && <span>Analitika</span>}
          </Link>

          <Link
            href={ROUTES.employer.ats.talentPool}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full",
              pathname === ROUTES.employer.ats.talentPool
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Star size={18} className={cn("shrink-0", pathname === ROUTES.employer.ats.talentPool ? "text-primary-foreground" : "text-muted-foreground/60")} />
            {!isCollapsed && <span>İstedad Hovuzu</span>}
          </Link>
        </div>
      </nav>

      {/* Organization Switcher Modal */}
      {orgSwitcherOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOrgSwitcherOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#1C1F26] rounded-3xl shadow-2xl border border-border p-6 z-10 min-w-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Təşkilatı Dəyiş</h3>
              <button
                onClick={() => setOrgSwitcherOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <OrganizationSwitcher
              appearance={{
                elements: {
                  rootBox: "w-full",
                  organizationSwitcherTrigger: "w-full",
                },
              }}
              hidePersonal={false}
              afterSelectOrganizationUrl={ROUTES.employer.root}
              afterSelectPersonalUrl={ROUTES.jobBoard}
            />
          </div>
        </div>
      )}

      {/* User section */}
      {user && (
        <div className="p-4 border-t border-border bg-background">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger
              className={cn(
                "w-full flex items-center rounded-xl hover:bg-muted/50 transition-all group outline-none py-2 border border-transparent cursor-pointer",
                isCollapsed ? "justify-center px-0" : "px-0 gap-3"
              )}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-base font-bold bg-primary text-primary-foreground shadow-sm uppercase">
                {initials}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[15px] font-bold text-foreground truncate">
                      {displayName}
                    </p>
                    <p className="text-[13px] text-muted-foreground truncate font-medium">
                      {displayEmail}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-300 shrink-0 text-muted-foreground/60 font-bold",
                      dropdownOpen && "rotate-180"
                    )}
                  />
                </>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[260px] rounded-2xl p-2 border-border shadow-2xl bg-white dark:bg-[#1C1F26] isolate z-100"
            >
              <DropdownMenuItem
                className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all font-medium text-sm"
                onClick={() => handleNavigate(ROUTES.employer.root)}
              >
                <Building2 size={16} className="text-muted-foreground/60 shrink-0" />
                <span>Təşkilatı İdarə Et</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all font-medium text-sm"
                onClick={() => handleNavigate(ROUTES.settings.notifications)}
              >
                <Users size={16} className="text-muted-foreground/60 shrink-0" />
                <span>İstifadəçi Parametrləri</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all font-medium text-sm"
                onClick={() => handleNavigate("/upgrade")}
              >
                <CreditCard size={16} className="text-muted-foreground/60 shrink-0" />
                <span>Planı Dəyiş</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all font-medium text-sm"
                onClick={() => {
                  setDropdownOpen(false);
                  setOrgSwitcherOpen(true);
                }}
              >
                <ArrowLeftRight size={16} className="text-muted-foreground/60 shrink-0" />
                <span>Təşkilatı Dəyiş</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-border/50" />

              <SignOutButton>
                <DropdownMenuItem
                  className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-semibold text-sm"
                  onClick={() => setDropdownOpen(false)}
                >
                  <LogOut size={16} className="shrink-0" />
                  <span>Çıxış</span>
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
