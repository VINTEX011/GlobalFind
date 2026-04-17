"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="system"
          toastOptions={{
            classNames: {
              toast:
                "rounded-lg border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/40",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
