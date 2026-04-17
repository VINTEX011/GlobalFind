import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { type DemoMonitoringHit } from "@/lib/types";
import { formatConfidence } from "@/lib/utils";

export function MonitoringTable({ hits }: { hits: DemoMonitoringHit[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring queue</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.18em] text-zinc-500 dark:border-white/10">
            <tr>
              <th className="pb-4 font-semibold">Source</th>
              <th className="pb-4 font-semibold">Snippet</th>
              <th className="pb-4 font-semibold">Location</th>
              <th className="pb-4 font-semibold">Confidence</th>
              <th className="pb-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 dark:divide-white/10">
            {hits.map((hit) => (
              <tr key={hit.id}>
                <td className="py-4 pr-4 align-top">
                  <div className="space-y-1">
                    <p className="font-medium text-zinc-950 dark:text-white">{hit.sourceLabel}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {formatDateTime(hit.timestamp, "MMM d, HH:mm")}
                    </p>
                  </div>
                </td>
                <td className="max-w-lg py-4 pr-4 align-top">
                  <p className="leading-7 text-zinc-700 dark:text-zinc-300">{hit.textSnippet}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {hit.handle ? (
                      <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        {hit.handle}
                      </span>
                    ) : null}
                    <Link
                      href={hit.url}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-500 dark:text-teal-300"
                    >
                      Open source
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </td>
                <td className="py-4 pr-4 align-top text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 size-4 text-teal-500" />
                    <span>
                      {hit.location.label}
                      <br />
                      {hit.location.city}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-4 align-top font-medium text-zinc-900 dark:text-zinc-100">
                  {formatConfidence(hit.confidenceScore)}
                </td>
                <td className="py-4 align-top">
                  <StatusBadge status={hit.reviewStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
