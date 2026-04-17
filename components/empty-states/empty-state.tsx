import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-5 text-center">
        <div className="flex size-14 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-300">
          <Radar className="size-6" />
        </div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white">{title}</h3>
          <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
        {actionHref && actionLabel ? (
          <Button asChild>
            <Link href={actionHref}>
              {actionLabel}
              <ArrowRight />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
