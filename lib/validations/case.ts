import { z } from "zod";

export const caseSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  nickname: z.string().optional(),
  age: z.number().min(0).max(120),
  gender: z.string().min(1, "Gender is required."),
  lastSeenDate: z.string().min(1, "Last seen date is required."),
  lastSeenTime: z.string().min(1, "Last seen time is required."),
  lastSeenLocation: z.string().min(2, "Last seen location is required."),
  city: z.string().min(2, "City is required."),
  county: z.string().min(2, "County is required."),
  country: z.string().min(2, "Country is required."),
  physicalDescription: z.string().min(16, "Add a physical description."),
  clothingDescription: z.string().min(16, "Add clothing details."),
  distinguishingFeatures: z.string().min(16, "Add distinguishing features."),
  summary: z.string().min(24, "Provide a short case summary."),
  emergencyContact: z.string().min(6, "Emergency contact is required."),
  policeReference: z.string().optional(),
  privacyLevel: z.enum(["PUBLIC", "LIMITED", "PRIVATE"]),
  consent: z.boolean().refine(Boolean, "Consent is required."),
});

export type CaseFormValues = z.infer<typeof caseSchema>;
