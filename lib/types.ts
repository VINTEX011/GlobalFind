export type UserRole = "GUEST" | "FAMILY" | "ADMIN" | "MODERATOR";
export type CaseStatus = "ACTIVE" | "FOUND" | "ARCHIVED";
export type TipStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "DISMISSED"
  | "ESCALATED";
export type LeadSource = "FACEBOOK" | "INSTAGRAM" | "X" | "WEB" | "MANUAL";
export type ReviewDecision = "APPROVED" | "REJECTED" | "NEEDS_MORE_INFO";
export type PrivacyLevel = "PUBLIC" | "LIMITED" | "PRIVATE";
export type LeadStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ESCALATED";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  title: string;
  organization: string;
  avatarUrl: string;
  phone: string;
};

export type DemoLocation = {
  id: string;
  label: string;
  address: string;
  city: string;
  county: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type DemoCaseImage = {
  id: string;
  url: string;
  caption: string;
  isPrimary?: boolean;
};

export type DemoCaseUpdate = {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  visibility: PrivacyLevel;
  actor: string;
};

export type DemoTip = {
  id: string;
  caseId: string;
  description: string;
  imageUrl?: string;
  seenAt: string;
  location: DemoLocation;
  reporterName?: string;
  reporterContact?: string;
  anonymous: boolean;
  confidence: number;
  status: TipStatus;
  similarityScore?: number;
  similarityNotes?: string;
  createdAt: string;
};

export type DemoMonitoringHit = {
  id: string;
  caseId: string;
  source: LeadSource;
  sourceLabel: string;
  query: string;
  textSnippet: string;
  handle?: string;
  url: string;
  timestamp: string;
  location: DemoLocation;
  mediaThumbnailUrl?: string;
  confidenceScore: number;
  reviewStatus: LeadStatus;
};

export type DemoLead = {
  id: string;
  caseId: string;
  title: string;
  snippet: string;
  source: LeadSource;
  sourceLabel: string;
  confidenceScore: number;
  similarityScore?: number;
  status: LeadStatus;
  occurredAt: string;
  handle?: string;
  url?: string;
  mediaThumbnailUrl?: string;
  location: DemoLocation;
  notes: string;
  audit: {
    id: string;
    at: string;
    actor: string;
    action: string;
    details: string;
  }[];
};

export type DemoCase = {
  id: string;
  slug: string;
  fullName: string;
  nickname?: string;
  age: number;
  gender: string;
  status: CaseStatus;
  privacyLevel: PrivacyLevel;
  lastSeenAt: string;
  lastSeenLocation: DemoLocation;
  city: string;
  county: string;
  country: string;
  physicalDescription: string;
  clothingDescription: string;
  distinguishingFeatures: string;
  summary: string;
  emergencyContact: string;
  policeReference?: string;
  consentGiven: boolean;
  ownerId: string;
  ownerName: string;
  images: DemoCaseImage[];
  updates: DemoCaseUpdate[];
  keywords: string[];
};

export type DemoNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
};

export type DemoStat = {
  label: string;
  value: string;
  change: string;
  tone: "positive" | "warning" | "neutral";
};
