"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock3, LoaderCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/format";
import { type DemoLead, type LeadStatus } from "@/lib/types";
import { formatConfidence } from "@/lib/utils";

export function LeadDrawer({
  lead,
  triggerLabel = "Open detail",
}: {
  lead: DemoLead;
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [currentLead, setCurrentLead] = useState(lead);
  const [reviewNote, setReviewNote] = useState(lead.notes);
  const [submittingStatus, setSubmittingStatus] = useState<LeadStatus | null>(null);

  async function updateStatus(status: LeadStatus) {
    setSubmittingStatus(status);

    const response = await fetch(`/api/leads/${currentLead.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        note: reviewNote,
      }),
    });

    const result = await response.json();
    setSubmittingStatus(null);

    if (!response.ok) {
      toast.error("Lead update failed", {
        description: result.message ?? "Try submitting the review again.",
      });
      return;
    }

    setCurrentLead(result.lead);
    setReviewNote(result.lead.notes);
    router.refresh();
    toast.success("Lead review updated", {
      description: `Lead moved to ${status.toLowerCase().replaceAll("_", " ")}.`,
    });
  }

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
            <StatusBadge status={currentLead.status} />
            <StatusBadge status={currentLead.sourceLabel} />
          </div>
          <SheetTitle>{currentLead.title}</SheetTitle>
          <SheetDescription>{currentLead.snippet}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid gap-3 rounded-lg bg-zinc-100/80 p-4 text-sm dark:bg-white/5">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-4 text-teal-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Occurred</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {formatDateTime(currentLead.occurredAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-teal-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Location</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {currentLead.location.label}, {currentLead.location.city}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 text-amber-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Confidence</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {formatConfidence(currentLead.confidenceScore)}
                  {typeof currentLead.similarityScore === "number"
                    ? ` / possible similarity ${formatConfidence(currentLead.similarityScore)}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {currentLead.tipImageUrl || currentLead.mediaThumbnailUrl ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Review media
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {currentLead.tipImageUrl ? (
                  <div className="overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
                    <img
                      src={currentLead.tipImageUrl}
                      alt={currentLead.title}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : null}
                {currentLead.mediaThumbnailUrl ? (
                  <div className="overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
                    <img
                      src={currentLead.mediaThumbnailUrl}
                      alt={currentLead.title}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {currentLead.similarityNotes ? (
            <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-400/20 dark:bg-amber-400/10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">
                Case-only similarity review
              </h3>
              <p className="mt-3 text-sm leading-7 text-amber-900/80 dark:text-amber-100/85">
                {currentLead.similarityNotes}
              </p>
            </div>
          ) : null}

          {currentLead.url ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Source
              </h3>
              <Link
                href={currentLead.url}
                target="_blank"
                className="mt-3 inline-flex text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-300"
              >
                Open original source
              </Link>
            </div>
          ) : null}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Moderator notes
            </h3>
            <Textarea
              className="mt-3"
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
              placeholder="Record why this lead should be approved, escalated, or dismissed."
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Audit log
            </h3>
            <div className="mt-4 space-y-4">
              {currentLead.audit.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-zinc-200/80 p-4 dark:border-white/10"
                >
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
            <Button
              disabled={Boolean(submittingStatus)}
              onClick={() => updateStatus("APPROVED")}
            >
              {submittingStatus === "APPROVED" ? <LoaderCircle className="animate-spin" /> : null}
              Approve
            </Button>
            <Button
              variant="secondary"
              disabled={Boolean(submittingStatus)}
              onClick={() => updateStatus("ESCALATED")}
            >
              {submittingStatus === "ESCALATED" ? <LoaderCircle className="animate-spin" /> : null}
              Escalate
            </Button>
            <Button
              variant="outline"
              disabled={Boolean(submittingStatus)}
              onClick={() => updateStatus("REJECTED")}
            >
              {submittingStatus === "REJECTED" ? <LoaderCircle className="animate-spin" /> : null}
              Reject
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
