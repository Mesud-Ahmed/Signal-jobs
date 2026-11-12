import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { 
  Activity, 
  Bookmark, 
  ExternalLink, 
  Sliders, 
  Clock, 
  User, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { InteractionsCleanupButton } from "./cleanup-button";
import { InteractionFilters } from "./interaction-filters";

export const dynamic = "force-dynamic";

export default async function AdminInteractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getAdminSession();
  if (!session || session.role === "DATA_ENTRY") {
    redirect("/admin/jobs");
  }

  const params = await searchParams;
  const action = (params.action as string) || "all";
  const q = (params.q as string) || "";
  const page = Math.max(1, parseInt((params.page as string) || "1", 10));
  const limit = 25;
  const skip = (page - 1) * limit;

  // Build filter query
  const where: Prisma.UserJobInteractionWhereInput = {};

  if (action !== "all") {
    where.action = action;
  }

  if (q.trim()) {
    where.OR = [
      { user: { firstName: { contains: q.trim(), mode: "insensitive" } } },
      { user: { lastName: { contains: q.trim(), mode: "insensitive" } } },
      { user: { telegramUsername: { contains: q.trim(), mode: "insensitive" } } },
      { user: { telegramId: { contains: q.trim() } } },
      { job: { title: { contains: q.trim(), mode: "insensitive" } } },
      { job: { company: { contains: q.trim(), mode: "insensitive" } } },
    ];
  }

  const [interactions, total] = await Promise.all([
    db.userJobInteraction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: true,
        job: true,
      },
    }),
    db.userJobInteraction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  // Helper to build pagination links
  const createPageUrl = (targetPage: number) => {
    const urlParams = new URLSearchParams();
    if (action !== "all") urlParams.set("action", action);
    if (q) urlParams.set("q", q);
    urlParams.set("page", String(targetPage));
    return `/admin/interactions?${urlParams.toString()}`;
  };

  const renderActionBadge = (act: string) => {
    switch (act) {
      case "JOB_APPLIED":
        return (
          <Badge variant="success" className="gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <ExternalLink className="h-3 w-3" />
            <span>View & Apply</span>
          </Badge>
        );
      case "JOB_SAVED":
        return (
          <Badge variant="warning" className="gap-1 bg-amber-500/10 text-amber-400 border-amber-500/20">
            <Bookmark className="h-3 w-3" />
            <span>Job Saved</span>
          </Badge>
        );
      case "PREFERENCES_CLICKED":
        return (
          <Badge variant="default" className="gap-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
            <Sliders className="h-3 w-3" />
            <span>Preferences</span>
          </Badge>
        );
      case "JOB_VIEWED":
        return (
          <Badge variant="secondary" className="gap-1 bg-sky-500/10 text-sky-400 border-sky-500/20">
            <Eye className="h-3 w-3" />
            <span>Job Viewed</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <span>{act}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-sky-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              User Activity Logs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live stream of Telegram subscriber interactions (job applications, saves, and preferences).
          </p>
        </div>
        <InteractionsCleanupButton />
      </div>

      {/* Filter and Search Bar */}
      <InteractionFilters />

      {/* Interactions Table Card */}
      <Card className="border-slate-800 bg-slate-900/70 overflow-hidden">
        {interactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Activity className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm font-medium">No interaction events found.</p>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Meaningful actions (View & Apply, Saves, Preferences) will appear here as subscribers engage with the bot.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event & Action</th>
                  <th className="py-3 px-4">Subscriber</th>
                  <th className="py-3 px-4">Associated Job</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {interactions.map((item) => {
                  const targetUrl = item.job?.sourceUrl || item.job?.applicationUrl;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        {renderActionBadge(item.action)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-sky-400 font-semibold shrink-0">
                            {item.user?.firstName?.[0]?.toUpperCase() || <User className="h-3.5 w-3.5" />}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {item.user ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim() || "Anonymous Subscriber" : "Unknown"}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {item.user?.telegramUsername ? `@${item.user.telegramUsername}` : `ID: ${item.user?.telegramId}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {item.job ? (
                          <div>
                            {targetUrl ? (
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 line-clamp-1"
                              >
                                <span>{item.job.title}</span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                              </a>
                            ) : (
                              <span className="font-medium text-slate-300 line-clamp-1">{item.job.title}</span>
                            )}
                            {item.job.company && (
                              <div className="text-[11px] text-slate-500">{item.job.company}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">None / General Bot Action</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/40 text-xs">
            <span className="text-slate-400">
              Showing page {page} of {totalPages} ({total} total events)
            </span>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={createPageUrl(page - 1)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-800/50 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-600 cursor-not-allowed">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </span>
              )}

              {page < totalPages ? (
                <Link
                  href={createPageUrl(page + 1)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-800 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-800/50 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-600 cursor-not-allowed">
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

