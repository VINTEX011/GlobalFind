import { Activity, BadgeAlert, BriefcaseBusiness, Radar } from "lucide-react";
import Link from "next/link";

import { LeadDrawer } from "@/components/dashboard/lead-drawer";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCases, getDashboardStats, getLeads, getMonitoringHits, getTips } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default async function DashboardOverviewPage() {
  const [stats, cases, tips, leads, hits] = await Promise.all([
    getDashboardStats(),
    getCases(),
    getTips(),
    getLeads(),
    getMonitoringHits(),
  ]);

  const icons = [BriefcaseBusiness, BadgeAlert, Activity, Radar];
  const activeCases = cases.filter((entry) => entry.status === "ACTIVE").length;
  const urgentLeads = leads.filter((entry) =>
    ["NEW", "UNDER_REVIEW", "ESCALATED"].includes(entry.status),
  ).length;
  const monitoringQueue = hits.filter((entry) =>
    ["NEW", "UNDER_REVIEW", "ESCALATED"].includes(entry.reviewStatus),
  ).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <Card className="overflow-hidden bg-zinc-950 text-white dark:border-white/10 dark:bg-zinc-900">
          <CardContent className="p-8 md:p-9">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                    Operational snapshot
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[2rem]">
                    Keep decisions fast, documented, and human-reviewed.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-8 text-zinc-300">
                    TraceLink is currently tracking {activeCases} active cases, with {urgentLeads} lead items
                    needing attention and {monitoringQueue} public-source hits still in review.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
                  {[
                    { label: "Active cases", value: activeCases },
                    { label: "Urgent leads", value: urgentLeads },
                    { label: "Tips today", value: tips.slice(0, 6).length },
                  ].map((entry) => (
                    <div
                      key={entry.label}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        {entry.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-white">{entry.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-white text-zinc-950 hover:bg-white/90">
                  <Link href="/dashboard/tips">Open lead queue</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white/10 text-white ring-white/15 hover:bg-white/14"
                >
                  <Link href="/dashboard/map">Review sightings map</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue pressure</CardTitle>
            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              A quick read on where moderator attention is stacking up.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Leads awaiting action",
                value: urgentLeads,
                helper: "New, under review, and escalated lead items",
              },
              {
                label: "Tips awaiting review",
                value: tips.filter((entry) => ["NEW", "UNDER_REVIEW"].includes(entry.status)).length,
                helper: "Public reports still needing triage",
              },
              {
                label: "Monitoring hits pending",
                value: monitoringQueue,
                helper: "Keyword and place matches still open",
              },
            ].map((entry) => (
              <div
                key={entry.label}
                className="rounded-lg border border-zinc-200/70 bg-zinc-50/75 p-4 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-950 dark:text-white">
                      {entry.label}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {entry.helper}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {entry.value}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = icons[index];
          return <StatCard key={stat.label} {...stat} icon={Icon} />;
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Priority leads</CardTitle>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                High-signal leads requiring moderator or family action.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/tips">Open queue</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col gap-4 rounded-lg border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[0.04] lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={lead.status} />
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {lead.sourceLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                    {lead.title}
                  </h3>
                  <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {lead.snippet}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    {formatDateTime(lead.occurredAt, "MMM d, yyyy 'at' HH:mm")}
                  </p>
                </div>
                <LeadDrawer lead={lead} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live activity</CardTitle>
            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Current operating totals across cases, tips, and public-source monitoring.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Cases in system", value: cases.length },
              { label: "Tips received", value: tips.length },
              { label: "Monitoring hits", value: hits.length },
              {
                label: "Escalated items",
                value: leads.filter((entry) => entry.status === "ESCALATED").length,
              },
            ].map((entry) => (
              <div
                key={entry.label}
                className="flex items-center justify-between rounded-lg border border-zinc-200/70 p-4 dark:border-white/10"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{entry.label}</p>
                <p className="text-lg font-semibold text-zinc-950 dark:text-white">
                  {entry.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
