import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function getFileExtension(file: File) {
  const fromName = path.extname(file.name).replace(".", "").toLowerCase();

  if (fromName) {
    return fromName;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export async function saveUploadedFile(
  file: File,
  folder: "cases" | "tips" | "monitoring",
) {
  if (!file.size) {
    throw new Error("Uploaded file is empty.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported.");
  }

  const extension = getFileExtension(file);
  const targetDir = path.join(PUBLIC_UPLOADS_DIR, folder);
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const targetPath = path.join(targetDir, filename);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));

  return {
    url: `/uploads/${folder}/${filename}`,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}
