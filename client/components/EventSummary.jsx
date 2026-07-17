"use client";

import StatusBadge from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/utils";

export default function EventSummary({ election }) {
  if (election === false) {
    return (
      <div className="surface p-5 text-sm text-muted-foreground">Election not found.</div>
    );
  }
  if (!election) {
    return (
      <div className="surface p-5">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton mt-2 h-4 w-full" />
      </div>
    );
  }

  return (
    <div className="surface p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold">{election.name}</h2>
        <StatusBadge election={election} />
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{election.purpose}</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span>Opens {formatDateTime(election.startTime)}</span>
        <span>Closes {formatDateTime(election.endTime)}</span>
      </div>
    </div>
  );
}
