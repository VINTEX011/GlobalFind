"use client";

import { motion } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileSidebar } from "@/components/app-shell/sidebar";
import { NotificationBell } from "@/components/app-shell/notification-bell";
import { ThemeToggle } from "@/components/app-shell/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type TopbarUser = {
  name?: string | null;
  image?: string | null;
  role?: string | null;
};

function getHeading(pathname: string) {
  if (pathname === "/dashboard") return "Operational overview";
  if (pathname.startsWith("/dashboard/cases")) return "Case management";
  if (pathname.startsWith("/dashboard/tips")) return "Tip review queue";
  if (pathname.startsWith("/dashboard/monitoring")) return "Monitoring intelligence";
  if (pathname.startsWith("/dashboard/map")) return "Sightings map";
  if (pathname.startsWith("/dashboard/admin")) return "Admin control room";
  return "TraceLink dashboard";
}

function getSubcopy(pathname: string) {
  if (pathname === "/dashboard") {
    return "Track case volume, queue pressure, and emerging public-source signals in one place.";
  }

  if (pathname.startsWith("/dashboard/cases")) {
    return "Review case files, timeline notes, and public sharing readiness.";
  }

  if (pathname.startsWith("/dashboard/tips")) {
    return "Triage incoming tips, compare context, and route the strongest leads first.";
  }

  if (pathname.startsWith("/dashboard/monitoring")) {
    return "Monitor public-source hits by query, place, and review status.";
  }

  if (pathname.startsWith("/dashboard/map")) {
    return "Plot sightings, monitoring hits, and escalations across the field.";
  }

  if (pathname.startsWith("/dashboard/admin")) {
    return "Oversee moderator workload, user access, and platform health.";
  }

  return "Secure operations workspace.";
}

export function DashboardTopbar({ user }: { user?: TopbarUser }) {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/78 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/72"
    >
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="icon" className="xl:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(100vw,340px)] p-5">
                <MobileSidebar user={user} />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                TraceLink
              </p>
              <h1 className="text-xl font-semibold text-zinc-950 dark:text-white">
                {getHeading(pathname)}
              </h1>
              <p className="mt-1 hidden text-sm text-zinc-600 dark:text-zinc-400 md:block">
                {getSubcopy(pathname)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="h-11 rounded-lg px-2">
                  <Avatar className="size-8">
                    {user?.image ? <AvatarImage src={user.image} alt={user.name ?? "User"} /> : null}
                    <AvatarFallback name={user?.name ?? "TL"} />
                  </Avatar>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-medium text-zinc-950 dark:text-white">
                      {user?.name ?? "TraceLink user"}
                    </span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/cases">Cases</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04] lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search names, places, keywords, or lead notes"
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/dashboard/map">Open sightings map</Link>
            </Button>
            <Button asChild>
              <Link href="/report">Create new case</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
