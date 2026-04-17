import Link from "next/link";

import { PublicHeader } from "@/components/app-shell/public-header";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <main>
      <PublicHeader />
      <section className="section-shell grid gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
            Request access
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Create a family or organization account.
          </h1>
          <p className="max-w-xl text-sm leading-8 text-zinc-600 dark:text-zinc-400">
            TraceLink accounts are designed for lawful case coordination. Every account request is reviewed before broader monitoring permissions are enabled.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Already have credentials? <Link href="/login" className="text-teal-600 dark:text-teal-300">Sign in here</Link>.
          </p>
        </div>
        <RegisterForm />
      </section>
      <SiteFooter />
    </main>
  );
}
