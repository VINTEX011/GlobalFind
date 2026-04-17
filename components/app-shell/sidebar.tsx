"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, PlusCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { dashboardNav } from "@/lib/navigation";

type SidebarUser = {
  name?: string | null;
  image?: string | null;
  role?: string | null;
  title?: string | null;
};

function SidebarContent({ user }: { user?: SidebarUser }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex size-12 items-center justify-center rounded-lg bg-teal-500 text-lg font-semibold text-zinc-950 shadow-[0_18px_35px_-18px_rgba(45,212,191,0.9)]">
            TL
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">{APP_NAME}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Case intelligence
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200/80 bg-white/72 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <Avatar className="size-11">
              {user?.image ? <AvatarImage src={user.image} alt={user.name ?? "User"} /> : null}
              <AvatarFallback name={user?.name ?? "TraceLink"} />
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">
                {user?.name ?? "Operations user"}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user?.title ?? user?.role ?? "Secure access"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {dashboardNav.map((item, index) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "border-zinc-950/10 bg-zinc-950 text-white shadow-[0_20px_35px_-22px_rgba(24,24,27,0.7)] dark:border-white/20 dark:bg-white dark:text-zinc-950"
                    : "border-transparent text-zinc-600 hover:border-zinc-200/80 hover:bg-white/85 hover:text-zinc-950 dark:text-zinc-400 dark:hover:border-white/10 dark:hover:bg-white/[0.06] dark:hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {item.title}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <Card className="mt-auto overflow-hidden border-teal-500/15 bg-[linear-gradient(145deg,rgba(35,186,167,0.12),rgba(255,255,255,0.9),rgba(251,191,36,0.18))] p-5 dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(35,186,167,0.16),rgba(255,255,255,0.05),rgba(251,191,36,0.08))]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Quick action
        </p>
        <h3 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">
          Start a new case file
        </h3>
        <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Build a report with secure intake, image evidence, and last-seen mapping in one flow.
        </p>
        <Button asChild className="mt-5 w-full justify-between">
          <Link href="/report">
            Report missing person
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="secondary" className="mt-2 w-full justify-between">
          <Link href="/submit-tip">
            Submit a public tip
            <PlusCircle />
          </Link>
        </Button>
      </Card>
    </div>
  );
}

export function DashboardSidebar({ user }: { user?: SidebarUser }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-r border-zinc-200/70 bg-white/55 px-5 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/35 xl:block">
      <SidebarContent user={user} />
    </aside>
  );
}

export function MobileSidebar({ user }: { user?: SidebarUser }) {
  return <SidebarContent user={user} />;
}
