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
  Menu,
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

// Mock user for demo (replace with Clerk useUser())
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: "var(--sidebar-width)" }}
        className={cn(
          "fixed top-0 left-0 h-full z-50 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          !isOpen && "-translate-x-full"
        )}
      >
        {/* Sidebar inner */}
        <div
          className="flex flex-col h-full overflow-hidden"
          style={{
            background: "hsl(222 44% 8%)",
            borderRight: "1px solid hsl(var(--border-subtle))",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-4"
            style={{ borderBottom: "1px solid hsl(var(--border-subtle))" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                }}
              >
                <Briefcase size={16} color="white" />
              </div>
              <span
                className="font-bold text-base tracking-tight gradient-text"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                WDS Jobs
              </span>
            </div>
            <button
              onClick={toggle}
              className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
              style={{ color: "hsl(var(--foreground-subtle))" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--foreground))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "hsl(var(--foreground-subtle))")
              }
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  pathname === item.href && "active"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Settings group */}
            <div className="mt-2">
              <button
                onClick={toggleSettings}
                className={cn(
                  "sidebar-item w-full",
                  isSettingsActive && "active"
                )}
              >
                <Settings size={18} />
                <span className="flex-1 text-left">Settings</span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    settingsExpanded && "rotate-90"
                  )}
                />
              </button>

              {/* Settings sub-items */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  settingsExpanded ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="mt-1 ml-4 pl-3 flex flex-col gap-0.5 border-l"
                  style={{ borderColor: "hsl(var(--border-subtle))" }}>
                  {settingsItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "sidebar-item text-sm",
                        pathname === item.href && "active"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* User section */}
          <div
            className="px-3 py-3"
            style={{ borderTop: "1px solid hsl(var(--border-subtle))" }}
          >
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group"
                style={{ background: "hsl(var(--surface-2))" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "hsl(var(--surface-3))")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "hsl(var(--surface-2))")
                }
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                    color: "white",
                  }}
                >
                  {MOCK_USER.firstName[0]}
                  {MOCK_USER.lastName[0]}
                </div>
                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {MOCK_USER.firstName} {MOCK_USER.lastName}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "hsl(var(--foreground-subtle))" }}
                  >
                    {MOCK_USER.email}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200 flex-shrink-0",
                    dropdownOpen ? "rotate-180" : ""
                  )}
                  style={{ color: "hsl(var(--foreground-subtle))" }}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  className="absolute bottom-full left-0 right-0 mb-2 rounded-lg overflow-hidden shadow-2xl animate-fade-in"
                  style={{
                    background: "hsl(222 44% 10%)",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
                  }}
                >
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
                  <div
                    style={{
                      borderTop: "1px solid hsl(var(--border-subtle))",
                    }}
                  />
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
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
      style={{
        color: danger
          ? "hsl(var(--danger))"
          : "hsl(var(--foreground-muted))",
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "hsl(var(--surface-2))";
        e.currentTarget.style.color = danger
          ? "hsl(var(--danger))"
          : "hsl(var(--foreground))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = danger
          ? "hsl(var(--danger))"
          : "hsl(var(--foreground-muted))";
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
