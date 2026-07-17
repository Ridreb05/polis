import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/10 text-primary-foreground/90",
        live: "border-success/30 bg-success/10 text-success",
        upcoming: "border-amber-400/30 bg-amber-400/10 text-amber-300",
        closed: "border-white/10 bg-white/[0.04] text-muted-foreground",
        outline: "border-white/12 bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
