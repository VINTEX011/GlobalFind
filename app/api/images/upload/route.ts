import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message:
      "Storage adapter stubbed. Replace this route with UploadThing or S3-compatible upload logic.",
  });
}
