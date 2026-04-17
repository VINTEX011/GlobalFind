import { z } from "zod";

export const leadReviewSchema = z.object({
  leadId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED", "NEEDS_MORE_INFO"]),
  notes: z.string().min(8, "Review notes are required."),
});
