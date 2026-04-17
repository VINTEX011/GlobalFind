import { randomUUID } from "node:crypto";

import { updateRuntimeStore } from "@/lib/server/runtime-store";

export async function queueNotification(input: {
  userId?: string;
  type: "TIP" | "LEAD" | "STATUS" | "SYSTEM";
  title: string;
  body: string;
  href?: string;
}) {
  await updateRuntimeStore((store) => ({
    ...store,
    notifications: [
      {
        id: `notif-${randomUUID()}`,
        title: input.title,
        body: input.body,
        href: input.href ?? "/dashboard",
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...store.notifications,
    ],
  }));

  return {
    queued: true,
    emailStubbed: true,
    notification: input,
  };
}
