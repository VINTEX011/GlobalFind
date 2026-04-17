import { clamp } from "@/lib/utils";

export async function compareCaseImageToTipImage(caseId: string, tipId: string) {
  const seed = `${caseId}:${tipId}`;
  const hash = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);
  const score = clamp((hash % 38) / 100 + 0.42, 0.42, 0.8);

  return {
    score,
    notes:
      "Possible similarity only. This score is limited to images already attached to the same case and always requires manual review.",
  };
}
