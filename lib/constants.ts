export const APP_NAME = "TraceLink";
export const APP_TAGLINE = "Helping communities find missing people faster.";

export const DEMO_CREDENTIALS = [
  {
    role: "Admin",
    email: "admin@tracelink.org",
    password: "TraceLink!2026",
  },
  {
    role: "Family",
    email: "amelia@family.tracelink.org",
    password: "TraceLink!2026",
  },
] as const;

export const PUBLIC_ACTIONS = [
  {
    title: "Report Missing Person",
    href: "/report",
    description:
      "Create a secure case file with verified family ownership, timeline notes, and last-seen intelligence.",
  },
  {
    title: "Submit a Tip",
    href: "/submit-tip",
    description:
      "Share a sighting, photo, or location clue with structured details that investigators can review quickly.",
  },
  {
    title: "Browse Cases",
    href: "/cases",
    description:
      "View active public cases, trusted last-seen details, and case posters that communities can circulate fast.",
  },
] as const;

export const MONITORING_ADAPTERS = [
  "Keyword watchlists",
  "Hashtag tracking",
  "Nickname search",
  "Place search",
  "Manual source import",
];
