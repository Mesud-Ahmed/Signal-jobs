import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  TrendingUp, 
  PlusCircle, 
  Globe, 
  Briefcase, 
  Layers, 
  Users, 
  Activity, 
  ExternalLink,
  Sparkles,
  BarChart3,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPERIENCE_LEVELS, ETHIOPIAN_LOCATIONS, normalizeCategoryId, formatTaxonomyItemLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export type JobSourceId = "elelana" | "effoy" | "negari" | "ethiojobs" | "other";

interface SourceMeta {
  id: JobSourceId;
  name: string;
  shortName: string;
  url: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
}

export const SOURCES: Record<JobSourceId, SourceMeta> = {
  elelana: {
    id: "elelana",
    name: "Elelana Jobs",
    shortName: "Elelana",
    url: "https://elelanajobs.com",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    barColor: "bg-emerald-500",
  },
  effoy: {
    id: "effoy",
    name: "Effoy Jobs / Sira",
    shortName: "Effoy",
    url: "https://t.me/effoyjobs/",
    badgeBg: "bg-sky-500/10",
    badgeText: "text-sky-400",
    badgeBorder: "border-sky-500/30",
    barColor: "bg-sky-500",
  },
  negari: {
    id: "negari",
    name: "Information Negari",
    shortName: "Negari",
    url: "https://t.me/informationnegari/",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    badgeBorder: "border-purple-500/30",
    barColor: "bg-purple-500",
  },
  ethiojobs: {
    id: "ethiojobs",
    name: "Ethiojobs Bot",
    shortName: "Ethiojobs",
    url: "http://t.me/ethiojobs_netbot",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/30",
    barColor: "bg-amber-500",
  },
  other: {
    id: "other",
    name: "Other / Direct",
    shortName: "Other",
    url: "",
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-400",
    badgeBorder: "border-slate-500/30",
    barColor: "bg-slate-500",
  },
};

export function classifyJobSource(
  sourceUrl?: string | null,
  applicationUrl?: string | null,
  sourceName?: string | null
): JobSourceId {
  const combined = `${sourceUrl || ""} ${applicationUrl || ""} ${sourceName || ""}`.toLowerCase();

  if (combined.includes("elelana")) return "elelana";
  if (combined.includes("effoy")) return "effoy";
  if (combined.includes("informationnegari") || combined.includes("negari")) return "negari";
  if (combined.includes("ethiojobs")) return "ethiojobs";
  return "other";
}

