import { NextResponse } from "next/server";

import { getNotifications } from "@/lib/data";

export async function GET() {
  const notifications = await getNotifications();
  return NextResponse.json({ notifications });
}
