import { AlertTriangle, Clock3, MapPin, Phone, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { type DemoCase } from "@/lib/types";

export function CaseHeader({
  caseRecord,
  showActions = true,
}: {
  caseRecord: DemoCase;
  showActions?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className={showActions ? "grid xl:grid-cols-[1.15fr_0.85fr]" : ""}>
          <div className="p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">
              {showActions ? "Public case file" : "Case profile"}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StatusBadge status={caseRecord.status} />
              <StatusBadge status={caseRecord.privacyLevel} />
            </div>

            <div className="mt-5 space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {caseRecord.fullName}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                {caseRecord.nickname ? (
                  <span className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                    Alias: {caseRecord.nickname}
                  </span>
                ) : null}
                <span className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                  {caseRecord.age} years old
                </span>
                <span className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                  {caseRecord.gender}
                </span>
                <span className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                  {caseRecord.county}, {caseRecord.country}
                </span>
              </div>
              <p className="max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
                {caseRecord.summary}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-100/80 p-4 dark:bg-white/[0.05]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <Clock3 className="size-4 text-teal-500" />
                  Last seen
                </div>
                <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {formatDateTime(caseRecord.lastSeenAt)}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-100/80 p-4 dark:bg-white/[0.05]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <MapPin className="size-4 text-teal-500" />
                  Location
                </div>
                <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {caseRecord.lastSeenLocation.label}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-100/80 p-4 dark:bg-white/[0.05]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <ShieldCheck className="size-4 text-teal-500" />
                  Police reference
                </div>
                <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {caseRecord.policeReference ?? "Pending"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Distinguishing features
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {caseRecord.distinguishingFeatures}
              </p>
            </div>
          </div>

          {showActions ? (
            <div className="border-t border-zinc-200/80 bg-zinc-950 p-8 text-white dark:border-white/10 xl:border-l xl:border-t-0">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                    Public response
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    Share credible sightings. Every lead is reviewed by a person.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    TraceLink accepts tips, location details, and supporting photos, then routes them through moderator review before families see them as actionable leads.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <AlertTriangle className="size-4 text-amber-300" />
                    Possible similarity only
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Image similarity is shown only as a possible lead within this case. It never confirms identity and always requires moderator review.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Phone className="size-4 text-teal-200" />
                    Family contact
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Emergency contact: {caseRecord.emergencyContact}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button asChild className="bg-white text-zinc-950 hover:bg-white/90">
                    <a href={`/submit-tip?caseId=${caseRecord.id}`}>Submit a tip</a>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="bg-white/10 text-white ring-white/15 hover:bg-white/14"
                  >
                    <a href={`/print/cases/${caseRecord.slug}`}>Printable poster</a>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
