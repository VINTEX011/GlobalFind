import { unstable_noStore as noStore } from "next/cache";

import {
  demoCases,
  demoLeads,
  demoMonitoringHits,
  demoNotifications,
  demoTips,
  demoUsers,
} from "@/lib/mock-data";
import { readRuntimeStore } from "@/lib/server/runtime-store";
import { type DemoCase, type DemoLead, type DemoMonitoringHit, type DemoTip } from "@/lib/types";

function mergeById<T extends { id: string }>(base: T[], runtime: T[]) {
  const merged = new Map(base.map((entry) => [entry.id, entry]));

  for (const entry of runtime) {
    merged.set(entry.id, entry);
  }

  return [...merged.values()];
}

async function getSnapshot() {
  noStore();

  const runtime = await readRuntimeStore();

  return {
    cases: mergeById(demoCases, runtime.cases).sort(
      (left, right) =>
        new Date(right.lastSeenAt).getTime() - new Date(left.lastSeenAt).getTime(),
    ),
    tips: mergeById(demoTips, runtime.tips).sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    ),
    leads: mergeById(demoLeads, runtime.leads).sort(
      (left, right) =>
        new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
    ),
    hits: mergeById(demoMonitoringHits, runtime.monitoringHits).sort(
      (left, right) =>
        new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
    ),
    notifications: mergeById(demoNotifications, runtime.notifications).sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    ),
  };
}

export async function getUsers() {
  return demoUsers;
}

export async function getUserByEmail(email: string) {
  return demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getPublicCases() {
  const { cases } = await getSnapshot();
  return cases.filter((entry) => entry.privacyLevel !== "PRIVATE");
}

export async function getCases() {
  const { cases } = await getSnapshot();
  return cases;
}

export async function getCaseBySlug(slug: string) {
  const { cases } = await getSnapshot();
  return cases.find((entry) => entry.slug === slug) ?? null;
}

export async function getCaseById(id: string) {
  const { cases } = await getSnapshot();
  return cases.find((entry) => entry.id === id) ?? null;
}

export async function getTips(caseId?: string) {
  const { tips } = await getSnapshot();
  return caseId ? tips.filter((entry) => entry.caseId === caseId) : tips;
}

export async function getMonitoringHits(caseId?: string) {
  const { hits } = await getSnapshot();
  return caseId ? hits.filter((entry) => entry.caseId === caseId) : hits;
}

export async function getLeads(caseId?: string) {
  const { leads } = await getSnapshot();
  return caseId ? leads.filter((entry) => entry.caseId === caseId) : leads;
}

export async function getNotifications() {
  const { notifications } = await getSnapshot();
  return notifications;
}

export async function getCaseBundle(caseReference: string) {
  const caseRecord =
    (await getCaseBySlug(caseReference)) ?? (await getCaseById(caseReference));

  if (!caseRecord) {
    return null;
  }

  return {
    caseRecord,
    tips: await getTips(caseRecord.id),
    hits: await getMonitoringHits(caseRecord.id),
    leads: await getLeads(caseRecord.id),
  };
}

export async function getDashboardStats() {
  const { cases, leads, tips, notifications } = await getSnapshot();
  const activeCases = cases.filter((entry) => entry.status === "ACTIVE").length;
  const escalatedLeads = leads.filter((entry) => entry.status === "ESCALATED").length;
  const underReviewTips = tips.filter((entry) => entry.status === "UNDER_REVIEW").length;
  const unreadNotifications = notifications.filter((entry) => !entry.read).length;

  return [
    {
      label: "Active cases",
      value: String(activeCases),
      change: "+2 this week",
      tone: "warning" as const,
    },
    {
      label: "Tips under review",
      value: String(underReviewTips),
      change: "7 received in 24h",
      tone: "neutral" as const,
    },
    {
      label: "Escalated leads",
      value: String(escalatedLeads),
      change: "4 require action",
      tone: "positive" as const,
    },
    {
      label: "Unread alerts",
      value: String(unreadNotifications),
      change: "Live queue",
      tone: "neutral" as const,
    },
  ];
}

export async function getSightingMarkers() {
  const { leads } = await getSnapshot();

  return leads.map((lead) => ({
    id: lead.id,
    title: lead.title,
    latitude: lead.location.latitude,
    longitude: lead.location.longitude,
    status: lead.status,
    source: lead.sourceLabel,
    caseId: lead.caseId,
    occurredAt: lead.occurredAt,
  }));
}

export function searchCases(query: string, cases: DemoCase[]) {
  if (!query) {
    return cases;
  }

  const term = query.toLowerCase();

  return cases.filter((entry) =>
    [entry.fullName, entry.nickname, entry.city, entry.county, ...entry.keywords]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(term)),
  );
}

export function filterLeadsByStatus(status: string, leads: DemoLead[]) {
  return status === "ALL" ? leads : leads.filter((lead) => lead.status === status);
}

export function filterTipsByStatus(status: string, tips: DemoTip[]) {
  return status === "ALL" ? tips : tips.filter((tip) => tip.status === status);
}

export function filterHitsBySource(source: string, hits: DemoMonitoringHit[]) {
  return source === "ALL" ? hits : hits.filter((hit) => hit.source === source);
}
