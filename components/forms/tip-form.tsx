"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type DemoCase } from "@/lib/types";
import { tipSchema } from "@/lib/validations/tip";

type TipValues = z.infer<typeof tipSchema>;

export function TipForm({
  cases,
  defaultCaseId,
}: {
  cases: DemoCase[];
  defaultCaseId?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [fileResetKey, setFileResetKey] = useState(0);
  const form = useForm<TipValues>({
    resolver: zodResolver(tipSchema),
    defaultValues: {
      caseId: defaultCaseId ?? cases[0]?.id ?? "",
      description: "",
      seenDate: "",
      seenTime: "",
      location: "",
      confidence: "MEDIUM",
      anonymous: false,
      contactInfo: "",
    },
  });
  const anonymous = useWatch({ control: form.control, name: "anonymous" });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    const payload = new FormData();

    payload.append("caseId", values.caseId);
    payload.append("description", values.description);
    payload.append("seenDate", values.seenDate);
    payload.append("seenTime", values.seenTime);
    payload.append("location", values.location);
    payload.append("confidence", values.confidence);
    payload.append("anonymous", String(values.anonymous));
    payload.append("contactInfo", values.contactInfo ?? "");

    if (selectedPhoto) {
      payload.append("photo", selectedPhoto);
    }

    const response = await fetch("/api/tips", {
      method: "POST",
      body: payload,
    });
    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      toast.error("Tip not submitted", {
        description: result.message ?? "Check the form and try again.",
      });
      return;
    }

    toast.success("Tip submitted", {
      description:
        result.lead?.similarityScore
          ? "Thank you. The tip entered review with a case-only possible similarity score for moderators to assess."
          : "Thank you. The tip has entered the manual review queue and will be assessed by TraceLink moderators.",
    });
    form.reset({
      ...form.getValues(),
      description: "",
      seenDate: "",
      seenTime: "",
      location: "",
      contactInfo: "",
      anonymous: false,
    });
    setSelectedPhoto(null);
    setFileResetKey((value) => value + 1);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a structured sighting</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Case</Label>
              <Controller
                control={form.control}
                name="caseId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a case" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((caseRecord) => (
                        <SelectItem key={caseRecord.id} value={caseRecord.id}>
                          {caseRecord.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-info">Contact info</Label>
              <Input
                id="contact-info"
                placeholder="Optional phone number or email"
                {...form.register("contactInfo")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-description">What did you see?</Label>
            <Textarea
              id="tip-description"
              placeholder="Describe the sighting, behavior, clothing, transport, and anything else that can help moderators verify the lead."
              {...form.register("description")}
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-rose-500">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="seen-date">Date seen</Label>
              <Input id="seen-date" type="date" {...form.register("seenDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seen-time">Time seen</Label>
              <Input id="seen-time" type="time" {...form.register("seenTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seen-location">Location</Label>
              <Input
                id="seen-location"
                placeholder="Street, landmark, stage, or neighborhood"
                {...form.register("location")}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Confidence level</Label>
            <Controller
              control={form.control}
              name="confidence"
              render={({ field }) => (
                <RadioGroup
                  className="grid gap-3 sm:grid-cols-3"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  {[
                    {
                      value: "LOW",
                      label: "Low confidence",
                      description: "Loose resemblance or limited detail.",
                    },
                    {
                      value: "MEDIUM",
                      label: "Medium confidence",
                      description: "Several details align but still uncertain.",
                    },
                    {
                      value: "HIGH",
                      label: "High confidence",
                      description: "Strong visual or situational match.",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer gap-3 rounded-lg border border-zinc-200/80 p-4 dark:border-white/10"
                    >
                      <RadioGroupItem value={option.value} />
                      <div>
                        <p className="text-sm font-medium text-zinc-950 dark:text-white">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-photo">Photo upload</Label>
            <Input
              key={fileResetKey}
              id="tip-photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setSelectedPhoto(event.target.files?.[0] ?? null);
              }}
            />
            {selectedPhoto ? (
              <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]">
                <p className="font-medium text-zinc-950 dark:text-white">{selectedPhoto.name}</p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Uploading a sighting photo triggers a case-only possible similarity review.
                </p>
              </div>
            ) : null}
            <p className="text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              Uploading a photo only creates a possible lead for manual review. It never verifies identity.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-zinc-200/80 p-4 dark:border-white/10">
            <Checkbox
              checked={anonymous}
              onCheckedChange={(checked) => form.setValue("anonymous", Boolean(checked))}
            />
            <div>
              <p className="text-sm font-medium text-zinc-950 dark:text-white">
                Submit anonymously
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Moderators can still review the tip without publishing your name or contact details.
              </p>
            </div>
          </label>

          <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : null}
            Send tip to moderators
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
