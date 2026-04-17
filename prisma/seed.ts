import { hash } from "bcryptjs";
import {
  CaseStatus,
  LeadSource,
  LeadStatus,
  NotificationType,
  PrismaClient,
  PrivacyLevel,
  ReviewDecision,
  TipStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

const locations = [
  ["loc-eastleigh", "Eastleigh Section 1", "General Waruinge Street", "Nairobi", "Nairobi", "Kenya", -1.2758, 36.8502],
  ["loc-nairobi-cbd", "Nairobi CBD", "Tom Mboya Street", "Nairobi", "Nairobi", "Kenya", -1.2833, 36.8219],
  ["loc-westlands", "Westlands", "Ring Road Westlands", "Nairobi", "Nairobi", "Kenya", -1.2675, 36.8108],
  ["loc-thika-road", "Thika Road Mall", "TRM Drive", "Nairobi", "Nairobi", "Kenya", -1.2312, 36.8772],
  ["loc-syokimau", "Syokimau Station", "Mombasa Road Spur", "Nairobi", "Machakos", "Kenya", -1.3576, 36.9157],
  ["loc-old-town", "Old Town", "Mbarak Hinawy Road", "Mombasa", "Mombasa", "Kenya", -4.0524, 39.6731],
  ["loc-nyali", "Nyali Centre", "Links Road", "Mombasa", "Mombasa", "Kenya", -4.0334, 39.6988],
  ["loc-diani", "Diani Beach Road", "Ukunda", "Kwale", "Kwale", "Kenya", -4.2803, 39.5942],
  ["loc-kisumu-bus-park", "Kisumu Bus Park", "Oginga Odinga Street", "Kisumu", "Kisumu", "Kenya", -0.1015, 34.7617],
  ["loc-milimani", "Milimani", "Achieng Oneko Road", "Kisumu", "Kisumu", "Kenya", -0.0898, 34.7554],
  ["loc-kakamega", "Kakamega Bus Stage", "Kenyatta Avenue", "Kakamega", "Kakamega", "Kenya", 0.2827, 34.7519],
  ["loc-eldoret-market", "Eldoret Main Market", "Uganda Road", "Eldoret", "Uasin Gishu", "Kenya", 0.5143, 35.2698],
  ["loc-eldoret-town", "Eldoret CBD", "Oloo Street", "Eldoret", "Uasin Gishu", "Kenya", 0.5204, 35.2699],
  ["loc-nakuru-town", "Nakuru Town East", "Kenyatta Avenue", "Nakuru", "Nakuru", "Kenya", -0.2833, 36.0667],
  ["loc-machakos", "Machakos Bus Park", "Mwatu wa Ngoma Road", "Machakos", "Machakos", "Kenya", -1.5177, 37.2634],
] as const;

async function main() {
  const passwordHash = await hash("TraceLink!2026", 10);

  await prisma.review.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.monitoringHit.deleteMany();
  await prisma.monitoringSource.deleteMany();
  await prisma.tip.deleteMany();
  await prisma.caseUpdate.deleteMany();
  await prisma.caseImage.deleteMany();
  await prisma.case.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  await prisma.organization.create({
    data: {
      id: "org-tracelink-response",
      name: "TraceLink Response Desk",
      slug: "tracelink-response",
      contactEmail: "ops@tracelink.org",
    },
  });

  const users = [
    ["user-admin-1", "Grace Wanjiku", "admin@tracelink.org", UserRole.ADMIN, "Head of operations", "https://i.pravatar.cc/160?img=32", "Nairobi"],
    ["user-admin-2", "Samuel Otieno", "moderator@tracelink.org", UserRole.MODERATOR, "Lead moderator", "https://i.pravatar.cc/160?img=58", "Nairobi"],
    ["user-admin-3", "Leah Kipkurui", "admin2@tracelink.org", UserRole.ADMIN, "Platform security manager", "https://i.pravatar.cc/160?img=47", "Nairobi"],
    ["user-family-1", "Amelia Hassan", "amelia@family.tracelink.org", UserRole.FAMILY, "Case owner", "https://i.pravatar.cc/160?img=5", "Nairobi"],
    ["user-family-2", "Peter Mwangi", "peter@family.tracelink.org", UserRole.FAMILY, "Case owner", "https://i.pravatar.cc/160?img=68", "Nairobi"],
    ["user-family-3", "Janet Atieno", "janet@family.tracelink.org", UserRole.FAMILY, "Case owner", "https://i.pravatar.cc/160?img=23", "Kisumu"],
  ] as const;

  await prisma.user.createMany({
    data: users.map(([id, name, email, role, title]) => ({
      id,
      name,
      email,
      passwordHash,
      role,
      title,
      organizationId: role === UserRole.FAMILY ? null : "org-tracelink-response",
    })),
  });

  await prisma.profile.createMany({
    data: users.map(([id, , , , , avatarUrl, city], index) => ({
      userId: id,
      avatarUrl,
      city,
      country: "Kenya",
      phone: `+254700${String(index + 1).padStart(6, "0")}`,
    })),
  });

  await prisma.location.createMany({
    data: locations.map(([id, label, address, city, county, country, latitude, longitude]) => ({
      id,
      label,
      address,
      city,
      county,
      country,
      latitude,
      longitude,
    })),
  });

  const cases = [
    ["case-amina-hassan", "amina-hassan-2026", "Amina Hassan", "Mina", 16, "Female", "2026-03-28T15:40:00.000Z", "loc-eastleigh", "Nairobi", "Nairobi", "Kenya", "Slim build, brown eyes, braided hair.", "Black hoodie, grey trousers, white sneakers, navy backpack.", "Small scar above left eyebrow.", "Amina left tuition in Eastleigh and never arrived home.", "Amelia Hassan · +254 722 601 300", "OB 47/28/03/2026", PrivacyLevel.PUBLIC, CaseStatus.ACTIVE, "user-family-1"],
    ["case-daniel-mwangi", "daniel-mwangi-2026", "Daniel Mwangi", "Dan", 22, "Male", "2026-04-04T18:15:00.000Z", "loc-old-town", "Mombasa", "Mombasa", "Kenya", "Athletic build, trimmed beard, brown eyes.", "Olive overshirt, black T-shirt, faded jeans.", "Compass tattoo on right forearm.", "Daniel missed scheduled transport back to Nairobi and has not checked in since.", "Peter Mwangi · +254 733 204 817", "OB 19/05/04/2026", PrivacyLevel.PUBLIC, CaseStatus.ACTIVE, "user-family-2"],
    ["case-faith-atieno", "faith-atieno-2026", "Faith Atieno", "Fifi", 13, "Female", "2026-03-19T14:30:00.000Z", "loc-kisumu-bus-park", "Kisumu", "Kisumu", "Kenya", "Slight build, braided hair with blue beads.", "Maroon school sweater, navy skirt, pink folder.", "Gap between front teeth.", "Faith was separated from a relative at Kisumu Bus Park while traveling from school.", "Janet Atieno · +254 712 995 160", "OB 08/19/03/2026", PrivacyLevel.PUBLIC, CaseStatus.ACTIVE, "user-family-3"],
    ["case-kelvin-kiptoo", "kelvin-kiptoo-2026", "Kelvin Kiptoo", "Kelvo", 31, "Male", "2026-04-08T03:50:00.000Z", "loc-eldoret-market", "Eldoret", "Uasin Gishu", "Kenya", "Lean build, close-cut hair, glasses when reading.", "Reflective blue work jacket, charcoal joggers, black cap.", "Noticeable limp on the right leg.", "Kelvin disappeared after an early-morning delivery run through Eldoret market.", "Peter Mwangi · +254 733 204 817", "OB 13/08/04/2026", PrivacyLevel.LIMITED, CaseStatus.ACTIVE, "user-family-2"],
    ["case-ruth-njeri", "ruth-njeri-2026", "Ruth Njeri", "Ruthie", 27, "Female", "2026-04-10T05:10:00.000Z", "loc-thika-road", "Nairobi", "Nairobi", "Kenya", "Medium build, natural hair tied back, brown eyes.", "Cream trench coat, dark blue blouse, black trousers.", "Silver nose stud and tiny heart tattoo near left wrist.", "Ruth was reported missing after leaving a bus terminus on Thika Road.", "Amelia Hassan · +254 722 601 300", "OB 31/10/04/2026", PrivacyLevel.LIMITED, CaseStatus.FOUND, "user-family-1"],
  ] as const;

  await prisma.case.createMany({
    data: cases.map(
      ([
        id,
        slug,
        fullName,
        nickname,
        age,
        gender,
        lastSeenAt,
        lastSeenLocationId,
        city,
        county,
        country,
        physicalDescription,
        clothingDescription,
        distinguishingFeatures,
        summary,
        emergencyContact,
        policeReference,
        privacyLevel,
        status,
        ownerId,
      ]) => ({
        id,
        slug,
        fullName,
        nickname,
        age,
        gender,
        lastSeenAt: new Date(lastSeenAt),
        lastSeenLocationId,
        city,
        county,
        country,
        physicalDescription,
        clothingDescription,
        distinguishingFeatures,
        summary,
        emergencyContact,
        policeReference,
        consentGiven: true,
        privacyLevel,
        status,
        ownerId,
      }),
    ),
  });

  await prisma.caseImage.createMany({
    data: [
      { caseId: "case-amina-hassan", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80", altText: "Amina primary", isPrimary: true, sortOrder: 0 },
      { caseId: "case-daniel-mwangi", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80", altText: "Daniel primary", isPrimary: true, sortOrder: 0 },
      { caseId: "case-faith-atieno", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80", altText: "Faith primary", isPrimary: true, sortOrder: 0 },
      { caseId: "case-kelvin-kiptoo", url: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=1200&q=80", altText: "Kelvin primary", isPrimary: true, sortOrder: 0 },
      { caseId: "case-ruth-njeri", url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80", altText: "Ruth primary", isPrimary: true, sortOrder: 0 },
    ],
  });

  await prisma.caseUpdate.createMany({
    data: [
      { caseId: "case-amina-hassan", title: "Case opened", body: "Initial report verified with family contact and police reference.", visibility: PrivacyLevel.PUBLIC, createdById: "user-admin-1" },
      { caseId: "case-daniel-mwangi", title: "Port corridor watchlist added", body: "Monitoring terms expanded to include ferry stage and Old Town place mentions.", visibility: PrivacyLevel.LIMITED, createdById: "user-admin-2" },
      { caseId: "case-faith-atieno", title: "Bus corridor alerts issued", body: "Volunteer network alerted across Kisumu and Kakamega transport corridor.", visibility: PrivacyLevel.PUBLIC, createdById: "user-admin-2" },
      { caseId: "case-kelvin-kiptoo", title: "Market CCTV window added", body: "Investigators noted a probable route through loading bays before signal loss.", visibility: PrivacyLevel.LIMITED, createdById: "user-admin-1" },
      { caseId: "case-ruth-njeri", title: "Recovered safely", body: "Case status changed to found after family confirmation.", visibility: PrivacyLevel.PUBLIC, createdById: "user-admin-3" },
    ],
  });

  const tipCaseIds = ["case-amina-hassan", "case-daniel-mwangi", "case-faith-atieno", "case-kelvin-kiptoo", "case-ruth-njeri"];
  const tipLocationIds = ["loc-eastleigh", "loc-old-town", "loc-kakamega", "loc-eldoret-market", "loc-syokimau"];
  const tipStatuses = [TipStatus.NEW, TipStatus.UNDER_REVIEW, TipStatus.VERIFIED, TipStatus.DISMISSED, TipStatus.ESCALATED];

  await prisma.tip.createMany({
    data: Array.from({ length: 20 }).map((_, index) => ({
      id: `tip-${String(index + 1).padStart(3, "0")}`,
      caseId: tipCaseIds[index % tipCaseIds.length],
      description: `Seeded tip ${index + 1} with realistic public-sighting detail for moderator review.`,
      seenAt: new Date(`2026-04-${String((index % 12) + 1).padStart(2, "0")}T0${index % 9}:15:00.000Z`),
      locationId: tipLocationIds[index % tipLocationIds.length],
      reporterName: index % 2 === 0 ? `Witness ${index + 1}` : null,
      reporterContact: index % 3 === 0 ? `+25470000${String(index).padStart(3, "0")}` : null,
      anonymous: index % 2 !== 0,
      confidence: 40 + (index % 5) * 10,
      status: tipStatuses[index % tipStatuses.length],
      similarityScore: index % 4 === 0 ? 0.55 + (index % 3) * 0.06 : null,
      similarityNotes: index % 4 === 0 ? "Possible similarity only. Manual review required." : null,
    })),
  });

  const monitoringSourceDefs: Array<[string, string, LeadSource]> = [
    ["src-facebook", "Facebook public watch", LeadSource.FACEBOOK],
    ["src-instagram", "Instagram public watch", LeadSource.INSTAGRAM],
    ["src-x", "X keyword watch", LeadSource.X],
    ["src-web", "Web community board", LeadSource.WEB],
    ["src-manual", "Manual import desk", LeadSource.MANUAL],
  ];

  const monitoringSources = await Promise.all(
    monitoringSourceDefs.map(([id, name, source]) =>
      prisma.monitoringSource.create({ data: { id, name, source, enabled: true } }),
    ),
  );

  const sourceLabels = ["Facebook", "Instagram", "X", "Community web", "Manual import"];
  const hitStatuses = [LeadStatus.NEW, LeadStatus.UNDER_REVIEW, LeadStatus.APPROVED, LeadStatus.ESCALATED];

  await prisma.monitoringHit.createMany({
    data: Array.from({ length: 15 }).map((_, index) => ({
      id: `hit-${String(index + 1).padStart(3, "0")}`,
      caseId: tipCaseIds[index % tipCaseIds.length],
      monitoringSourceId: monitoringSources[index % monitoringSources.length].id,
      source: monitoringSources[index % monitoringSources.length].source,
      sourceLabel: sourceLabels[index % sourceLabels.length],
      query: `Seeded query ${index + 1}`,
      textSnippet: `Seeded monitoring hit ${index + 1} from lawful public-source monitoring.`,
      handle: index % 2 === 0 ? `@seedsource${index + 1}` : null,
      url: `https://example.org/hit/${index + 1}`,
      timestamp: new Date(`2026-04-${String((index % 12) + 1).padStart(2, "0")}T1${index % 9}:10:00.000Z`),
      locationId: tipLocationIds[index % tipLocationIds.length],
      mediaThumbnailUrl: index % 3 === 0 ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" : null,
      confidenceScore: 0.45 + (index % 4) * 0.1,
      reviewStatus: hitStatuses[index % hitStatuses.length],
    })),
  });

  await prisma.lead.createMany({
    data: [
      { id: "lead-001", caseId: "case-amina-hassan", tipId: "tip-003", monitoringHitId: "hit-003", title: "Westlands taxi bay image", snippet: "Tip image shows similar necklace placement and backpack profile.", source: LeadSource.MANUAL, sourceLabel: "Public tip", confidenceScore: 0.66, similarityScore: 0.66, status: LeadStatus.ESCALATED, occurredAt: new Date("2026-03-31T17:10:00.000Z"), mediaThumbnailUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80", locationId: "loc-westlands", notes: "Possible similarity only. Manual review required." },
      { id: "lead-002", caseId: "case-daniel-mwangi", monitoringHitId: "hit-005", title: "Ferry-stage tattoo mention", snippet: "Public post described a traveler with a compass tattoo seeking coach options.", source: LeadSource.X, sourceLabel: "X monitoring", confidenceScore: 0.73, status: LeadStatus.ESCALATED, occurredAt: new Date("2026-04-05T19:25:00.000Z"), handle: "@coastalert", url: "https://example.org/monitoring/x/5", locationId: "loc-old-town", notes: "High-value clue because of the tattoo descriptor." },
      { id: "lead-003", caseId: "case-faith-atieno", tipId: "tip-011", monitoringHitId: "hit-009", title: "Kakamega stage school-sweater sighting", snippet: "Volunteer import and tip report both describe blue beads and a pink folder.", source: LeadSource.MANUAL, sourceLabel: "Manual import", confidenceScore: 0.69, similarityScore: 0.59, status: LeadStatus.APPROVED, occurredAt: new Date("2026-03-22T13:05:00.000Z"), locationId: "loc-kakamega", notes: "Multiple descriptors align despite limited image clarity." },
      { id: "lead-004", caseId: "case-kelvin-kiptoo", tipId: "tip-015", monitoringHitId: "hit-012", title: "Market gate still frame", snippet: "Manual still frame suggests matching jacket color and visible limp pattern.", source: LeadSource.MANUAL, sourceLabel: "Manual import", confidenceScore: 0.76, similarityScore: 0.71, status: LeadStatus.ESCALATED, occurredAt: new Date("2026-04-09T08:30:00.000Z"), locationId: "loc-eldoret-market", notes: "Movement pattern is stronger than facial detail." },
      { id: "lead-005", caseId: "case-ruth-njeri", tipId: "tip-018", monitoringHitId: "hit-013", title: "Syokimau station CCTV still", snippet: "Station desk still aligns strongly with Ruth's clothing and travel timeline.", source: LeadSource.MANUAL, sourceLabel: "Security desk", confidenceScore: 0.82, similarityScore: 0.74, status: LeadStatus.APPROVED, occurredAt: new Date("2026-04-10T07:10:00.000Z"), locationId: "loc-syokimau", notes: "Lead later contributed to safe recovery confirmation." },
    ],
  });

  await prisma.review.createMany({
    data: [
      { leadId: "lead-001", reviewerId: "user-admin-2", decision: ReviewDecision.NEEDS_MORE_INFO, notes: "Need venue CCTV and second corroborating witness." },
      { leadId: "lead-002", reviewerId: "user-admin-3", decision: ReviewDecision.APPROVED, notes: "Descriptor is strong enough for field follow-up." },
      { leadId: "lead-004", reviewerId: "user-admin-1", decision: ReviewDecision.APPROVED, notes: "Escalated to field investigators and family owner." },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      { actorId: "user-admin-2", leadId: "lead-001", entityType: "Lead", entityId: "lead-001", action: "Lead escalated", details: { reason: "Possible similarity only. Manual review required." } },
      { actorId: "user-admin-3", leadId: "lead-002", entityType: "Lead", entityId: "lead-002", action: "Lead approved for field follow-up", details: { scope: "Coastal volunteer network" } },
      { actorId: "user-admin-1", leadId: "lead-004", entityType: "Lead", entityId: "lead-004", action: "Lead escalated", details: { scope: "Immediate field review" } },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: "user-family-1", type: NotificationType.LEAD, title: "Escalated lead for Amina Hassan", body: "Westlands image lead reached manual-review threshold.", href: "/dashboard/cases/case-amina-hassan" },
      { userId: "user-admin-1", type: NotificationType.TIP, title: "New monitoring hit for Daniel Mwangi", body: "High-confidence ferry-stage post added to review queue.", href: "/dashboard/monitoring" },
      { userId: "user-family-3", type: NotificationType.STATUS, title: "Faith Atieno lead approved", body: "Kakamega stage search radius expanded after moderator review.", href: "/dashboard/tips" },
      { userId: "user-family-2", type: NotificationType.SYSTEM, title: "Kelvin Kiptoo monitoring terms updated", body: "Route watchlist now includes Nakuru transport channels.", href: "/dashboard/monitoring" },
      { userId: "user-family-1", type: NotificationType.STATUS, title: "Ruth Njeri case archived to family records", body: "Case poster and timeline remain available for audit history.", href: "/dashboard/cases/case-ruth-njeri" },
    ],
  });

  console.log("TraceLink seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
