import { notFound } from "next/navigation";
import { MapPin, Phone, ScanSearch, Shirt, Sparkles } from "lucide-react";

import { PublicHeader } from "@/components/app-shell/public-header";
import { CaseHeader } from "@/components/cards/case-header";
import { ImageGallery } from "@/components/cards/image-gallery";
import { MapPanel } from "@/components/map/map-panel";
import { ActivityTimeline } from "@/components/timeline/activity-timeline";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseBundle } from "@/lib/data";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await getCaseBundle(slug);

  if (!bundle) {
    notFound();
  }

  const { caseRecord, leads, hits } = bundle;
  const markers = [...leads, ...hits].slice(0, 8).map((entry) => ({
    id: entry.id,
    title: "title" in entry ? entry.title : entry.textSnippet,
    latitude: entry.location.latitude,
    longitude: entry.location.longitude,
    status: "status" in entry ? entry.status : entry.reviewStatus,
    source: entry.sourceLabel,
    occurredAt: "occurredAt" in entry ? entry.occurredAt : entry.timestamp,
  }));

  return (
    <main>
      <PublicHeader />
      <section className="section-shell space-y-10 px-4 py-16 md:py-18">
        <CaseHeader caseRecord={caseRecord} />
        <ImageGallery images={caseRecord.images} />

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b border-zinc-200/70 dark:border-white/10">
                <CardTitle>Reported context</CardTitle>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  Family-provided details from the original case file and verified updates.
                </p>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <ScanSearch className="size-4 text-teal-500" />
                    Physical description
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {caseRecord.physicalDescription}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <Shirt className="size-4 text-teal-500" />
                    Clothing description
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {caseRecord.clothingDescription}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <MapPin className="size-4 text-teal-500" />
                    Last seen location
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {caseRecord.lastSeenLocation.label}, {caseRecord.lastSeenLocation.address},{" "}
                    {caseRecord.city}, {caseRecord.country}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <Phone className="size-4 text-teal-500" />
                    Emergency contact
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {caseRecord.emergencyContact}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200/70 bg-zinc-50/75 p-5 dark:border-white/10 dark:bg-white/[0.04] md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <Sparkles className="size-4 text-teal-500" />
                    Distinguishing features
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {caseRecord.distinguishingFeatures}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ActivityTimeline updates={caseRecord.updates} />
          </div>

          <div className="space-y-6">
            <MapPanel markers={markers} />

            <Card>
              <CardHeader>
                <CardTitle>Case context</CardTitle>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  Fast reference counts for current public activity around this case.
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Open leads", value: leads.length },
                  { label: "Monitoring hits", value: hits.length },
                  { label: "Timeline updates", value: caseRecord.updates.length },
                  { label: "Privacy level", value: caseRecord.privacyLevel },
                ].map((entry) => (
                  <div
                    key={entry.label}
                    className="rounded-lg border border-zinc-200/70 bg-zinc-50/75 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {entry.label}
                    </p>
                    <p className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">
                      {entry.value}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keywords in monitoring</CardTitle>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  Search terms currently used for lawful public-source monitoring on this case.
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {caseRecord.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700 dark:bg-white/[0.05] dark:text-zinc-300"
                  >
                    {keyword}
                  </span>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
