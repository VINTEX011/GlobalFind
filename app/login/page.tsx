import Link from "next/link";

import { PublicHeader } from "@/components/app-shell/public-header";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main>
      <PublicHeader />
      <section className="section-shell grid gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
            Secure access
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Sign in to the TraceLink dashboard.
          </h1>
          <p className="max-w-xl text-sm leading-8 text-zinc-600 dark:text-zinc-400">
            Case owners and moderators use the dashboard to manage case files, review leads, monitor public-source hits, and coordinate notifications.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Need a new account? <Link href="/register" className="text-teal-600 dark:text-teal-300">Request secure access</Link>.
          </p>
        </div>
        <LoginForm />
      </section>
      <SiteFooter />
    </main>
  );
}
