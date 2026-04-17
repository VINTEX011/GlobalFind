import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitoringTable } from "@/components/tables/monitoring-table";
import { getMonitoringHits } from "@/lib/data";
import { MONITORING_ADAPTERS } from "@/lib/constants";

export default async function DashboardMonitoringPage() {
  const hits = await getMonitoringHits();

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
