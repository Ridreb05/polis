"use client";

import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useToast, dismiss } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ICONS = {
  default: Info,
  success: CheckCircle2,
  destructive: AlertTriangle,
};

const ACCENT = {
  default: "text-primary",
  success: "text-success",
  destructive: "text-destructive",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((t) => {
        const Icon = ICONS[t.variant] ?? Info;
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-popover/90 p-4 shadow-glow backdrop-blur-xl animate-fade-up"
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", ACCENT[t.variant] ?? ACCENT.default)} />
            <div className="flex-1">
              {t.title && <p className="text-sm font-semibold text-foreground">{t.title}</p>}
              {t.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toaster;
