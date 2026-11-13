"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Send,
  PieChart,
  Megaphone,
  Activity,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);

  // If on login page, render without sidebar layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          // If staff attempts to visit restricted path, redirect to jobs
          if (
            data.user.role === "DATA_ENTRY" &&
            !pathname.startsWith("/admin/jobs")
          ) {
            router.push("/admin/jobs");
          }
        }
      })
      .catch(() => null);
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isDataEntry = currentUser?.role === "DATA_ENTRY";

  const allNavItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/analytics", icon: PieChart },
    { label: "Ingest New Job", href: "/admin/jobs/new", icon: PlusCircle, highlight: true },
    { label: "Jobs Manager", href: "/admin/jobs", icon: Briefcase },
    { label: "User Activity", href: "/admin/interactions", icon: Activity },
    { label: "Telegram Users", href: "/admin/users", icon: Users },
    { label: "Broadcast", href: "/admin/broadcast", icon: Megaphone },
    { label: "Notifications", href: "/admin/notifications", icon: Send },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const dataEntryNavItems = [
    { label: "Jobs Manager", href: "/admin/jobs", icon: Briefcase },
    { label: "Ingest New Job", href: "/admin/jobs/new", icon: PlusCircle, highlight: true },
  ];

  const visibleNavItems = isDataEntry ? dataEntryNavItems : allNavItems;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href={isDataEntry ? "/admin/jobs" : "/admin"} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-md">
              <Image
                src="/logo.png"
                alt="Signal Job"
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">Signal Admin</span>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-400">
                <ShieldCheck className="h-3 w-3" />
                <span>{isDataEntry ? "DATA ENTRY STAFF" : "ETHIOPIA"}</span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
                  item.highlight && !isActive && "text-sky-300 font-semibold bg-sky-500/5 hover:bg-sky-500/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-sky-400" : item.highlight ? "text-sky-400" : "text-slate-400")} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-sky-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Current User Session Info & Sign Out */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {currentUser && (
            <div className="flex items-center justify-between px-1 text-xs">
              <div className="flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5 text-sky-400" />
                <span className="font-medium text-slate-300">{currentUser.username}</span>
              </div>
              <Badge variant={isDataEntry ? "secondary" : "default"} className="text-[10px]">
                {currentUser.role}
              </Badge>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
