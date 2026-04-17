import { NextResponse } from "next/server";

import { getAnalyticsSnapshot } from "@/lib/services/analytics";

export async function GET() {
  const analytics = await getAnalyticsSnapshot();

  return NextResponse.json({
    analytics,
  });
}
