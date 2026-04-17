import { NextResponse } from "next/server";
import { z } from "zod";

import { getMonitoringHits } from "@/lib/data";
import {
  createManualMonitoringHit,
  createWatchlistHits,
} from "@/lib/server/runtime-ops";

export async function GET() {
  const hits = await getMonitoringHits();

  return NextResponse.json({
    hits,
  });
}

const manualImportSchema = z.object({
  mode: z.literal("manual"),
  caseId: z.string().min(1),
  source: z.enum(["FACEBOOK", "INSTAGRAM", "X", "WEB", "MANUAL"]),
  query: z.string().min(2),
  matchType: z.enum(["NAME", "NICKNAME", "HASHTAG", "PLACE", "KEYWORD", "MANUAL_IMPORT"]),
  textSnippet: z.string().min(12),
  handle: z.string().optional(),
  url: z.string().url(),
  location: z.string().min(2),
  confidenceScore: z.coerce.number().min(0.2).max(0.99),
  mediaThumbnailUrl: z.string().url().optional().or(z.literal("")),
});

const refreshSchema = z.object({
  mode: z.literal("refresh"),
  caseId: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const refresh = refreshSchema.safeParse(body);

  if (refresh.success) {
    const hits = await createWatchlistHits(refresh.data.caseId);

    return NextResponse.json({
      success: true,
      mode: "refresh",
      created: hits.length,
      hits,
    });
  }

  const manualImport = manualImportSchema.safeParse(body);

  if (!manualImport.success) {
    return NextResponse.json(
      { errors: manualImport.error.flatten(), message: "Monitoring import validation failed." },
      { status: 400 },
    );
  }

  const hit = await createManualMonitoringHit({
    ...manualImport.data,
    mediaThumbnailUrl: manualImport.data.mediaThumbnailUrl || undefined,
  });

  return NextResponse.json({
    success: true,
    mode: "manual",
    hit,
  });
}
