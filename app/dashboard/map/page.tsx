import { MapPanel } from "@/components/map/map-panel";
import { getSightingMarkers } from "@/lib/data";

export default async function DashboardMapPage() {
  const markers = await getSightingMarkers();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
          Geospatial review
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
          Visualize sightings, escalations, and monitoring overlap.
        </h1>
      </div>
      <MapPanel markers={markers} />
    </div>
  );
}
