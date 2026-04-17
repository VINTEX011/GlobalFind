import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitoringWorkbench } from "@/components/forms/monitoring-workbench";
import { MonitoringTable } from "@/components/tables/monitoring-table";
import { getCases, getMonitoringHits } from "@/lib/data";
import { MONITORING_ADAPTERS } from "@/lib/constants";

export default async function DashboardMonitoringPage() {
  const [hits, cases] = await Promise.all([getMonitoringHits(), getCases()]);
  const counts = {
    name: hits.filter((entry) => entry.matchType === "NAME").length,
    place: hits.filter((entry) => entry.matchType === "PLACE").length,
    manual: hits.filter((entry) => entry.matchType === "MANUAL_IMPORT").length,
    underReview: hits.filter((entry) => entry.reviewStatus === "UNDER_REVIEW").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
          Monitoring
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
          Public-source monitoring adapters and review queue.
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {MONITORING_ADAPTERS.map((adapter) => (
          <Card key={adapter}>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-zinc-950 dark:text-white">{adapter}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Name matches", value: counts.name },
          { label: "Place matches", value: counts.place },
          { label: "Manual imports", value: counts.manual },
          { label: "Under review", value: counts.underReview },
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

      <MonitoringWorkbench cases={cases} />

      <MonitoringTable hits={hits} />

      <Card>
        <CardHeader>
          <CardTitle>Compliance note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-8 text-zinc-600 dark:text-zinc-400">
            Monitoring results are treated as possible leads only. TraceLink does not promise direct integrations that violate platform rules or reveal identities from unrelated internet photos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
