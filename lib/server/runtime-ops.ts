import "server-only";

import { randomUUID } from "node:crypto";

import {
  demoCases,
  demoLeads,
  demoMonitoringHits,
  demoNotifications,
  demoTips,
} from "@/lib/mock-data";
import { compareCaseImageToTipImage } from "@/lib/services/similarity";
import { type CaseFormValues } from "@/lib/validations/case";
import { type TipFormValues } from "@/lib/validations/tip";
import {
  type DemoCase,
  type DemoLead,
  type DemoLocation,
  type DemoMonitoringHit,
  type DemoNotification,
  type DemoTip,
  type LeadSource,
  type LeadStatus,
  type MonitoringMatchType,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

import { readRuntimeStore, updateRuntimeStore } from "@/lib/server/runtime-store";

type UploadedAsset = {
  url: string;
  name: string;
};

type ManualMonitoringInput = {
  caseId: string;
  source: LeadSource;
  query: string;
  matchType: MonitoringMatchType;
  textSnippet: string;
  handle?: string;
  url: string;
  location: string;
  confidenceScore: number;
  mediaThumbnailUrl?: string;
};

const CITY_CENTERS: Record<string, { latitude: number; longitude: number }> = {
  nairobi: { latitude: -1.286389, longitude: 36.817223 },
  mombasa: { latitude: -4.043477, longitude: 39.668206 },
  kisumu: { latitude: -0.091702, longitude: 34.767956 },
  eldoret: { latitude: 0.514277, longitude: 35.26978 },
  nakuru: { latitude: -0.303099, longitude: 36.080025 },
};

function mergeById<T extends { id: string }>(base: T[], runtime: T[]) {
  const merged = new Map(base.map((entry) => [entry.id, entry]));

  for (const entry of runtime) {
    merged.set(entry.id, entry);
  }

  return [...merged.values()];
}

async function getSnapshot() {
  const runtime = await readRuntimeStore();

  return {
    cases: mergeById(demoCases, runtime.cases),
    tips: mergeById(demoTips, runtime.tips),
    leads: mergeById(demoLeads, runtime.leads),
    monitoringHits: mergeById(demoMonitoringHits, runtime.monitoringHits),
    notifications: mergeById(demoNotifications, runtime.notifications),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function hashText(value: string) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function buildLocation({
  label,
  city,
  county,
  country,
  address,
}: {
  label: string;
  city: string;
  county: string;
  country: string;
  address?: string;
}) {
  const seed = `${label}:${city}:${county}:${country}`;
  const hash = hashText(seed);
  const center = CITY_CENTERS[city.toLowerCase()] ?? CITY_CENTERS.nairobi;
  const latitude = center.latitude + ((hash % 200) - 100) / 5000;
  const longitude = center.longitude + (((hash / 7) % 200) - 100) / 5000;

  return {
    id: `loc-${slugify(seed)}-${hash % 1000}`,
    label,
    address: address ?? label,
    city,
    county,
    country,
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
  } satisfies DemoLocation;
}

function normalizeConfidence(value: "LOW" | "MEDIUM" | "HIGH") {
  if (value === "HIGH") return 0.84;
  if (value === "MEDIUM") return 0.63;
  return 0.44;
}

function sourceLabel(source: LeadSource) {
  switch (source) {
    case "FACEBOOK":
      return "Facebook";
    case "INSTAGRAM":
      return "Instagram";
    case "X":
      return "X";
    case "WEB":
      return "Open web";
    case "MANUAL":
      return "Manual import";
  }
}

function replaceById<T extends { id: string }>(entries: T[], next: T) {
  const filtered = entries.filter((entry) => entry.id !== next.id);
  return [next, ...filtered];
}

function appendNotification(
  notifications: DemoNotification[],
  input: Omit<DemoNotification, "id" | "createdAt" | "read">,
) {
  return [
    {
      id: `notif-${randomUUID()}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...input,
    },
    ...notifications,
  ];
}

export async function createCaseRecord(
  values: CaseFormValues,
  uploads: UploadedAsset[],
  ownerName = "TraceLink Family Desk",
) {
  if (!uploads.length) {
    throw new Error("Add at least one case photo before submitting.");
  }

  const snapshot = await getSnapshot();
  const slugBase = slugify(values.fullName);
  const duplicateCount = snapshot.cases.filter((entry) =>
    entry.slug.startsWith(slugBase),
  ).length;

  const lastSeenLocation = buildLocation({
    label: values.lastSeenLocation,
    address: values.lastSeenLocation,
    city: values.city,
    county: values.county,
    country: values.country,
  });

  const caseRecord: DemoCase = {
    id: `case-${randomUUID()}`,
    slug: duplicateCount ? `${slugBase}-${duplicateCount + 1}` : slugBase,
    fullName: values.fullName,
    nickname: values.nickname || undefined,
    age: values.age,
    gender: values.gender,
    status: "ACTIVE",
    privacyLevel: values.privacyLevel,
    lastSeenAt: new Date(`${values.lastSeenDate}T${values.lastSeenTime}:00`).toISOString(),
    lastSeenLocation,
    city: values.city,
    county: values.county,
    country: values.country,
    physicalDescription: values.physicalDescription,
    clothingDescription: values.clothingDescription,
    distinguishingFeatures: values.distinguishingFeatures,
    summary: values.summary,
    emergencyContact: values.emergencyContact,
    policeReference: values.policeReference || undefined,
    consentGiven: values.consent,
    ownerId: "usr-family-1",
    ownerName,
    images: uploads.map((upload, index) => ({
      id: `img-${randomUUID()}`,
      url: upload.url,
      caption:
        index === 0
          ? `${values.fullName} intake photo`
          : `${values.fullName} reference photo ${index + 1}`,
      isPrimary: index === 0,
    })),
    updates: [
      {
        id: `update-${randomUUID()}`,
        createdAt: new Date().toISOString(),
        title: "Case intake submitted",
        body:
          "A new missing-person case was added through the secure intake workflow and is ready for moderator review.",
        visibility: values.privacyLevel,
        actor: ownerName,
      },
    ],
    keywords: [
      values.fullName,
      values.nickname,
      values.city,
      values.county,
      ...values.lastSeenLocation.split(" "),
    ].filter(Boolean) as string[],
  };

  await updateRuntimeStore((store) => ({
    ...store,
    cases: [caseRecord, ...store.cases],
    notifications: appendNotification(store.notifications, {
      title: "New case intake",
      body: `${caseRecord.fullName} was added to the secure intake queue.`,
      href: `/dashboard/cases/${caseRecord.id}`,
    }),
  }));

  return caseRecord;
}

export async function createTipRecord(
  values: TipFormValues,
  upload?: UploadedAsset,
) {
  const snapshot = await getSnapshot();
  const caseRecord = snapshot.cases.find((entry) => entry.id === values.caseId);

  if (!caseRecord) {
    throw new Error("Case not found for this tip.");
  }

  const seenAt = new Date(`${values.seenDate}T${values.seenTime}:00`).toISOString();
  const confidenceScore = normalizeConfidence(values.confidence);
  const tipId = `tip-${randomUUID()}`;

  const tip: DemoTip = {
    id: tipId,
    caseId: caseRecord.id,
    caseName: caseRecord.fullName,
    description: values.description,
    imageUrl: upload?.url,
    seenAt,
    location: buildLocation({
      label: values.location,
      address: values.location,
      city: caseRecord.city,
      county: caseRecord.county,
      country: caseRecord.country,
    }),
    reporterContact: values.contactInfo || undefined,
    anonymous: values.anonymous,
    confidence: confidenceScore,
    status: upload ? "UNDER_REVIEW" : "NEW",
    createdAt: new Date().toISOString(),
  };

  let similarity: Awaited<ReturnType<typeof compareCaseImageToTipImage>> | null = null;

  if (upload && caseRecord.images.length) {
    similarity = await compareCaseImageToTipImage(caseRecord.id, tipId);
    tip.similarityScore = similarity.score;
    tip.similarityNotes = similarity.notes;
  }

  const lead: DemoLead = {
    id: `lead-${randomUUID()}`,
    caseId: caseRecord.id,
    caseName: caseRecord.fullName,
    tipId,
    title: `${caseRecord.fullName} sighting report`,
    snippet: values.description,
    source: "MANUAL",
    sourceLabel: "Public tip",
    confidenceScore,
    similarityScore: similarity?.score,
    similarityNotes: similarity?.notes,
    status: similarity ? "UNDER_REVIEW" : "NEW",
    occurredAt: seenAt,
    tipImageUrl: upload?.url,
    location: tip.location,
    notes:
      similarity?.notes ??
      "Submitted from the public tip line. Review context, location, and timing before escalation.",
    audit: [
      {
        id: `audit-${randomUUID()}`,
        at: new Date().toISOString(),
        actor: values.anonymous ? "Anonymous reporter" : "Public tip line",
        action: "Tip converted to lead",
        details:
          "TraceLink created a review lead from the submitted tip so moderators can assess it alongside existing case evidence.",
      },
    ],
  };

  await updateRuntimeStore((store) => ({
    ...store,
    tips: [tip, ...store.tips],
    leads: [lead, ...store.leads],
    notifications: appendNotification(store.notifications, {
      title: "New tip received",
      body: `${caseRecord.fullName} now has a new tip in the review queue.`,
      href: "/dashboard/tips",
    }),
  }));

  return { tip, lead };
}

export async function createManualMonitoringHit(input: ManualMonitoringInput) {
  const snapshot = await getSnapshot();
  const caseRecord = snapshot.cases.find((entry) => entry.id === input.caseId);

  if (!caseRecord) {
    throw new Error("Case not found for monitoring import.");
  }

  const confidenceScore = clamp(input.confidenceScore, 0.2, 0.99);
  const hit: DemoMonitoringHit = {
    id: `hit-${randomUUID()}`,
    caseId: caseRecord.id,
    caseName: caseRecord.fullName,
    source: input.source,
    sourceLabel: sourceLabel(input.source),
    matchType: input.matchType,
    query: input.query,
    textSnippet: input.textSnippet,
    handle: input.handle || undefined,
    url: input.url,
    timestamp: new Date().toISOString(),
    location: buildLocation({
      label: input.location,
      address: input.location,
      city: caseRecord.city,
      county: caseRecord.county,
      country: caseRecord.country,
    }),
    mediaThumbnailUrl: input.mediaThumbnailUrl || undefined,
    confidenceScore,
    reviewStatus: "NEW",
  };

  await updateRuntimeStore((store) => ({
    ...store,
    monitoringHits: [hit, ...store.monitoringHits],
    notifications: appendNotification(store.notifications, {
      title: "Monitoring hit imported",
      body: `${caseRecord.fullName} has a new ${input.matchType.toLowerCase()} monitoring hit.`,
      href: "/dashboard/monitoring",
    }),
  }));

  return hit;
}

export async function createWatchlistHits(caseId: string) {
  const snapshot = await getSnapshot();
  const caseRecord = snapshot.cases.find((entry) => entry.id === caseId);

  if (!caseRecord) {
    throw new Error("Case not found for monitoring refresh.");
  }

  const watchTerms = [
    { query: caseRecord.fullName, matchType: "NAME" as const },
    ...(caseRecord.nickname
      ? [{ query: caseRecord.nickname, matchType: "NICKNAME" as const }]
      : []),
    { query: caseRecord.city, matchType: "PLACE" as const },
    ...caseRecord.keywords.slice(0, 2).map((query) => ({
      query,
      matchType: "KEYWORD" as const,
    })),
  ];

  const created = watchTerms.map((term, index) => {
    const sourcePool: LeadSource[] = ["WEB", "X", "INSTAGRAM", "MANUAL"];
    const source = sourcePool[index % sourcePool.length];

    return {
      id: `hit-${randomUUID()}`,
      caseId: caseRecord.id,
      caseName: caseRecord.fullName,
      source,
      sourceLabel: sourceLabel(source),
      matchType: term.matchType,
      query: term.query,
      textSnippet: `${term.query} appeared in a fresh public-source result linked to ${caseRecord.city}. Review the wording, timing, and location before escalating it.`,
      handle:
        source === "WEB" ? undefined : `@watch-${slugify(caseRecord.fullName)}-${index + 1}`,
      url: `https://example.org/monitoring/${slugify(caseRecord.fullName)}/${index + 1}`,
      timestamp: new Date(Date.now() - index * 1000 * 60 * 18).toISOString(),
      location: buildLocation({
        label: caseRecord.lastSeenLocation.label,
        address: caseRecord.lastSeenLocation.address,
        city: caseRecord.city,
        county: caseRecord.county,
        country: caseRecord.country,
      }),
      confidenceScore: clamp(0.48 + index * 0.08, 0.48, 0.86),
      reviewStatus: index === 0 ? ("UNDER_REVIEW" as LeadStatus) : ("NEW" as LeadStatus),
    } satisfies DemoMonitoringHit;
  });

  await updateRuntimeStore((store) => ({
    ...store,
    monitoringHits: [...created, ...store.monitoringHits],
    notifications: appendNotification(store.notifications, {
      title: "Watchlist refresh completed",
      body: `${created.length} new monitoring hits were generated for ${caseRecord.fullName}.`,
      href: "/dashboard/monitoring",
    }),
  }));

  return created;
}

export async function updateLeadReview(
  id: string,
  status: LeadStatus,
  note?: string,
) {
  const snapshot = await getSnapshot();
  const existing = snapshot.leads.find((entry) => entry.id === id);

  if (!existing) {
    throw new Error("Lead not found.");
  }

  const updated: DemoLead = {
    ...existing,
    status,
    notes: note?.trim() ? note.trim() : existing.notes,
    audit: [
      ...existing.audit,
      {
        id: `audit-${randomUUID()}`,
        at: new Date().toISOString(),
        actor: "TraceLink moderator",
        action: `Lead set to ${status.toLowerCase().replaceAll("_", " ")}`,
        details:
          note?.trim() ||
          "Lead status was updated from the review drawer without additional note text.",
      },
    ],
  };

  await updateRuntimeStore((store) => ({
    ...store,
    leads: replaceById(store.leads, updated),
    notifications: appendNotification(store.notifications, {
      title: "Lead review updated",
      body: `${existing.caseName ?? "Case"} lead moved to ${status.toLowerCase().replaceAll("_", " ")}.`,
      href: "/dashboard/tips",
    }),
  }));

  return updated;
}

export async function createRuntimeNotification(
  input: Omit<DemoNotification, "id" | "createdAt" | "read">,
) {
  const notification: DemoNotification = {
    id: `notif-${randomUUID()}`,
    createdAt: new Date().toISOString(),
    read: false,
    ...input,
  };

  await updateRuntimeStore((store) => ({
    ...store,
    notifications: [notification, ...store.notifications],
  }));

  return notification;
}
