import { getPublicCases } from "@/lib/data";
import { PublicHeader } from "@/components/app-shell/public-header";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { TipForm } from "@/components/forms/tip-form";

export default async function SubmitTipPage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const { caseId } = await searchParams;
  const cases = await getPublicCases();

  return (
    <main>
      <PublicHeader />
      <section className="section-shell grid gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <TipForm cases={cases} defaultCaseId={caseId} />
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
              Public tip line
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Share a sighting or clue responsibly.
            </h1>
            <p className="mt-4 text-sm leading-8 text-zinc-600 dark:text-zinc-400">
              Include what you saw, where you saw it, and how confident you are. The more specific the context, the faster moderators can assess whether it helps.
            </p>
          </div>
          <div className="border border-zinc-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
              Important safeguard
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              TraceLink does not reveal identities from internet photos. Any visual similarity is limited to the case being reviewed and never treated as confirmation.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