export default async function AnalyticsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const isAdmin = session.role === "ADMIN";

  // Ethiopian Local Timezone (UTC+3)
  const timeZone = "Africa/Addis_Ababa";
  const now = new Date();

  // Helper to extract calendar date parts in Ethiopian local time
  const getEthiopiaDateParts = (d: Date) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    }).formatToParts(d);

    const year = parts.find((p) => p.type === "year")?.value || "";
    const month = parts.find((p) => p.type === "month")?.value || "";
    const day = parts.find((p) => p.type === "day")?.value || "";
    const weekday = parts.find((p) => p.type === "weekday")?.value || "";

    return {
      key: `${year}-${month}-${day}`,
      weekday,
      month,
      day,
      year,
    };
  };

  // Build the 14 calendar days array from Day 0 (today) back to Day 13
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days: {
    dateKey: string;
    label: string;
    shortLabel: string;
    isToday: boolean;
    isYesterday: boolean;
    counts: Record<JobSourceId, number>;
    total: number;
  }[] = [];

  for (let i = 0; i < 14; i++) {
    const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const parts = getEthiopiaDateParts(targetDate);
    const isToday = i === 0;
    const isYesterday = i === 1;

    const monthNum = parseInt(parts.month, 10);
    const monthName = monthNames[monthNum - 1] || parts.month;
    const formattedDate = `${parts.weekday}, ${monthName} ${parseInt(parts.day, 10)}`;
    const shortLabel = `${monthName} ${parseInt(parts.day, 10)}`;

    let label = formattedDate;
    if (isToday) label = `Today (${formattedDate})`;
    else if (isYesterday) label = `Yesterday (${formattedDate})`;

    days.push({
      dateKey: parts.key,
      label,
      shortLabel,
      isToday,
      isYesterday,
      counts: {
        elelana: 0,
        effoy: 0,
        negari: 0,
        ethiojobs: 0,
        other: 0,
      },
      total: 0,
    });
  }

  const dayMap = new Map(days.map((d) => [d.dateKey, d]));
  const todayKey = days[0].dateKey;
  const yesterdayKey = days[1]?.dateKey;
  const last7DaysKeys = new Set(days.slice(0, 7).map((d) => d.dateKey));

  // 14 days ago cutoff timestamp
  const cutoffDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

  // Resilient DB fetch for past 14 days jobs
  let recentJobs: Array<{
    id: string;
    createdAt: Date;
    sourceUrl: string | null;
    applicationUrl: string | null;
    sourceName: string | null;
  }> = [];

  let totalJobsAllTime = 0;

  try {
    const [jobs, totalCount] = await Promise.all([
      db.job.findMany({
        where: {
          createdAt: { gte: cutoffDate },
        },
        select: {
          id: true,
          createdAt: true,
          sourceUrl: true,
          applicationUrl: true,
          sourceName: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.job.count(),
    ]);
    recentJobs = jobs;
    totalJobsAllTime = totalCount;
  } catch (err) {
    console.warn("[Analytics] Handled query error:", err);
  }

  // Aggregators
  const todaySources: Record<JobSourceId, number> = { elelana: 0, effoy: 0, negari: 0, ethiojobs: 0, other: 0 };
  const yesterdaySources: Record<JobSourceId, number> = { elelana: 0, effoy: 0, negari: 0, ethiojobs: 0, other: 0 };
  const last7Sources: Record<JobSourceId, number> = { elelana: 0, effoy: 0, negari: 0, ethiojobs: 0, other: 0 };
  const last14Sources: Record<JobSourceId, number> = { elelana: 0, effoy: 0, negari: 0, ethiojobs: 0, other: 0 };

  let todayTotal = 0;
  let yesterdayTotal = 0;
  let last7Total = 0;
  let last14Total = 0;

  for (const job of recentJobs) {
    const jobDateParts = getEthiopiaDateParts(new Date(job.createdAt));
    const source = classifyJobSource(job.sourceUrl, job.applicationUrl, job.sourceName);

    const dayRow = dayMap.get(jobDateParts.key);
    if (dayRow) {
      dayRow.counts[source]++;
      dayRow.total++;
      last14Sources[source]++;
      last14Total++;
    }

    if (jobDateParts.key === todayKey) {
      todaySources[source]++;
      todayTotal++;
    }

    if (jobDateParts.key === yesterdayKey) {
      yesterdaySources[source]++;
      yesterdayTotal++;
    }

    if (last7DaysKeys.has(jobDateParts.key)) {
      last7Sources[source]++;
      last7Total++;
    }
  }

  // Admin secondary metrics (loaded only if ADMIN)
  let adminMetrics = null;
  if (isAdmin) {
    try {
      const [totalUsers, activeUsers, interactionsCount, notificationsSent] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { isActive: true, notificationsPaused: false } }),
        db.userJobInteraction.count(),
        db.notification.count({ where: { status: "SENT" } }),
      ]);
      adminMetrics = { totalUsers, activeUsers, interactionsCount, notificationsSent };
    } catch {
      adminMetrics = null;
    }
  }

  const sourceKeys: JobSourceId[] = ["elelana", "effoy", "negari", "ethiojobs", "other"];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-6 w-6 text-sky-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Job Ingestion Analytics
            </h1>
            <Badge variant="outline" className="text-sky-400 border-sky-500/30 bg-sky-500/10 text-xs">
              Past 14 Days
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            Real-time posting volume and channel source breakdown across Ethiopian recruitment feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/jobs/new">
            <Button variant="primary" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Ingest New Job</span>
            </Button>
          </Link>
          <Link href="/admin/jobs">
            <Button variant="outline" size="sm" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Jobs Directory</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Card */}
        <Card className="border-slate-800 bg-slate-900/70 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Posted Today
              </CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{todayTotal}</span>
              <span className="text-xs text-slate-400">jobs</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              {sourceKeys.map((key) => {
                const count = todaySources[key];
                if (count === 0 && todayTotal > 0) return null;
                const meta = SOURCES[key];
                return (
                  <span
                    key={key}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded font-medium border",
                      meta.badgeBg,
                      meta.badgeText,
                      meta.badgeBorder
                    )}
                  >
                    {meta.shortName}: {count}
                  </span>
                );
              })}
              {todayTotal === 0 && (
                <span className="text-xs text-slate-500 italic">No postings yet today</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Yesterday Card */}
        <Card className="border-slate-800 bg-slate-900/70 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Posted Yesterday
              </CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{yesterdayTotal}</span>
              <span className="text-xs text-slate-400">jobs</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              {sourceKeys.map((key) => {
                const count = yesterdaySources[key];
                if (count === 0 && yesterdayTotal > 0) return null;
                const meta = SOURCES[key];
                return (
                  <span
                    key={key}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded font-medium border",
                      meta.badgeBg,
                      meta.badgeText,
                      meta.badgeBorder
                    )}
                  >
                    {meta.shortName}: {count}
                  </span>
                );
              })}
              {yesterdayTotal === 0 && (
                <span className="text-xs text-slate-500 italic">No postings yesterday</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Last 7 Days Card */}
        <Card className="border-slate-800 bg-slate-900/70 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last 7 Days
              </CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{last7Total}</span>
              <span className="text-xs text-slate-400">
                (~{(last7Total / 7).toFixed(1)}/day)
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              {sourceKeys.map((key) => {
                const count = last7Sources[key];
                if (count === 0) return null;
                const meta = SOURCES[key];
                return (
                  <span
                    key={key}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded font-medium border",
                      meta.badgeBg,
                      meta.badgeText,
                      meta.badgeBorder
                    )}
                  >
                    {meta.shortName}: {count}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 14-Day Ingestion Card */}
        <Card className="border-slate-800 bg-slate-900/70 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Past 14 Days Total
              </CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Layers className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{last14Total}</span>
              <span className="text-xs text-slate-400">
                of {totalJobsAllTime} all-time
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Coverage</span>
              <span className="text-purple-400 font-medium">4 Key Feeds Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 Main Sources Channel Breakdown Panel */}
      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader className="pb-4 border-b border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-sky-400" />
                <span>Source Channel Share (Past 14 Days)</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Distribution of scraped and submitted vacancies grouped across our monitored platforms.
              </CardDescription>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Total Ingested: <strong className="text-white">{last14Total}</strong> jobs
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {sourceKeys.map((key) => {
              const meta = SOURCES[key];
              const count = last14Sources[key];
              const pct = last14Total > 0 ? Math.round((count / last14Total) * 100) : 0;

              return (
                <div
                  key={key}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {meta.name}
                    </span>
                    {meta.url && (
                      <a
                        href={meta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-sky-400 transition-colors"
                        title={meta.url}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-white">{count}</span>
                    <span className="text-xs font-semibold text-slate-400">{pct}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", meta.barColor)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 14-Day Daily Breakdown Table */}
      <Card className="border-slate-800 bg-slate-900/70 overflow-hidden">
        <CardHeader className="border-b border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sky-400" />
                <span>Daily Ingestion Breakdown (Past 14 Days)</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Daily job posting counts categorized by source feed in Ethiopian local time.
              </CardDescription>
            </div>
            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">14 consecutive days</strong>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4 min-w-[160px]">Date</th>
                  <th className="py-3 px-3 text-center">
                    <span className="text-emerald-400">Elelana Jobs</span>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <span className="text-sky-400">Effoy Jobs / Sira</span>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <span className="text-purple-400">Information Negari</span>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <span className="text-amber-400">Ethiojobs Bot</span>
                  </th>
                  <th className="py-3 px-3 text-center text-slate-400">Other / Direct</th>
                  <th className="py-3 px-4 text-right text-white">Daily Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {days.map((day) => {
                  return (
                    <tr
                      key={day.dateKey}
                      className={cn(
                        "transition-colors",
                        day.isToday
                          ? "bg-sky-500/[0.08] font-semibold text-white border-l-2 border-l-sky-400"
                          : day.isYesterday
                          ? "bg-slate-800/30 text-slate-200"
                          : "hover:bg-slate-800/30 text-slate-300"
                      )}
                    >
                      <td className="py-3 px-4 font-sans font-medium flex items-center gap-2">
                        <span>{day.label}</span>
                        {day.isToday && (
                          <Badge variant="default" className="text-[9px] py-0 px-1.5 font-normal">
                            Today
                          </Badge>
                        )}
                        {day.isYesterday && (
                          <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-normal">
                            Yesterday
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(day.counts.elelana > 0 ? "text-emerald-400 font-bold" : "text-slate-600")}>
                          {day.counts.elelana}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(day.counts.effoy > 0 ? "text-sky-400 font-bold" : "text-slate-600")}>
                          {day.counts.effoy}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(day.counts.negari > 0 ? "text-purple-400 font-bold" : "text-slate-600")}>
                          {day.counts.negari}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(day.counts.ethiojobs > 0 ? "text-amber-400 font-bold" : "text-slate-600")}>
                          {day.counts.ethiojobs}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(day.counts.other > 0 ? "text-slate-300 font-bold" : "text-slate-600")}>
                          {day.counts.other}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded text-xs font-bold",
                            day.total > 0
                              ? day.isToday
                                ? "bg-sky-500 text-slate-950"
                                : "bg-slate-800 text-white border border-slate-700"
                              : "text-slate-600"
                          )}
                        >
                          {day.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-950 border-t-2 border-slate-800 font-semibold font-mono text-xs">
                <tr>
                  <td className="py-3.5 px-4 font-sans text-white uppercase tracking-wider">
                    14-Day Totals
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-bold">
                    {last14Sources.elelana}
                  </td>
                  <td className="py-3.5 px-3 text-center text-sky-400 font-bold">
                    {last14Sources.effoy}
                  </td>
                  <td className="py-3.5 px-3 text-center text-purple-400 font-bold">
                    {last14Sources.negari}
                  </td>
                  <td className="py-3.5 px-3 text-center text-amber-400 font-bold">
                    {last14Sources.ethiojobs}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-bold">
                    {last14Sources.other}
                  </td>
                  <td className="py-3.5 px-4 text-right text-white font-extrabold text-sm">
                    {last14Total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Admin-only Subscriber & Interaction Metrics */}
      {isAdmin && adminMetrics && (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-400" />
              <span>Audience & Bot Delivery Highlights (Admin View Only)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase block">Telegram Users</span>
              <span className="text-xl font-bold text-white">{adminMetrics.totalUsers.toLocaleString()}</span>
            </div>
            <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase block">Active Subscribers</span>
              <span className="text-xl font-bold text-sky-400">{adminMetrics.activeUsers.toLocaleString()}</span>
            </div>
            <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase block">Alerts Dispatched</span>
              <span className="text-xl font-bold text-emerald-400">{adminMetrics.notificationsSent.toLocaleString()}</span>
            </div>
            <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase block">Bot Interactions</span>
              <span className="text-xl font-bold text-purple-400">{adminMetrics.interactionsCount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
