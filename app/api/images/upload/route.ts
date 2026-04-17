import { NextResponse } from "next/server";

import { saveUploadedFile } from "@/lib/server/storage";

export async function POST(request: Request) {
  const formData = await request.formData();
  const folderValue = String(formData.get("folder") ?? "tips");
  const folder =
    folderValue === "cases" || folderValue === "monitoring" ? folderValue : "tips";
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!files.length) {
    const single = formData.get("file");

    if (single instanceof File && single.size) {
      files.push(single);
    }
  }

  if (!files.length) {
    return NextResponse.json({ message: "No files were provided." }, { status: 400 });
  }

  const uploaded = await Promise.all(files.map((file) => saveUploadedFile(file, folder)));

  return NextResponse.json({
    success: true,
    uploaded,
  });
}
