import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="section-shell grid gap-4 px-4 py-16">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="h-40 animate-pulse bg-zinc-100 dark:bg-white/5" />
        </Card>
      ))}
    </main>
  );
}
