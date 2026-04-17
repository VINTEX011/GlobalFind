"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";

type Marker = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  source: string;
  occurredAt: string;
};

export function MapPanel({ markers }: { markers: Marker[] }) {
  const [selectedId, setSelectedId] = useState(markers[0]?.id);
  const selected = markers.find((entry) => entry.id === selectedId) ?? markers[0];

  const bounds = useMemo(() => {
    const latitudes = markers.map((entry) => entry.latitude);
    const longitudes = markers.map((entry) => entry.longitude);

    return {
      minLat: Math.min(...latitudes),
      maxLat: Math.max(...latitudes),
      minLng: Math.min(...longitudes),
      maxLng: Math.max(...longitudes),
    };
  }, [markers]);

  const getPosition = (value: number, min: number, max: number) => {
    if (max === min) return 50;
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 border-b border-zinc-200/70 pb-5 dark:border-white/10 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Sightings map</CardTitle>
          <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Mapbox-ready plotting surface for sightings, tips, and escalated leads. Add a token in your environment to replace the plotted preview with live basemaps and geocoding.
          </p>
        </div>
        {selected ? <StatusBadge status={selected.status} /> : null}
      </CardHeader>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-zinc-200/80 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(39,39,42,0.96))] dark:border-white/10">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
          {markers.map((marker) => {
            const left = getPosition(marker.longitude, bounds.minLng, bounds.maxLng);
            const top = 100 - getPosition(marker.latitude, bounds.minLat, bounds.maxLat);

            return (
              <button
                key={marker.id}
                type="button"
                onClick={() => setSelectedId(marker.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <span className="relative flex size-11 items-center justify-center rounded-full bg-teal-500 text-zinc-950 shadow-[0_18px_40px_-18px_rgba(45,212,191,0.9)]">
                  <MapPin className="size-5" />
                </span>
              </button>
            );
          })}
        </div>
        <div className="space-y-4">
          {selected ? (
            <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Selected marker
              </p>
              <h3 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">
                {selected.title}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <p>Source: {selected.source}</p>
                <p>Detected: {formatDateTime(selected.occurredAt)}</p>
              </div>
            </div>
          ) : null}
          <div className="space-y-3">
            {markers.map((marker) => (
              <button
                key={marker.id}
                type="button"
                onClick={() => setSelectedId(marker.id)}
                className="w-full rounded-lg border border-zinc-200/80 bg-white/80 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-400/40 dark:hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-950 dark:text-white">{marker.title}</p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {marker.source}
                    </p>
                  </div>
                  <StatusBadge status={marker.status} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {formatDateTime(marker.occurredAt, "MMM d, HH:mm")}
                </p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
