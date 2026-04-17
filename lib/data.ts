import {
  demoCases,
  demoLeads,
  demoMonitoringHits,
  demoNotifications,
  demoTips,
  demoUsers,
} from "@/lib/mock-data";
import { type DemoCase, type DemoLead, type DemoMonitoringHit, type DemoTip } from "@/lib/types";

export async function getUsers() {
  return demoUsers;
}

export async function getUserByEmail(email: string) {
  return demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getPublicCases() {
  return demoCases.filter((entry) => entry.privacyLevel !== "PRIVATE");
}

export async function getCases() {
  return demoCases;
}

export async function getCaseBySlug(slug: string) {
  return demoCases.find((entry) => entry.slug === slug) ?? null;
}

export async function getCaseById(id: string) {
  return demoCases.find((entry) => entry.id === id) ?? null;
}

export async function getTips(caseId?: string) {
  return caseId ? demoTips.filter((entry) => entry.caseId === caseId) : demoTips;
}

export async function getMonitoringHits(caseId?: string) {
  return caseId
    ? demoMonitoringHits.filter((entry) => entry.caseId === caseId)
    : demoMonitoringHits;
}

export async function getLeads(caseId?: string) {
  return caseId ? demoLeads.filter((entry) => entry.caseId === caseId) : demoLeads;
}

export async function getNotifications() {
  return demoNotifications;
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
  const activeCases = demoCases.filter((entry) => entry.status === "ACTIVE").length;
  const escalatedLeads = demoLeads.filter((entry) => entry.status === "ESCALATED").length;
  const underReviewTips = demoTips.filter((entry) => entry.status === "UNDER_REVIEW").length;
  const unreadNotifications = demoNotifications.filter((entry) => !entry.read).length;

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
  return demoLeads.map((lead) => ({
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
