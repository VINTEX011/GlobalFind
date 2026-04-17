import Link from "next/link";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/70 py-10 dark:border-white/10">
      <div className="section-shell flex flex-col gap-6 px-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-zinc-950 dark:text-white">{APP_NAME}</p>
          <p className="max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {APP_TAGLINE}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/cases">Browse cases</Link>
          <Link href="/submit-tip">Submit a tip</Link>
          <Link href="/report">Report missing person</Link>
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
