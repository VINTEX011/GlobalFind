import Image from "next/image";

import { Card } from "@/components/ui/card";
import { type DemoCaseImage } from "@/lib/types";

export function ImageGallery({ images }: { images: DemoCaseImage[] }) {
  const primary = images.find((image) => image.isPrimary) ?? images[0];
  const secondary = images.filter((image) => image.id !== primary.id);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <Card className="group relative min-h-[380px] overflow-hidden">
        <Image
          src={primary.url}
          alt={primary.caption}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Primary image
          </p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-white/88">{primary.caption}</p>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {secondary.map((image, index) => (
          <Card key={image.id} className="group relative min-h-[172px] overflow-hidden">
            <Image
              src={image.url}
              alt={image.caption}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 50vw, 30vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Image {index + 2}
              </p>
              <p className="mt-2 text-sm text-white/85">{image.caption}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
