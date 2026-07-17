"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[3.25rem] rounded-xl border border-white/10 bg-ink-800/70 px-2 py-2 text-center font-display text-2xl font-bold tabular-nums text-foreground">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ target, className, onComplete }) {
  const { days, hours, minutes, seconds, done } = useCountdown(target);

  if (done) {
    return (
      <div className={cn("text-sm font-medium text-muted-foreground", className)}>
        {onComplete ?? "Time elapsed"}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {days > 0 && <Unit value={days} label="Days" />}
      <Unit value={hours} label="Hrs" />
      <Unit value={minutes} label="Min" />
      <Unit value={seconds} label="Sec" />
    </div>
  );
}
