"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Trophy, Loader2, BarChart3, Users, Vote } from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { electionPhase, shortAddress } from "@/lib/utils";

export default function ResultsPage() {
  const { id } = useParams();
  const { getElection, getApprovedCandidates } = usePolis();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [e, c] = await Promise.all([getElection(id), getApprovedCandidates(id)]);
      setElection(e);
      setCandidates(c);
    } catch {
      setElection(false);
    } finally {
      setLoading(false);
    }
  }, [id, getElection, getApprovedCandidates]);

  useEffect(() => {
    load();
  }, [load]);

  const { ranked, totalVotes, leader } = useMemo(() => {
    const ranked = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
    const totalVotes = ranked.reduce((s, c) => s + c.voteCount, 0);
    const top = ranked[0];
    const tie = ranked.filter((c) => c.voteCount === top?.voteCount).length > 1;
    const leader = top && top.voteCount > 0 && !tie ? top : null;
    return { ranked, totalVotes, leader };
  }, [candidates]);

  if (loading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Election not found</h1>
        <Button asChild className="mt-6">
          <Link href="/elections">Back to elections</Link>
        </Button>
      </div>
    );
  }

  const phase = electionPhase(election);
  const closed = phase === "closed";

  return (
    <div className="container-page max-w-3xl py-12">
      <Link
        href={`/elections/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to election
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{election.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {closed ? "Final results" : "Live standings"}
          </p>
        </div>
        <StatusBadge election={election} />
      </div>

      {/* Winner banner */}
      {closed && leader && (
        <div className="surface relative mb-6 overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.09]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Winner</p>
              <p className="font-display text-2xl font-bold">{leader.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {shortAddress(leader.address)} · {leader.voteCount} votes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stat row */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Stat icon={Vote} label="Total votes" value={totalVotes} />
        <Stat icon={Users} label="Nominees" value={ranked.length} />
        <Stat
          icon={BarChart3}
          label="Leader share"
          value={totalVotes ? `${Math.round(((ranked[0]?.voteCount || 0) / totalVotes) * 100)}%` : "—"}
        />
      </div>

      {/* Bars */}
      {ranked.length === 0 ? (
        <EmptyState icon={BarChart3} title="No approved nominees" description="Nothing to tally yet." />
      ) : (
        <div className="surface space-y-5 p-6">
          {ranked.map((c, i) => {
            const pct = totalVotes ? (c.voteCount / totalVotes) * 100 : 0;
            const isLeader = closed && leader?.address === c.address;
            return (
              <div key={c.address}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    {c.name}
                    {isLeader && <Trophy className="h-3.5 w-3.5 text-primary" />}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {c.voteCount} · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-800">
                  <div
                    className={
                      "h-full rounded-full transition-all duration-700 " +
                      (isLeader ? "bg-brand-gradient" : "bg-primary/50")
                    }
                    style={{ width: `${Math.max(pct, c.voteCount > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!closed && (
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Standings update as votes come in. Final results are locked once the steward closes the election.
        </p>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="surface p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 font-display text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
