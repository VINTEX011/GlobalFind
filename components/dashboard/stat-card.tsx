import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  tone?: "positive" | "warning" | "neutral";
  icon: LucideIcon;
};

export function StatCard({
  label,
  value,
  change,
  tone = "neutral",
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative p-6">
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-px",
            tone === "positive" && "bg-teal-500/50",
            tone === "warning" && "bg-amber-500/50",
            tone === "neutral" && "bg-zinc-300/70 dark:bg-white/10",
          )}
        />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg border p-2.5",
                  tone === "positive" &&
                    "border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300",
                  tone === "warning" &&
                    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
                  tone === "neutral" &&
                    "border-zinc-200/80 bg-zinc-100/80 text-zinc-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200",
                )}
              >
                <Icon className="size-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {label}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[2rem] font-semibold tracking-tight text-zinc-950 dark:text-white">
                {value}
              </p>
              <p
                className={cn(
                  "flex items-center gap-1 text-sm",
                  tone === "positive" && "text-teal-600 dark:text-teal-300",
                  tone === "warning" && "text-amber-600 dark:text-amber-300",
                  tone === "neutral" && "text-zinc-500 dark:text-zinc-400",
                )}
              >
                <ArrowUpRight className="size-4" />
                {change}
              </p>
            </div>
          </div>
          <div className="pt-1 text-xs uppercase tracking-[0.18em] text-zinc-400">Live</div>
        </div>
      </CardContent>
    </Card>
  );
}
