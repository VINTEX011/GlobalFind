import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/app-shell/sidebar";
import { DashboardTopbar } from "@/components/app-shell/topbar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-shell min-h-screen">
      <div className="relative flex min-h-screen">
        <DashboardSidebar user={session.user} />
        <div className="min-w-0 flex-1">
          <DashboardTopbar user={session.user} />
          <div className="app-shell px-4 py-6 md:px-6 lg:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
