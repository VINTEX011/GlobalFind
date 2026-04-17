"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { loginSchema } from "@/lib/validations/auth";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: DEMO_CREDENTIALS[0].email,
      password: DEMO_CREDENTIALS[0].password,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);

    const response = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    });

    setSubmitting(false);

    if (response?.error) {
      toast.error("Access denied", {
        description: "Check the credentials or use one of the seeded demo accounts.",
      });
      return;
    }

    toast.success("Signed in", {
      description: "Welcome back to TraceLink.",
    });
    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/90 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Demo access
          </p>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {DEMO_CREDENTIALS.map((credential) => (
              <p key={credential.email}>
                {credential.role}: {credential.email} / {credential.password}
              </p>
            ))}
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-sm text-rose-500">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password ? (
              <p className="text-sm text-rose-500">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : null}
            Continue to dashboard
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
