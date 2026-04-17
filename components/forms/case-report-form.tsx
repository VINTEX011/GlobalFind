"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type CaseFormValues, caseSchema } from "@/lib/validations/case";

export function CaseReportForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      fullName: "",
      nickname: "",
      age: 0,
      gender: "",
      lastSeenDate: "",
      lastSeenTime: "",
      lastSeenLocation: "",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      physicalDescription: "",
      clothingDescription: "",
      distinguishingFeatures: "",
      summary: "",
      emergencyContact: "",
      policeReference: "",
      privacyLevel: "PUBLIC",
      consent: false,
    },
  });
  const consent = useWatch({ control: form.control, name: "consent" });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);

    const response = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      toast.error("Case report failed", {
        description: payload.message ?? "Please review the case file fields and try again.",
      });
      return;
    }

    toast.success("Case file created", {
      description:
        "The case has been added to the secure intake queue. Images and monitoring adapters can be expanded from the dashboard.",
    });
    form.reset();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing person intake</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" {...form.register("fullName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname / alias</Label>
              <Input id="nickname" {...form.register("nickname")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...form.register("age", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" {...form.register("gender")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-seen-date">Last seen date</Label>
              <Input id="last-seen-date" type="date" {...form.register("lastSeenDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-seen-time">Last seen time</Label>
              <Input id="last-seen-time" type="time" {...form.register("lastSeenTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-seen-location">Last seen location</Label>
              <Input id="last-seen-location" {...form.register("lastSeenLocation")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...form.register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Input id="county" {...form.register("county")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...form.register("country")} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="physical-description">Physical description</Label>
              <Textarea id="physical-description" {...form.register("physicalDescription")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clothing-description">Clothing description</Label>
              <Textarea id="clothing-description" {...form.register("clothingDescription")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Distinguishing features</Label>
              <Textarea id="features" {...form.register("distinguishingFeatures")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Case summary</Label>
            <Textarea id="summary" {...form.register("summary")} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergency-contact">Emergency contact</Label>
              <Input id="emergency-contact" {...form.register("emergencyContact")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="police-reference">Police reference / OB number</Label>
              <Input id="police-reference" {...form.register("policeReference")} />
            </div>
            <div className="space-y-2">
              <Label>Privacy setting</Label>
              <Controller
                control={form.control}
                name="privacyLevel"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="LIMITED">Limited</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-images">Upload up to 6 images</Label>
            <Input id="case-images" type="file" accept="image/*" multiple />
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-zinc-200/80 p-4 dark:border-white/10">
            <Checkbox
              checked={consent}
              onCheckedChange={(checked) => form.setValue("consent", Boolean(checked))}
            />
            <div>
              <p className="text-sm font-medium text-zinc-950 dark:text-white">
                I confirm I have lawful authority and consent to submit this case.
              </p>
              <p className="mt-1 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                TraceLink does not identify strangers across the internet. All image similarity is limited to this case and treated only as a possible lead.
              </p>
            </div>
          </label>

          <Button type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : null}
            Create case file
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
