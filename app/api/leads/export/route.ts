import { NextResponse } from "next/server";

import { getLeads } from "@/lib/data";

export async function GET() {
  const leads = await getLeads();

  const rows = [
    ["id", "title", "caseId", "source", "status", "confidenceScore", "occurredAt", "location"],
    ...leads.map((lead) => [
      lead.id,
      lead.title,
      lead.caseId,
      lead.source,
      lead.status,
      String(lead.confidenceScore),
      lead.occurredAt,
      `${lead.location.label}, ${lead.location.city}`,
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="tracelink-leads.csv"',
    },
  });
}
