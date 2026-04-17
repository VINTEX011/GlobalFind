import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white dark:bg-white/10 dark:text-zinc-50 dark:ring-1 dark:ring-white/10",
        active: "bg-teal-500/15 text-teal-700 ring-1 ring-teal-500/25 dark:text-teal-300",
        warning:
          "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-300",
        danger: "bg-rose-500/15 text-rose-700 ring-1 ring-rose-500/25 dark:text-rose-300",
        muted:
          "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
