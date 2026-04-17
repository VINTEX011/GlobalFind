import { ShieldCheck, Users2, Workflow } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getUsers } from "@/lib/data";

export default async function DashboardAdminPage() {
  const [stats, users] = await Promise.all([getDashboardStats(), getUsers()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
          Platform admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
          Operational health, moderation coverage, and user access.
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard {...stats[0]} icon={ShieldCheck} />
        <StatCard {...stats[1]} icon={Workflow} />
        <StatCard {...stats[2]} icon={Users2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>User management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 border border-zinc-200/70 p-4 dark:border-white/10"
              >
                <div>
                  <p className="font-medium text-zinc-950 dark:text-white">{user.name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email} · {user.role}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {user.title}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            <p>Review escalated leads within the first response window.</p>
            <p>Confirm public-case visibility on newly created reports.</p>
            <p>Check flagged tips for low-information or harmful content.</p>
            <p>Audit monitoring adapters for lawful keyword-only collection.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
