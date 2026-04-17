import { NextResponse } from "next/server";

import { updateLeadReview } from "@/lib/server/runtime-ops";
import { leadReviewSchema } from "@/lib/validations/lead";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const status =
    parsed.data.decision === "APPROVED"
      ? "APPROVED"
      : parsed.data.decision === "REJECTED"
        ? "REJECTED"
        : "UNDER_REVIEW";

  const lead = await updateLeadReview(parsed.data.leadId, status, parsed.data.notes);

  return NextResponse.json({
    success: true,
    message: `Lead ${parsed.data.decision.toLowerCase().replaceAll("_", " ")}.`,
    review: parsed.data,
    lead,
  });
}
