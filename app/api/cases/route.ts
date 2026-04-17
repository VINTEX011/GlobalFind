import { NextResponse } from "next/server";

import { getPublicCases } from "@/lib/data";
import { createCaseRecord } from "@/lib/server/runtime-ops";
import { saveUploadedFile } from "@/lib/server/storage";
import { caseSchema } from "@/lib/validations/case";

export async function GET() {
  const cases = await getPublicCases();

  return NextResponse.json({
    cases,
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const formData = contentType.includes("multipart/form-data")
    ? await request.formData()
    : null;

  const body = formData
    ? {
        fullName: String(formData.get("fullName") ?? ""),
        nickname: String(formData.get("nickname") ?? ""),
        age: Number(formData.get("age") ?? 0),
        gender: String(formData.get("gender") ?? ""),
        lastSeenDate: String(formData.get("lastSeenDate") ?? ""),
        lastSeenTime: String(formData.get("lastSeenTime") ?? ""),
        lastSeenLocation: String(formData.get("lastSeenLocation") ?? ""),
        city: String(formData.get("city") ?? ""),
        county: String(formData.get("county") ?? ""),
        country: String(formData.get("country") ?? ""),
        physicalDescription: String(formData.get("physicalDescription") ?? ""),
        clothingDescription: String(formData.get("clothingDescription") ?? ""),
        distinguishingFeatures: String(formData.get("distinguishingFeatures") ?? ""),
        summary: String(formData.get("summary") ?? ""),
        emergencyContact: String(formData.get("emergencyContact") ?? ""),
        policeReference: String(formData.get("policeReference") ?? ""),
        privacyLevel: String(formData.get("privacyLevel") ?? "PUBLIC"),
        consent: String(formData.get("consent") ?? "") === "true",
      }
    : await request.json();

  const parsed = caseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten(), message: "Case validation failed." },
      { status: 400 },
    );
  }

  const imageFiles = (formData?.getAll("images") ?? []).filter(
    (entry): entry is File => entry instanceof File && entry.size > 0,
  );

  if (!imageFiles.length) {
    return NextResponse.json(
      { message: "Add at least one case photo before submitting." },
      { status: 400 },
    );
  }

  const uploads = await Promise.all(
    imageFiles.slice(0, 6).map((file) => saveUploadedFile(file, "cases")),
  );
  const caseRecord = await createCaseRecord(parsed.data, uploads);

  return NextResponse.json({
    success: true,
    message: "Case received and added to secure intake.",
    case: caseRecord,
  });
}
