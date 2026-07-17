"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, User } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { useCountdown } from "@/hooks/useCountdown";
import { electionPhase, formatDateTime, shortAddress } from "@/lib/utils";

function CountdownLine({ election, phase }) {
  const target = phase === "upcoming" ? election.startTime : election.endTime;
  const { days, hours, minutes, done } = useCountdown(target);

  if (phase === "closed" || done) {
    return <span>Ended {formatDateTime(election.endTime)}</span>;
  }
  const parts = [days && `${days}d`, `${hours}h`, `${minutes}m`].filter(Boolean).join(" ");
  return (
    <span>
      {phase === "upcoming" ? "Opens in" : "Closes in"} {parts}
    </span>
  );
}

export default function ElectionCard({ election }) {
  const phase = electionPhase(election);

  return (
    <Link
      href={`/elections/${election.id}`}
      className="surface surface-hover group flex flex-col p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <StatusBadge election={election} />
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-balance">
        {election.name || "Untitled election"}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
        {election.purpose || "No description provided."}
      </p>

      <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          <CountdownLine election={election} phase={phase} />
        </div>
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5" />
          <span className="font-mono">{shortAddress(election.organizer)}</span>
        </div>
      </div>
    </Link>
  );
}
