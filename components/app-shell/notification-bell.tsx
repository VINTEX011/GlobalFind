"use client";

import { Bell, Dot } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { demoNotifications } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/format";

export function NotificationBell() {
  const unreadCount = demoNotifications.filter((entry) => !entry.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px]">
        <DropdownMenuLabel>Case alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {demoNotifications.map((notification) => (
          <DropdownMenuItem key={notification.id} asChild className="items-start p-0">
            <Link href={notification.href} className="flex w-full gap-3 rounded-lg px-2 py-2.5">
              <div className="pt-0.5">
                <Dot className={notification.read ? "text-zinc-300" : "text-teal-500"} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-950 dark:text-white">
                  {notification.title}
                </p>
                <p className="line-clamp-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  {notification.body}
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
