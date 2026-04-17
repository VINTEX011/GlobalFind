import { NextResponse } from "next/server";

import { getCaseBundle } from "@/lib/data";
import { caseSchema } from "@/lib/validations/case";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const bundle = await getCaseBundle(slug);

  if (!bundle) {
    return NextResponse.json({ message: "Case not found." }, { status: 404 });
  }

  return NextResponse.json(bundle);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();
  const parsed = caseSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    slug,
    updates: parsed.data,
  });
}
