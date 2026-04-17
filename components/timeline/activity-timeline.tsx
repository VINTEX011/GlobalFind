import { Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { type DemoCaseUpdate } from "@/lib/types";

export function ActivityTimeline({ updates }: { updates: DemoCaseUpdate[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {updates.map((update, index) => (
            <div key={update.id} className="relative pl-8">
              <span className="absolute left-0 top-1 flex size-4 items-center justify-center rounded-full bg-teal-500" />
              {index < updates.length - 1 ? (
                <span className="absolute left-[7px] top-5 h-[calc(100%+1rem)] w-px bg-zinc-200 dark:bg-white/10" />
              ) : null}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                    {update.title}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    <Clock3 className="size-3.5" />
                    {formatDateTime(update.createdAt, "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {update.body}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {update.actor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
