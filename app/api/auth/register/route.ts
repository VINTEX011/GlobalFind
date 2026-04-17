import { NextResponse } from "next/server";

import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        errors: parsed.error.flatten(),
        message: "Please correct the highlighted fields.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message:
      "Registration is wired for database-backed deployment. In local preview, use the seeded demo accounts to continue immediately.",
  });
}
