import { SearchInput } from "@/components/ui/search-input";
import { CaseCard } from "@/components/cards/case-card";
import { EmptyState } from "@/components/empty-states/empty-state";
import { PublicHeader } from "@/components/app-shell/public-header";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { getPublicCases, searchCases } from "@/lib/data";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "ALL" } = await searchParams;
  const cases = await getPublicCases();
  const searched = searchCases(q, cases);
  const filtered =
    status === "ALL" ? searched : searched.filter((entry) => entry.status === status);

  return (
    <main>
      <PublicHeader />
      <section className="section-shell space-y-8 px-4 py-16">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
            Public case directory
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Browse active and recently updated public cases.
          </h1>
          <p className="max-w-3xl text-sm leading-8 text-zinc-600 dark:text-zinc-400">
            Search by name, nickname, location, or keyword. Public pages are designed for safe community action and tip submission.
          </p>
        </div>

        <form className="grid gap-4 rounded-lg border border-zinc-200/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1fr_180px]">
          <SearchInput name="q" defaultValue={q} placeholder="Search names, nicknames, or places" />
          <select
            name="status"
            defaultValue={status}
            className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="FOUND">Found</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </form>

        {filtered.length ? (
          <div className="grid gap-6 xl:grid-cols-3">
            {filtered.map((caseRecord) => (
              <CaseCard key={caseRecord.id} caseRecord={caseRecord} />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="No results"
            title="No cases matched those filters."
            description="Try a broader name, remove the status filter, or browse all public case files."
            actionHref="/cases"
            actionLabel="Reset filters"
          />
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
