"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Vote,
  UserPlus,
  Users,
  BarChart3,
  Settings2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Lock,
} from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import TxLoader from "@/components/TxLoader";
import StatusBadge from "@/components/StatusBadge";
import Countdown from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import {
  electionPhase,
  formatDateTime,
  shortAddress,
} from "@/lib/utils";
import { explorerAddress } from "@/services/network";

export default function ElectionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    account,
    getElection,
    getCandidates,
    closeElection,
    pending,
  } = usePolis();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      const [e, c] = await Promise.all([getElection(id), getCandidates(id)]);
      setElection(e);
      setCandidates(c);
    } catch (err) {
      setElection(false);
    } finally {
      setLoading(false);
    }
  }, [id, getElection, getCandidates]);

  useEffect(() => {
    load();
  }, [load]);

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (loading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Election not found</h1>
        <p className="mt-2 text-muted-foreground">
          This election doesn&apos;t exist or hasn&apos;t been indexed yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/elections">Back to elections</Link>
        </Button>
      </div>
    );
  }

  const phase = electionPhase(election);
  const isOrganizer = account && account.toLowerCase() === election.organizer.toLowerCase();
  const approved = candidates.filter((c) => c.registered);

  const handleClose = async () => {
    const ok = await closeElection(id);
    if (ok) load();
  };

  return (
    <div className="container-page max-w-5xl py-12">
      <TxLoader />

      <Link
        href="/elections"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All elections
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main */}
        <div className="space-y-6">
          <div className="surface p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <StatusBadge election={election} />
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Share"}
              </button>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-balance">
              {election.name}
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">{election.purpose}</p>

            <dl className="mt-6 grid gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
              <Meta label="Steward">
                <a
                  href={explorerAddress(election.organizer)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-foreground hover:text-primary"
                >
                  {shortAddress(election.organizer)} <ExternalLink className="h-3 w-3" />
                </a>
              </Meta>
              <Meta label="Ballot">{approved.length} approved · {candidates.length} nominated</Meta>
              <Meta label="Voting opens">{formatDateTime(election.startTime)}</Meta>
              <Meta label="Voting closes">{formatDateTime(election.endTime)}</Meta>
            </dl>
          </div>

          {/* Nominees */}
          <div className="surface p-7">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Ballot</h2>
            </div>
            {approved.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No approved nominees yet. Nominees appear here once the steward approves them.
              </p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {approved.map((c) => (
                  <li key={c.address} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {shortAddress(c.address)}
                      </p>
                    </div>
                    {phase === "closed" && (
                      <span className="chip">{c.voteCount} votes</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action sidebar */}
        <aside className="space-y-4">
          <div className="surface p-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {phase === "upcoming"
                ? "Voting opens in"
                : phase === "live"
                ? "Voting closes in"
                : "This election has closed"}
            </p>
            {phase !== "closed" ? (
              <Countdown
                target={phase === "upcoming" ? election.startTime : election.endTime}
                onComplete="Refresh for the latest phase"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" /> Results are final
              </div>
            )}
          </div>

          <div className="surface space-y-2.5 p-6">
            {phase === "upcoming" && (
              <>
                <Button asChild className="w-full">
                  <Link href={`/elections/${id}/join`}>
                    <UserPlus /> Join as a member
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/elections/${id}/nominate`}>
                    <Vote /> Stand as a nominee
                  </Link>
                </Button>
              </>
            )}

            {phase === "live" && (
              <Button asChild className="w-full">
                <Link href={`/elections/${id}/vote`}>
                  <Vote /> Cast your vote
                </Link>
              </Button>
            )}

            <Button asChild variant={phase === "closed" ? "default" : "secondary"} className="w-full">
              <Link href={`/elections/${id}/results`}>
                <BarChart3 /> {phase === "closed" ? "View results" : "Live standings"}
              </Link>
            </Button>

            {isOrganizer && (
              <div className="mt-2 space-y-2.5 border-t border-white/[0.06] pt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-primary/70">
                  Steward tools
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/elections/${id}/manage`}>
                    <Settings2 /> Manage nominees
                  </Link>
                </Button>
                {election.active && phase !== "upcoming" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleClose}
                    disabled={pending}
                  >
                    {pending ? <Loader2 className="animate-spin" /> : <Lock />}
                    Close election
                  </Button>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, children }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
