"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  Sparkles,
  Building2,
  Bell,
  FileText,
  ChevronDown,
  Settings,
  LogOut,
  ChevronRight,
  MenuSquare,
  Users,
  CreditCard,
  ArrowLeftRight,
  User,
  Moon,
  Sun,
  Layers,
  Wand2,
} from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/utils/cn";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useUser, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
import { X } from "lucide-react";

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
    label: "AI Axtarış",
    href: ROUTES.aiSearch,
    icon: <Sparkles size={18} />,
  },
  {
    label: "AI CV Generator",
    href: ROUTES.cvGenerator,
    icon: <Wand2 size={18} />,
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
  onToggle,
}: SidebarProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { settingsExpanded, toggleSettings } = useSidebar();
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const response = await fetch(`${API_BASE}/api/jobs/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  // Check if any category is active
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isCategoriesActive = searchParams?.get('category') ? true : categoriesExpanded;

  const isSettingsActive = pathname.startsWith("/settings") || settingsExpanded;

  // Determine if this is an employer account via Clerk publicMetadata OR specific email
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isEmployer = user?.publicMetadata?.role === "employer" || userEmail === "msadigli2025@gmail.com";

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

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-background border-r border-border shadow-sm/5">
      {/* Header */}
      <div className="flex items-center h-[65px] px-4 border-b border-border bg-background">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg transition-all">
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
              <div
                className={cn(
                  "shrink-0 transition-colors",
                  isActive
                    ? "text-inherit"
                    : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                )}
              >
                {item.icon}
              </div>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Categories group */}
        <div className="mt-4">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400/80">
              Kategoriyalar
            </div>
          )}
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className={cn(
              "w-full flex items-center rounded-xl text-sm font-medium transition-all h-10 group",
              isCollapsed ? "justify-center px-0" : "px-3 gap-3",
              isCategoriesActive
                ? "text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
            )}
          >
            <div
              className={cn(
                "shrink-0 transition-colors",
                isCategoriesActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
              )}
            >
              <Layers size={18} />
            </div>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left truncate font-medium">
                  Bütün Kategoriyalar
                </span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-transform duration-300 text-slate-400",
                    categoriesExpanded && "rotate-90"
                  )}
                />
              </>
            )}
          </button>

          {!isCollapsed && (
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                categoriesExpanded
                  ? "max-h-[300px] opacity-100 mt-1"
                  : "max-h-0 opacity-0"
              )}
            >
              <div className="ml-5 pl-4 flex flex-col gap-1 border-l border-border/60">
                {categories.length === 0 ? (
                  // Category skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 animate-pulse">
                      <div className="w-5 h-5 rounded-md bg-muted/30" />
                      <div className="w-24 h-3 rounded-md bg-muted/20" />
                    </div>
                  ))
                ) : (
                  categories.map((cat) => {
                    const isActive = searchParams?.get('category') === cat.slug;
                    
                    return (
                      <Link
                        key={cat.id}
                        href={`/?category=${cat.slug}`}
                        onClick={() => onNavigate?.()}
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-truncate",
                          isActive
                            ? "text-slate-900 dark:text-white bg-slate-100/50 dark:bg-slate-900/50"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30"
                        )}
                      >
                        <div
                          className={cn(
                            "shrink-0",
                            isActive
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-400"
                          )}
                        >
                          <Layers size={14} />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

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
            <div
              className={cn(
                "shrink-0 transition-colors",
                isSettingsActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
              )}
            >
              <Settings size={18} />
            </div>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left truncate font-medium">
                  Tənzimləmələr
                </span>
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

          {!isCollapsed && (
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                settingsExpanded
                  ? "max-h-[200px] opacity-100 mt-1"
                  : "max-h-0 opacity-0"
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
                      <div
                        className={cn(
                          "shrink-0",
                          isSubActive
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-400"
                        )}
                      >
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
                "w-full flex items-center rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all group outline-none h-14 border border-transparent hover:border-border cursor-pointer",
                isCollapsed ? "justify-center px-0" : "px-2.5 gap-3"
              )}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md uppercase">
                {initials}
              </div>
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

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[260px] rounded-2xl p-2 border-border shadow-2xl bg-white dark:bg-slate-950 isolate z-100"
            >
              {/* Header: avatar + name/email */}
              <div className="flex items-center gap-3 px-3 py-3 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 uppercase shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-foreground truncate uppercase tracking-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator className="my-1 bg-border/50" />

              {isEmployer ? (
                /* ── EMPLOYER MENU ── */
                <>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium text-sm"
                    onClick={() => handleNavigate(ROUTES.employer.root)}
                  >
                    <Building2 size={16} className="text-slate-400 shrink-0" />
                    <span>Təşkilatı İdarə Et</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium text-sm"
                    onClick={() => handleNavigate(ROUTES.settings.notifications)}
                  >
                    <Users size={16} className="text-slate-400 shrink-0" />
                    <span>İstifadəçi Parametrləri</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium text-sm"
                    onClick={() => handleNavigate("/upgrade")}
                  >
                    <CreditCard size={16} className="text-slate-400 shrink-0" />
                    <span>Planı Dəyiş</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium text-sm"
                    onClick={() => {
                      setDropdownOpen(false);
                      setOrgSwitcherOpen(true);
                    }}
                  >
                    <ArrowLeftRight size={16} className="text-slate-400 shrink-0" />
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
                </>
              ) : (
                /* ── REGULAR USER MENU ── */
                <>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium text-sm"
                    onClick={() => handleNavigate(ROUTES.settings.profile)}
                  >
                    <User size={16} className="text-slate-400 shrink-0" />
                    <span>Profil</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-border/50" />

                  <DropdownMenuItem
                    className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium text-sm"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleNavigate(ROUTES.settings.notifications); 
                    }}
                  >
                    <Settings size={16} className="text-slate-400 shrink-0" />
                    <span>Tənzimləmələr</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-border/50" />

                  {/* Theme toggle */}
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      {theme === "dark" ? (
                        <Moon size={16} className="text-indigo-400" />
                      ) : (
                        <Sun size={16} className="text-amber-500" />
                      )}
                      <span>Tünd Rejim</span>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                      size="sm"
                    />
                  </div>

                  <DropdownMenuSeparator className="my-1 bg-border/50" />

                  <SignOutButton>
                    <DropdownMenuItem
                      className="cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-semibold text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LogOut size={16} className="shrink-0 text-red-600" />
                      <span>Çıxış</span>
                    </DropdownMenuItem>
                  </SignOutButton>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
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
    </div>
  );
}
