import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { type DemoCase } from "@/lib/types";

export function CaseCard({ caseRecord }: { caseRecord: DemoCase }) {
  const primaryImage = caseRecord.images.find((image) => image.isPrimary) ?? caseRecord.images[0];

  return (
    <Card className="overflow-hidden">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={primaryImage.url}
          alt={`${caseRecord.fullName} case image`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <StatusBadge status={caseRecord.status} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              {caseRecord.privacyLevel}
            </p>
          </div>
          <h3 className="text-2xl font-semibold text-white">{caseRecord.fullName}</h3>
          <p className="mt-1 text-sm text-white/80">
            {caseRecord.age} years old / {caseRecord.gender}
          </p>
        </div>
      </div>
      <CardContent className="space-y-4 p-6">
        <p className="line-clamp-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {caseRecord.summary}
        </p>
        <div className="grid gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-4 text-teal-500" />
            <span>{formatDateTime(caseRecord.lastSeenAt)}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 text-teal-500" />
            <span>
              {caseRecord.lastSeenLocation.label}, {caseRecord.city}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-6 pt-0">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Owner: {caseRecord.ownerName}
        </p>
        <Button asChild variant="outline">
          <Link href={`/cases/${caseRecord.slug}`}>
            View case
            <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
