import { demoCases, demoLeads, demoMonitoringHits, demoTips } from "@/lib/mock-data";

export async function getAnalyticsSnapshot() {
  return {
    activeCases: demoCases.filter((entry) => entry.status === "ACTIVE").length,
    foundCases: demoCases.filter((entry) => entry.status === "FOUND").length,
    totalTips: demoTips.length,
    totalMonitoringHits: demoMonitoringHits.length,
    totalLeads: demoLeads.length,
    escalatedLeads: demoLeads.filter((entry) => entry.status === "ESCALATED").length,
  };
}
