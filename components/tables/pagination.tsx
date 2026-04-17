import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({
  currentPage = 1,
  totalPages = 4,
}: {
  currentPage?: number;
  totalPages?: number;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200/80 bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <ChevronLeft />
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
