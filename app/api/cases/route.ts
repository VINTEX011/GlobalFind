import { NextResponse } from "next/server";

import { getPublicCases } from "@/lib/data";
import { caseSchema } from "@/lib/validations/case";

export async function GET() {
  const cases = await getPublicCases();

  return NextResponse.json({
    cases,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = caseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten(), message: "Case validation failed." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Case received and added to secure intake.",
    case: parsed.data,
  });
}
