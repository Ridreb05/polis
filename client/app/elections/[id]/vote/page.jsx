"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Vote,
  Loader2,
  CheckCircle2,
  Lock,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import TxLoader from "@/components/TxLoader";
import EventSummary from "@/components/EventSummary";
import Countdown from "@/components/Countdown";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { electionPhase, shortAddress } from "@/lib/utils";

export default function VotePage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    getElection,
    getApprovedCandidates,
    castVote,
    isMember,
    account,
    isConnected,
    connectWallet,
    pending,
  } = usePolis();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [member, setMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

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

  useEffect(() => {
    if (account) isMember(id, account).then(setMember).catch(() => {});
  }, [id, account, isMember]);

  const handleVote = async () => {
    if (!isConnected) return connectWallet();
    if (!selected) return;
    const ok = await castVote(id, selected);
    if (ok) {
      setVoted(true);
      setTimeout(() => router.push(`/elections/${id}/results`), 1400);
    }
  };

  if (loading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const phase = election ? electionPhase(election) : "closed";

  return (
    <div className="container-page max-w-2xl py-12">
      <TxLoader label="Recording your vote on-chain…" />
      <Link
        href={`/elections/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to election
      </Link>

      <h1 className="font-display text-3xl font-bold tracking-tight">Cast your vote</h1>
      <p className="mt-2 text-muted-foreground">
        One member, one vote. Your choice is final once confirmed on-chain.
      </p>

      <div className="mt-6 space-y-5">
        <EventSummary election={election} />

        {phase === "live" && election && (
          <div className="surface flex items-center justify-between gap-4 p-5">
            <span className="text-sm text-muted-foreground">Voting closes in</span>
            <Countdown target={election.endTime} />
          </div>
        )}

        {/* Gates */}
        {voted ? (
          <EmptyState
            icon={CheckCircle2}
            title="Vote recorded"
            description="Thanks for participating. Taking you to the live standings…"
          />
        ) : phase === "closed" ? (
          <EmptyState
            icon={Lock}
            title="Voting is closed"
            description="This election is no longer accepting votes."
            action={
              <Button asChild>
                <Link href={`/elections/${id}/results`}>View results</Link>
              </Button>
            }
          />
        ) : phase === "upcoming" ? (
          <EmptyState
            icon={Lock}
            title="Voting hasn't opened yet"
            description="Come back when the voting window begins. Make sure you've joined as a member first."
            action={
              <Button asChild variant="secondary">
                <Link href={`/elections/${id}/join`}>Join as a member</Link>
              </Button>
            }
          />
        ) : !isConnected ? (
          <EmptyState
            icon={ShieldAlert}
            title="Connect your wallet"
            description="Connect the wallet you registered with to cast your vote."
            action={<Button onClick={connectWallet}>Connect wallet</Button>}
          />
        ) : !member ? (
          <EmptyState
            icon={UserPlus}
            title="You're not a registered member"
            description="Only members approved with the access key can vote in this election."
            action={
              <Button asChild>
                <Link href={`/elections/${id}/join`}>Join as a member</Link>
              </Button>
            }
          />
        ) : candidates.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No approved nominees"
            description="There are no nominees on the ballot to vote for yet."
          />
        ) : (
          <>
            <fieldset className="space-y-3">
              <legend className="sr-only">Choose a nominee</legend>
              {candidates.map((c) => {
                const active = selected === c.address;
                return (
                  <button
                    key={c.address}
                    type="button"
                    onClick={() => setSelected(c.address)}
                    aria-pressed={active}
                    className={
                      "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all " +
                      (active
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-primary/40")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 " +
                          (active ? "border-primary" : "border-muted-foreground/40")
                        }
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {shortAddress(c.address)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </fieldset>

            <Button onClick={handleVote} disabled={!selected || pending} size="lg" className="w-full">
              {pending ? <Loader2 className="animate-spin" /> : <Vote />}
              {pending ? "Confirming…" : "Submit vote"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
