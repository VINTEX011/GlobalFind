import { NextResponse } from "next/server";

import { getTips } from "@/lib/data";
import { createTipRecord } from "@/lib/server/runtime-ops";
import { saveUploadedFile } from "@/lib/server/storage";
import { tipSchema } from "@/lib/validations/tip";

export async function GET() {
  const tips = await getTips();
  return NextResponse.json({ tips });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const formData = contentType.includes("multipart/form-data")
    ? await request.formData()
    : null;
  const body = formData
    ? {
        caseId: String(formData.get("caseId") ?? ""),
        description: String(formData.get("description") ?? ""),
        seenDate: String(formData.get("seenDate") ?? ""),
        seenTime: String(formData.get("seenTime") ?? ""),
        location: String(formData.get("location") ?? ""),
        confidence: String(formData.get("confidence") ?? "MEDIUM"),
        anonymous: String(formData.get("anonymous") ?? "") === "true",
        contactInfo: String(formData.get("contactInfo") ?? ""),
      }
    : await request.json();
  const parsed = tipSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const photo = formData?.get("photo");
  const upload =
    photo instanceof File && photo.size ? await saveUploadedFile(photo, "tips") : undefined;
  const created = await createTipRecord(parsed.data, upload);

  return NextResponse.json({
    success: true,
    message: "Tip received and added to the review queue.",
    tip: created.tip,
    lead: created.lead,
  });
}
