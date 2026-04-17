import { format, formatDistanceToNowStrict } from "date-fns";

import {
  type CaseStatus,
  type LeadSource,
  type LeadStatus,
  type TipStatus,
} from "@/lib/types";

export function formatDateTime(
  value: string | Date,
  pattern = "MMM d, yyyy 'at' HH:mm",
) {
  return format(new Date(value), pattern);
}

export function formatRelativeTime(value: string | Date) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function formatCaseStatus(status: CaseStatus) {
  const labels: Record<CaseStatus, string> = {
    ACTIVE: "Active case",
    FOUND: "Found",
    ARCHIVED: "Archived",
  };

  return labels[status];
}

export function formatTipStatus(status: TipStatus) {
  const labels: Record<TipStatus, string> = {
    NEW: "New",
    UNDER_REVIEW: "Under review",
    VERIFIED: "Verified",
    DISMISSED: "Dismissed",
    ESCALATED: "Escalated",
  };

  return labels[status];
}

export function formatLeadSource(source: LeadSource) {
  const labels: Record<LeadSource, string> = {
    FACEBOOK: "Facebook",
    INSTAGRAM: "Instagram",
    X: "X",
    WEB: "Web",
    MANUAL: "Manual import",
  };

  return labels[source];
}

export function formatLeadStatus(status: LeadStatus) {
  const labels: Record<LeadStatus, string> = {
    NEW: "New",
    UNDER_REVIEW: "Under review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ESCALATED: "Escalated",
  };

  return labels[status];
}
