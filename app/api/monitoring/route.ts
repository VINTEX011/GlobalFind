import { NextResponse } from "next/server";

import { getMonitoringHits } from "@/lib/data";
import { scheduleMonitoringRefresh } from "@/lib/services/monitoring";

export async function GET() {
  const hits = await getMonitoringHits();

  return NextResponse.json({
    hits,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const caseId = String(body.caseId ?? "");

  if (!caseId) {
    return NextResponse.json({ message: "caseId is required." }, { status: 400 });
  }

  const result = await scheduleMonitoringRefresh(caseId);

  return NextResponse.json({
    success: true,
    result,
  });
}
