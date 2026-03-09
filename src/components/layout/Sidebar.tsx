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
  X,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/utils/cn";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    label: "Job Board",
    href: ROUTES.jobBoard,
    icon: <Briefcase size={18} />,
  },
  {
    label: "AI Search",
    href: ROUTES.aiSearch,
    icon: <Sparkles size={18} />,
  },
  {
    label: "Employer Dashboard",
    href: ROUTES.employer,
    icon: <Building2 size={18} />,
  },
];

const settingsItems: NavItem[] = [
  {
    label: "Notifications",
    href: ROUTES.settings.notifications,
    icon: <Bell size={16} />,
  },
  {
    label: "Resume",
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

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle, settingsExpanded, toggleSettings } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isSettingsActive =
    pathname.startsWith("/settings") || settingsExpanded;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          !isOpen && "-translate-x-full"
        )}
      >
        {/* Sidebar inner */}
        <div className="flex flex-col h-full overflow-hidden bg-white border-r border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-600 text-white">
                <Briefcase size={16} />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">
                WDS Jobs
              </span>
            </div>
            <button
              onClick={toggle}
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <div className={cn(isActive ? "text-indigo-700" : "text-slate-400")}>
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
                    ? "text-indigo-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <div className={cn(isSettingsActive ? "text-indigo-700" : "text-slate-400")}>
                  <Settings size={18} />
                </div>
                <span className="flex-1 text-left">Settings</span>
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
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                          isSubActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(isSubActive ? "text-indigo-700" : "text-slate-400")}>
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
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-indigo-100 text-indigo-700">
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
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-1 rounded-lg bg-white border border-slate-200 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                  <DropdownItem
                    icon={<User size={15} />}
                    label="Profile"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <DropdownItem
                    icon={<Settings size={15} />}
                    label="Settings"
                    onClick={() => {
                      setDropdownOpen(false);
                      toggleSettings();
                    }}
                  />
                  <div className="h-px bg-slate-200 my-1 mx-2" />
                  <DropdownItem
                    icon={<LogOut size={15} />}
                    label="Log out"
                    danger
                    onClick={() => setDropdownOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
        danger
          ? "text-red-600 hover:text-red-700 hover:bg-red-50"
          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
      )}
    >
      <div className={cn(danger ? "text-red-500" : "text-slate-400")}>
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}
