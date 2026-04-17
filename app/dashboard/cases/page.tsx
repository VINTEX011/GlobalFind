import Link from "next/link";

import { CaseCard } from "@/components/cards/case-card";
import { EmptyState } from "@/components/empty-states/empty-state";
import { Pagination } from "@/components/tables/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { getCases, searchCases } from "@/lib/data";

export default async function DashboardCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const cases = await getCases();
  const results = searchCases(q, cases);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
            Case management
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            Review, update, and share case files.
          </h1>
        </div>
        <Link
          href="/report"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-500 px-5 text-sm font-medium text-zinc-950"
        >
          Create case
        </Link>
      </div>

      <form className="rounded-lg border border-zinc-200/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/5">
        <SearchInput name="q" defaultValue={q} placeholder="Search cases, keywords, or owners" />
      </form>

      {results.length ? (
        <>
          <div className="grid gap-6 xl:grid-cols-3">
            {results.map((caseRecord) => (
              <div key={caseRecord.id} className="space-y-3">
                <CaseCard caseRecord={caseRecord} />
                <Link
                  href={`/dashboard/cases/${caseRecord.id}`}
                  className="inline-flex text-sm font-medium text-teal-600 dark:text-teal-300"
                >
                  Open dashboard detail
                </Link>
              </div>
            ))}
          </div>
          <Pagination />
        </>
      ) : (
        <EmptyState
          eyebrow="No cases found"
          title="Your filters removed every case."
          description="Try searching by full name, nickname, county, or monitored keyword."
        />
      )}
    </div>
  );
}
