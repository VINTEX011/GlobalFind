"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/app-shell/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";

const links = [
  { href: "/cases", label: "Cases" },
  { href: "/submit-tip", label: "Submit a tip" },
  { href: "/report", label: "Report missing person" },
  { href: "/login", label: "Login" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70">
      <div className="section-shell flex items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-teal-500 font-semibold text-zinc-950">
            TL
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">{APP_NAME}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Missing persons intelligence
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden lg:inline-flex">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="lg:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,320px)]">
              <div className="mt-10 flex flex-col gap-2">
                {links.map((link) => (
                  <Button key={link.href} asChild variant="secondary" className="justify-start">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
                <Button asChild className="mt-4 justify-start">
                  <Link href="/dashboard">Open dashboard</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
