import { NextResponse } from "next/server";

import { leadReviewSchema } from "@/lib/validations/lead";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: `Lead ${parsed.data.decision.toLowerCase().replaceAll("_", " ")}.`,
    review: parsed.data,
  });
}
