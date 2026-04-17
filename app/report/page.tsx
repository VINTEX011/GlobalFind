import { Radar, ShieldCheck, Upload } from "lucide-react";

import { PublicHeader } from "@/components/app-shell/public-header";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { CaseReportForm } from "@/components/forms/case-report-form";

export default function ReportPage() {
  return (
    <main>
      <PublicHeader />
      <section className="section-shell grid gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <CaseReportForm />
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
              Authorized intake
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Open a secure missing-person case file.
            </h1>
            <p className="mt-4 text-sm leading-8 text-zinc-600 dark:text-zinc-400">
              Capture the strongest last-seen details first. TraceLink keeps families, moderators, and public tips aligned without promising unlawful identification.
            </p>
          </div>
          {[
            {
              title: "Structured evidence",
              body: "Photos, last-seen map points, physical description, and contact records stay in one controlled workflow.",
              icon: Upload,
            },
            {
              title: "Safe monitoring boundaries",
              body: "Keyword and place monitoring can support the case, but strangers are never identified across the internet.",
              icon: Radar,
            },
            {
              title: "Moderator review",
              body: "Potential image similarity remains a possible lead only and is always reviewed manually.",
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="border border-zinc-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-white/5"
              >
                <Icon className="size-5 text-teal-500" />
                <h2 className="mt-4 text-xl font-semibold text-zinc-950 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
