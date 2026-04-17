"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, Radar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type DemoCase } from "@/lib/types";

export function MonitoringWorkbench({ cases }: { cases: DemoCase[] }) {
  const [refreshCaseId, setRefreshCaseId] = useState(cases[0]?.id ?? "");
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    caseId: cases[0]?.id ?? "",
    source: "WEB",
    matchType: "MANUAL_IMPORT",
    query: "",
    textSnippet: "",
    handle: "",
    url: "https://",
    location: "",
    confidenceScore: "0.68",
    mediaThumbnailUrl: "",
  });

  const selectedCase = useMemo(
    () => cases.find((entry) => entry.id === refreshCaseId) ?? cases[0],
    [cases, refreshCaseId],
  );

  const watchTerms = useMemo(() => {
    if (!selectedCase) return [];

    return [
      selectedCase.fullName,
      selectedCase.nickname,
      selectedCase.city,
      selectedCase.county,
      ...selectedCase.keywords.slice(0, 4),
    ].filter(Boolean) as string[];
  }, [selectedCase]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <CardHeader>
          <CardTitle>Watchlist refresh</CardTitle>
          <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Generate fresh monitoring hits from the case name, alias, places, and existing watch terms.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Case</Label>
            <Select value={refreshCaseId} onValueChange={setRefreshCaseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a case" />
              </SelectTrigger>
              <SelectContent>
                {cases.map((caseRecord) => (
                  <SelectItem key={caseRecord.id} value={caseRecord.id}>
                    {caseRecord.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Active watch terms
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {watchTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-lg bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm dark:bg-white/[0.06] dark:text-zinc-300"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>

          <Button
            className="w-full justify-between"
            disabled={!refreshCaseId || refreshing}
            onClick={async () => {
              setRefreshing(true);
              const response = await fetch("/api/monitoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode: "refresh", caseId: refreshCaseId }),
              });
              const result = await response.json();
              setRefreshing(false);

              if (!response.ok) {
                toast.error("Monitoring refresh failed", {
                  description: result.message ?? "Try again in a moment.",
                });
                return;
              }

              toast.success("Watchlist refresh complete", {
                description: `${result.created} monitoring hits were added to the queue.`,
              });
              window.location.reload();
            }}
          >
            Run watchlist refresh
            {refreshing ? <LoaderCircle className="animate-spin" /> : <Radar />}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual source import</CardTitle>
          <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Add an observed post, article, or public-source clue with the exact text, URL, and matching term.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Case</Label>
              <Select
                value={form.caseId}
                onValueChange={(value) => setForm((current) => ({ ...current, caseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map((caseRecord) => (
                    <SelectItem key={caseRecord.id} value={caseRecord.id}>
                      {caseRecord.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(value) => setForm((current) => ({ ...current, source: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  {["WEB", "X", "INSTAGRAM", "FACEBOOK", "MANUAL"].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Match type</Label>
              <Select
                value={form.matchType}
                onValueChange={(value) => setForm((current) => ({ ...current, matchType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a match type" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "NAME",
                    "NICKNAME",
                    "HASHTAG",
                    "PLACE",
                    "KEYWORD",
                    "MANUAL_IMPORT",
                  ].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monitoring-query">Matching term</Label>
              <Input
                id="monitoring-query"
                value={form.query}
                onChange={(event) =>
                  setForm((current) => ({ ...current, query: event.target.value }))
                }
                placeholder="Name, nickname, hashtag, or place"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monitoring-snippet">Source text snippet</Label>
            <Textarea
              id="monitoring-snippet"
              value={form.textSnippet}
              onChange={(event) =>
                setForm((current) => ({ ...current, textSnippet: event.target.value }))
              }
              placeholder="Paste the relevant excerpt exactly as it appears in the source."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="monitoring-handle">Handle</Label>
              <Input
                id="monitoring-handle"
                value={form.handle}
                onChange={(event) =>
                  setForm((current) => ({ ...current, handle: event.target.value }))
                }
                placeholder="@observed-account"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monitoring-location">Observed place</Label>
              <Input
                id="monitoring-location"
                value={form.location}
                onChange={(event) =>
                  setForm((current) => ({ ...current, location: event.target.value }))
                }
                placeholder="Estate, landmark, station, or town"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="monitoring-url">Source URL</Label>
              <Input
                id="monitoring-url"
                value={form.url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, url: event.target.value }))
                }
                placeholder="https://example.org/post"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monitoring-confidence">Confidence</Label>
              <Input
                id="monitoring-confidence"
                type="number"
                min="0.2"
                max="0.99"
                step="0.01"
                value={form.confidenceScore}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    confidenceScore: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monitoring-media">Thumbnail URL</Label>
            <Input
              id="monitoring-media"
              value={form.mediaThumbnailUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, mediaThumbnailUrl: event.target.value }))
              }
              placeholder="Optional image URL from the imported source"
            />
          </div>

          <Button
            className="w-full justify-between"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              const response = await fetch("/api/monitoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...form,
                  mode: "manual",
                  confidenceScore: Number(form.confidenceScore),
                }),
              });
              const result = await response.json();
              setSubmitting(false);

              if (!response.ok) {
                toast.error("Import failed", {
                  description: result.message ?? "Check the source details and try again.",
                });
                return;
              }

              toast.success("Monitoring hit imported", {
                description: "The manual source was added to the review queue.",
              });
              window.location.reload();
            }}
          >
            Add monitoring hit
            {submitting ? <LoaderCircle className="animate-spin" /> : <Radar />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
