"use client";

import { AlertTriangle, Clock3, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatDateTime } from "@/lib/format";
import { type DemoLead } from "@/lib/types";
import { formatConfidence } from "@/lib/utils";

export function LeadDrawer({
  lead,
  triggerLabel = "Open detail",
}: {
  lead: DemoLead;
  triggerLabel?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={lead.status} />
            <StatusBadge status={lead.sourceLabel} />
          </div>
          <SheetTitle>{lead.title}</SheetTitle>
          <SheetDescription>{lead.snippet}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="grid gap-3 rounded-lg bg-zinc-100/80 p-4 text-sm dark:bg-white/5">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-4 text-teal-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Occurred</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {formatDateTime(lead.occurredAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-teal-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Location</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {lead.location.label}, {lead.location.city}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 text-amber-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Confidence</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {formatConfidence(lead.confidenceScore)}
                  {lead.similarityScore
                    ? ` · similarity ${formatConfidence(lead.similarityScore)}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Moderator notes
            </h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {lead.notes}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Audit log
            </h3>
            <div className="mt-4 space-y-4">
              {lead.audit.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-zinc-200/80 p-4 dark:border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-zinc-950 dark:text-white">{entry.action}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {formatDateTime(entry.at, "MMM d, HH:mm")}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {entry.details}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    {entry.actor}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button>Approve</Button>
            <Button variant="secondary">Escalate</Button>
            <Button variant="outline">Reject</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
