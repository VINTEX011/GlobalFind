import { NextResponse } from "next/server";

import { getTips } from "@/lib/data";
import { queueNotification } from "@/lib/services/notifications";
import { tipSchema } from "@/lib/validations/tip";

export async function GET() {
  const tips = await getTips();
  return NextResponse.json({ tips });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = tipSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  await queueNotification({
    type: "TIP",
    title: "New tip submitted",
    body: parsed.data.description,
  });

  return NextResponse.json({
    success: true,
    message: "Tip received and added to the review queue.",
  });
}
