/* eslint-disable @next/next/no-img-element */
import { LeadDrawer } from "@/components/dashboard/lead-drawer";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { FilterBar } from "@/components/tables/filter-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeads, getTips } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { formatConfidence } from "@/lib/utils";

export default async function DashboardTipsPage() {
  const [tips, leads] = await Promise.all([getTips(), getLeads()]);
  const imageTips = tips.filter((entry) => entry.imageUrl).length;
  const similarityTips = tips.filter((entry) => typeof entry.similarityScore === "number").length;
  const similarityLeads = leads.filter((entry) => typeof entry.similarityScore === "number");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
          Tip queue
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
          Review public tips and their strongest linked leads.
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Incoming tips", value: tips.length },
          { label: "Tips with photos", value: imageTips },
          { label: "Possible similarity reviews", value: similarityTips },
        ].map((entry) => (
          <Card key={entry.label}>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {entry.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white">
                {entry.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <FilterBar>
        {["Status", "Location", "Confidence", "Source"].map((label) => (
          <Select key={label}>
            <SelectTrigger>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {label.toLowerCase()}</SelectItem>
            </SelectContent>
          </Select>
        ))}
      </FilterBar>

      {similarityLeads.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Case-only image review</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {similarityLeads.slice(0, 3).map((lead) => (
              <div
                key={lead.id}
                className="rounded-lg border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-400/20 dark:bg-amber-400/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={lead.status} />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">
                    {formatConfidence(lead.similarityScore ?? 0)}
                  </p>
                </div>
                <p className="mt-3 font-medium text-zinc-950 dark:text-white">{lead.title}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                  {lead.similarityNotes}
                </p>
                <div className="mt-4">
                  <LeadDrawer lead={lead} triggerLabel="Open review" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Incoming tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="rounded-lg border border-zinc-200/70 p-4 dark:border-white/10"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={tip.status} />
                  {tip.caseName ? (
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {tip.caseName}
                    </span>
                  ) : null}
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    {formatDateTime(tip.createdAt, "MMM d, HH:mm")}
                  </p>
                </div>
                {tip.imageUrl ? (
                  <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
                    <img src={tip.imageUrl} alt={tip.description} className="h-44 w-full object-cover" />
                  </div>
                ) : null}
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {tip.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Confidence {formatConfidence(tip.confidence)}
                  </span>
                  {typeof tip.similarityScore === "number" ? (
                    <span className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 dark:bg-amber-400/15 dark:text-amber-100">
                      Possible similarity {formatConfidence(tip.similarityScore)}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="space-y-3 rounded-lg border border-zinc-200/70 p-4 dark:border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-950 dark:text-white">{lead.title}</p>
                      <StatusBadge status={lead.status} />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{lead.sourceLabel}</p>
                  </div>
                  <LeadDrawer lead={lead} />
                </div>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {lead.snippet}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-zinc-400">
                  <span>{formatDateTime(lead.occurredAt, "MMM d, HH:mm")}</span>
                  <span>{formatConfidence(lead.confidenceScore)} confidence</span>
                  {typeof lead.similarityScore === "number" ? (
                    <span>possible similarity {formatConfidence(lead.similarityScore)}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
