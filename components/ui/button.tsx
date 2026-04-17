import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-teal-500 text-zinc-950 shadow-[0_14px_35px_-18px_rgba(45,212,191,0.85)] hover:bg-teal-400",
        secondary:
          "bg-white/80 text-zinc-900 ring-1 ring-zinc-200/70 backdrop-blur hover:bg-white dark:bg-white/10 dark:text-zinc-50 dark:ring-white/10 dark:hover:bg-white/15",
        ghost:
          "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10",
        outline:
          "border border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-50 dark:hover:bg-white/10",
        destructive:
          "bg-rose-500 text-white shadow-[0_14px_35px_-18px_rgba(244,63,94,0.85)] hover:bg-rose-400",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
