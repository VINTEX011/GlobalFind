import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <SlidersHorizontal className="size-4 text-teal-500" />
          Filters
        </div>
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">{children}</div>
      </CardContent>
    </Card>
  );
}
