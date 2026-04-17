import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/timeline/activity-timeline";
import { CaseHeader } from "@/components/cards/case-header";
import { ImageGallery } from "@/components/cards/image-gallery";
import { LeadDrawer } from "@/components/dashboard/lead-drawer";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseBundle } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default async function DashboardCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bundle = await getCaseBundle(id);

  if (!bundle) {
    notFound();
  }

  const { caseRecord, tips, leads, hits } = bundle;

  return (
    <div className="space-y-6">
      <CaseHeader caseRecord={caseRecord} showActions={false} />
      <ImageGallery images={caseRecord.images} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <ActivityTimeline updates={caseRecord.updates} />
          <Card>
            <CardHeader>
              <CardTitle>Public tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tips.slice(0, 5).map((tip) => (
                <div
                  key={tip.id}
                  className="border border-zinc-200/70 p-4 dark:border-white/10"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={tip.status} />
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {formatDateTime(tip.seenAt, "MMM d, HH:mm")}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {tip.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="space-y-3 border border-zinc-200/70 p-4 dark:border-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-950 dark:text-white">{lead.title}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {lead.sourceLabel}
                      </p>
                    </div>
                    <LeadDrawer lead={lead} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoring hits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hits.slice(0, 4).map((hit) => (
                <div
                  key={hit.id}
                  className="border border-zinc-200/70 p-4 dark:border-white/10"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={hit.reviewStatus} />
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {hit.sourceLabel}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {hit.textSnippet}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
