import { NextResponse } from "next/server";
import { z } from "zod";

import { updateLeadReview } from "@/lib/server/runtime-ops";

const statusSchema = z.object({
  status: z.enum(["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED", "ESCALATED"]),
  note: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const lead = await updateLeadReview(id, parsed.data.status, parsed.data.note);

  return NextResponse.json({
    success: true,
    id,
    status: parsed.data.status,
    lead,
  });
}
