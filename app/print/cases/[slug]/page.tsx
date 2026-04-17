import { notFound } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

import { getCaseBySlug } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default async function PrintablePosterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseRecord = await getCaseBySlug(slug);

  if (!caseRecord) {
    notFound();
  }

  const primaryImage = caseRecord.images.find((image) => image.isPrimary) ?? caseRecord.images[0];
  const publicUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/cases/${caseRecord.slug}`;

  return (
    <main className="mx-auto max-w-5xl bg-white p-8 text-zinc-950 print:max-w-none print:p-0">
      <div className="grid gap-8 border border-zinc-200 p-8 print:border-none md:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <div className="relative min-h-[420px] overflow-hidden border border-zinc-200">
            <Image
              src={primaryImage.url}
              alt={caseRecord.fullName}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="flex items-center gap-4">
            <QRCodeSVG value={publicUrl} size={116} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Public case page
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-600">{publicUrl}</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
              Missing person alert
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">{caseRecord.fullName}</h1>
            <p className="mt-3 text-lg text-zinc-600">
              {caseRecord.age} years old · {caseRecord.gender}
            </p>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-zinc-700">
            <div>
              <p className="font-semibold text-zinc-950">Last seen</p>
              <p>{formatDateTime(caseRecord.lastSeenAt)}</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Location</p>
              <p>
                {caseRecord.lastSeenLocation.label}, {caseRecord.city}, {caseRecord.country}
              </p>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Physical description</p>
              <p>{caseRecord.physicalDescription}</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Clothing</p>
              <p>{caseRecord.clothingDescription}</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Distinguishing features</p>
              <p>{caseRecord.distinguishingFeatures}</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Emergency contact</p>
              <p>{caseRecord.emergencyContact}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
