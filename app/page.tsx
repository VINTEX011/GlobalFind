import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeAlert, MapPinned, Radar, ShieldCheck, Users2 } from "lucide-react";

import { PublicHeader } from "@/components/app-shell/public-header";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { CaseCard } from "@/components/cards/case-card";
import { Button } from "@/components/ui/button";
import { getPublicCases } from "@/lib/data";

const faqs = [
  {
    question: "What does TraceLink monitor?",
    answer:
      "TraceLink organizes lawful public-source monitoring using names, nicknames, hashtags, places, and manual imports. It does not identify strangers across the internet.",
  },
  {
    question: "Are image matches treated as confirmed identity?",
    answer:
      "No. Any image similarity shown in TraceLink is only a possible lead within a single case and always requires manual moderator review.",
  },
  {
    question: "Who can open a case?",
    answer:
      "Families, NGOs, and authorized case owners can create secure case files, manage updates, and control privacy settings for public sharing.",
  },
];

export default async function HomePage() {
  const cases = (await getPublicCases()).slice(0, 3);

  return (
    <main>
      <PublicHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1800&q=80"
            alt="Community volunteers coordinating a response"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,18,18,0.35),rgba(15,18,18,0.78))]" />
        </div>
        <div className="section-shell relative px-4 pb-18 pt-20 md:pt-28">
          <div className="max-w-4xl space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
              Missing persons case intelligence platform
            </p>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Helping communities find missing people faster.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/82">
                TraceLink gives families, NGOs, and moderators one secure place to manage missing-person cases, collect public tips, monitor public posts by keywords and places, and review sightings with calm, accountable workflows.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/report">
                  Report Missing Person
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/submit-tip">Submit a Tip</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/cases">Browse Cases</Link>
              </Button>
            </div>
            <div className="grid gap-4 pt-6 md:grid-cols-3">
              {[
                { label: "Secure case intake", icon: ShieldCheck },
                { label: "Public-source monitoring", icon: Radar },
                { label: "Sighting intelligence maps", icon: MapPinned },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="border border-white/15 bg-white/8 p-5 backdrop-blur-md"
                  >
                    <Icon className="size-5 text-teal-200" />
                    <p className="mt-4 text-sm font-medium text-white">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-18">
        <div className="section-shell space-y-8 px-4">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
                Trusted operations
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white">
                Built for urgency without turning people into guesses.
              </h2>
            </div>
            <p className="text-sm leading-8 text-zinc-600 dark:text-zinc-400">
              Every tip, public-source hit, and image comparison stays inside a review workflow with clear audit history, privacy controls, and human moderation at the center.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Case ownership",
                copy: "Authorized families and NGOs manage profiles, updates, and public visibility.",
                icon: Users2,
              },
              {
                title: "Lead review",
                copy: "Moderators approve, reject, or escalate tips with notes and audit logs.",
                icon: BadgeAlert,
              },
              {
                title: "Keyword monitoring",
                copy: "Track nicknames, locations, hashtags, and manual imports across public sources.",
                icon: Radar,
              },
              {
                title: "Map intelligence",
                copy: "Visualize sightings and monitoring hits by status, source, and time window.",
                icon: MapPinned,
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="border border-zinc-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-white/5"
                >
                  <Icon className="size-5 text-teal-500" />
                  <h3 className="mt-5 text-xl font-semibold text-zinc-950 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {feature.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-18">
        <div className="section-shell space-y-8 px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
                Public cases
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white">
                Active case pages designed for fast public action.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/cases">
                View all public cases
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            {cases.map((caseRecord) => (
              <CaseCard key={caseRecord.id} caseRecord={caseRecord} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-18">
        <div className="section-shell grid gap-6 px-4 lg:grid-cols-3">
          {[
            {
              title: "1. Open the case",
              body: "Capture last-seen context, trusted contacts, photos, and privacy settings in a single intake flow.",
            },
            {
              title: "2. Collect signals",
              body: "Public tips, monitoring hits, and optional per-case image similarity are gathered into one review queue.",
            },
            {
              title: "3. Review and respond",
              body: "Moderators assess leads, document decisions, map sightings, and trigger family notifications.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="border border-zinc-200/80 bg-white/88 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                {step.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-18">
        <div className="section-shell grid gap-6 px-4 lg:grid-cols-[1fr_1fr]">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="border border-zinc-200/80 bg-white/88 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
