import { Badge } from "@/components/ui/badge";
import { electionPhase } from "@/lib/utils";

const LABELS = { live: "Live", upcoming: "Upcoming", closed: "Closed" };

export default function StatusBadge({ election, className }) {
  const phase = electionPhase(election);
  return (
    <Badge variant={phase} className={className}>
      {phase === "live" && <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />}
      {LABELS[phase]}
    </Badge>
  );
}
