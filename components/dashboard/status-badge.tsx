import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const variant =
    normalized === "ACTIVE" || normalized === "APPROVED" || normalized === "VERIFIED"
      ? "active"
      : normalized === "ESCALATED" || normalized === "UNDER_REVIEW"
        ? "warning"
        : normalized === "DISMISSED" || normalized === "REJECTED" || normalized === "ARCHIVED"
          ? "muted"
          : normalized === "FOUND"
            ? "active"
            : "default";

  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}
