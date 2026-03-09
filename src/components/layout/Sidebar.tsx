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
  MenuSquare
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

// Mock user for demo
const MOCK_USER = {
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@gmail.com",
};

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();
  const { settingsExpanded, toggleSettings } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isSettingsActive =
    pathname.startsWith("/settings") || settingsExpanded;

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-900 text-white">
            <MenuSquare size={16} />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            WDS Jobs
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <div className={cn(isActive ? "text-slate-900" : "text-slate-400")}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Settings group */}
        <div className="mt-2">
          <button
            onClick={toggleSettings}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isSettingsActive
                ? "text-slate-900"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <div className={cn(isSettingsActive ? "text-slate-900" : "text-slate-400")}>
              <Settings size={18} />
            </div>
            <span className="flex-1 text-left">Tənzimləmələr</span>
            <ChevronRight
              size={14}
              className={cn(
                "transition-transform duration-200 text-slate-400",
                settingsExpanded && "rotate-90"
              )}
            />
          </button>

          {/* Settings sub-items */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              settingsExpanded ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="mt-1 ml-5 pl-4 flex flex-col gap-1 border-l border-slate-200">
              {settingsItems.map((item) => {
                const isSubActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onNavigate?.()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isSubActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(isSubActive ? "text-slate-900" : "text-slate-400")}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-slate-200">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors group outline-none">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-slate-900 text-white">
              {MOCK_USER.firstName[0]}
              {MOCK_USER.lastName[0]}
            </div>
            {/* Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {MOCK_USER.firstName} {MOCK_USER.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {MOCK_USER.email}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200 shrink-0 text-slate-400",
                dropdownOpen && "rotate-180"
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[230px]">
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setDropdownOpen(false)}>
              <User size={15} className="text-slate-500" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => {
              setDropdownOpen(false);
              toggleSettings();
            }}>
              <Settings size={15} className="text-slate-500" />
              <span>Tənzimləmələr</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => setDropdownOpen(false)}>
              <LogOut size={15} />
              <span>Çıxış</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
