import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/app-shell/public-header";
import { SiteFooter } from "@/components/app-shell/site-footer";

export default function NotFound() {
  return (
    <main>
      <PublicHeader />
      <section className="section-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
          Not found
        </p>
        <h1 className="text-4xl font-semibold text-zinc-950 dark:text-white">
          That case or page is not available.
        </h1>
        <p className="max-w-xl text-sm leading-8 text-zinc-600 dark:text-zinc-400">
          The link may have expired, the case may be private, or the page may have moved.
        </p>
        <Button asChild>
          <Link href="/cases">Browse public cases</Link>
        </Button>
      </section>
      <SiteFooter />
    </main>
  );
}
