"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Sparkles,
  Building2,
  Bell,
  FileText,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ChevronRight,
  MenuSquare,
  Moon,
  Sun
} from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
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
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useUser, SignOutButton } from "@clerk/nextjs";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    label: "İş Elanları",
    href: ROUTES.jobBoard,
    icon: <Briefcase size={18} />,
  },
  {
    label: "AI",
    href: ROUTES.aiSearch,
    icon: <Sparkles size={18} />,
  },
  {
    label: "İşəgötürən Paneli",
    href: ROUTES.employer,
    icon: <Building2 size={18} />,
  },
];

const settingsItems: NavItem[] = [
  {
    label: "Bildirişlər",
    href: ROUTES.settings.notifications,
    icon: <Bell size={16} />,
  },
  {
    label: "CV",
    href: ROUTES.settings.resume,
    icon: <FileText size={16} />,
  },
];

// Mock user for fallback
const FALLBACK_USER = {
  firstName: "Qonaq",
  lastName: "",
  email: "giriş edilməyib",
};

interface SidebarProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ 
  onNavigate, 
  isCollapsed = false, 
  onToggle 
}: SidebarProps) {
  const { isLoaded, user } = useUser();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { settingsExpanded, toggleSettings } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isSettingsActive =
    pathname.startsWith("/settings") || settingsExpanded;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const displayName = user ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` : FALLBACK_USER.firstName;
  const displayEmail = user?.primaryEmailAddress?.emailAddress || FALLBACK_USER.email;
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "??";

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-background border-r border-border shadow-sm/5">
      {/* Header */}
      <div className="flex items-center h-[65px] px-4 border-b border-border bg-background">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 dark:shadow-white/5 transition-all">
            <MenuSquare size={16} />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white truncate">
              WDS Jobs
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 flex flex-col gap-1.5 custom-scrollbar">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "flex items-center rounded-xl text-sm font-medium transition-all h-10 group",
                isCollapsed ? "justify-center px-0" : "px-3 gap-3",
                isActive
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-slate-900/10"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
              )}
            >
              <div className={cn("shrink-0 transition-colors", isActive ? "text-inherit" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")}>
                {item.icon}
              </div>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Settings group */}
        <div className="mt-4">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400/80">
              Konfiqurasiya
            </div>
          )}
          <button
            onClick={toggleSettings}
            className={cn(
              "w-full flex items-center rounded-xl text-sm font-medium transition-all h-10 group",
              isCollapsed ? "justify-center px-0" : "px-3 gap-3",
              isSettingsActive
                ? "text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
            )}
          >
            <div className={cn("shrink-0 transition-colors", isSettingsActive ? "text-slate-900 dark:text-white" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")}>
              <Settings size={18} />
            </div>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left truncate font-medium">Tənzimləmələr</span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-transform duration-300 text-slate-400",
                    settingsExpanded && "rotate-90"
                  )}
                />
              </>
            )}
          </button>

          {/* Settings sub-items */}
          {!isCollapsed && (
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                settingsExpanded ? "max-h-[200px] opacity-100 mt-1" : "max-h-0 opacity-0"
              )}
            >
              <div className="ml-5 pl-4 flex flex-col gap-1 border-l border-border/60">
                {settingsItems.map((item) => {
                  const isSubActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onNavigate?.()}
                      className={cn(
                        "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all",
                        isSubActive
                          ? "text-slate-900 dark:text-white bg-slate-100/50 dark:bg-slate-900/50"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30"
                      )}
                    >
                      <div className={cn("shrink-0 transition-colors", isSubActive ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* User section */}
      {user && (
        <div className="p-4 border-t border-border bg-background">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger 
              className={cn(
                "w-full flex items-center rounded-xl focus:bg-slate-100 dark:focus:bg-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all group outline-none h-14 border border-transparent hover:border-border cursor-pointer",
                isCollapsed ? "justify-center px-0" : "px-2.5 gap-3"
              )}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md uppercase">
                {initials}
              </div>
              {/* Info */}
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate uppercase tracking-tight">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate font-medium">
                      {displayEmail}
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-300 shrink-0 text-muted-foreground/60 group-hover:text-foreground",
                      dropdownOpen && "rotate-180"
                    )}
                  />
                </>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] rounded-2xl p-2 border-border shadow-2xl bg-white dark:bg-slate-950 isolate z-100">
              <div className="px-2 py-1.5 mb-2 sm:hidden">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hesab</p>
              </div>
              <DropdownMenuItem className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium" onClick={() => setDropdownOpen(false)}>
                <User size={16} className="text-slate-400" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium" onClick={() => {
                setDropdownOpen(false);
                toggleSettings();
              }}>
                <Settings size={16} className="text-slate-400" />
                <span>Tənzimləmələr</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2 bg-border/50" />
              
              {/* Theme Toggle - User Request */}
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all group">
                <div className="flex items-center gap-2.5 font-medium">
                  {theme === "dark" ? <Moon size={16} className="text-indigo-400" /> : <Sun size={16} className="text-amber-500" />}
                  <span className="text-sm">Tünd Rejim</span>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={toggleTheme}
                  size="sm"
                />
              </div>

              <DropdownMenuSeparator className="my-2 bg-border/50" />
              
              <SignOutButton>
                <DropdownMenuItem className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-semibold" onClick={() => setDropdownOpen(false)}>
                  <LogOut size={16} />
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
