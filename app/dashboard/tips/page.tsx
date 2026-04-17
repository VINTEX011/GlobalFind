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

export default async function DashboardTipsPage() {
  const [tips, leads] = await Promise.all([getTips(), getLeads()]);

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

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Incoming tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="border border-zinc-200/70 p-4 dark:border-white/10"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={tip.status} />
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    {formatDateTime(tip.createdAt, "MMM d, HH:mm")}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {tip.description}
                </p>
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
                className="space-y-3 border border-zinc-200/70 p-4 dark:border-white/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-zinc-950 dark:text-white">{lead.title}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{lead.sourceLabel}</p>
                  </div>
                  <LeadDrawer lead={lead} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
