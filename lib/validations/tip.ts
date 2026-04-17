import { z } from "zod";

export const tipSchema = z.object({
  caseId: z.string().min(1, "Select a case."),
  description: z.string().min(20, "Describe what you saw in more detail."),
  seenDate: z.string().min(1, "Date is required."),
  seenTime: z.string().min(1, "Time is required."),
  location: z.string().min(2, "Location is required."),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
  anonymous: z.boolean(),
  contactInfo: z.string().optional(),
});

export type TipFormValues = z.infer<typeof tipSchema>;
