"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Loader2,
  ShieldAlert,
  UserCheck,
  Clock3,
} from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import TxLoader from "@/components/TxLoader";
import EventSummary from "@/components/EventSummary";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { shortAddress } from "@/lib/utils";
import { explorerAddress } from "@/services/network";

export default function ManagePage() {
  const { id } = useParams();
  const { getElection, getCandidates, approveNominee, account, isConnected, connectWallet, pending } =
    usePolis();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [e, c] = await Promise.all([getElection(id), getCandidates(id)]);
      setElection(e);
      setCandidates(c);
    } catch {
      setElection(false);
    } finally {
      setLoading(false);
    }
  }, [id, getElection, getCandidates]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (address) => {
    setApproving(address);
    const ok = await approveNominee(id, address);
    if (ok) await load();
    setApproving(null);
  };

  if (loading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isOrganizer =
    account && election && account.toLowerCase() === election.organizer.toLowerCase();
  const pendingList = candidates.filter((c) => c.requested && !c.registered);
  const approvedList = candidates.filter((c) => c.registered);

  return (
    <div className="container-page max-w-2xl py-12">
      <TxLoader label="Approving nominee on-chain…" />
      <Link
        href={`/elections/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to election
      </Link>

      <h1 className="font-display text-3xl font-bold tracking-tight">Manage nominees</h1>
      <p className="mt-2 text-muted-foreground">
        Review nominations and approve who appears on the ballot.
      </p>

      <div className="mt-6 space-y-5">
        <EventSummary election={election} />

        {!election ? null : !isConnected ? (
          <EmptyState
            icon={ShieldAlert}
            title="Connect your wallet"
            description="Connect the steward wallet that created this election."
            action={<Button onClick={connectWallet}>Connect wallet</Button>}
          />
        ) : !isOrganizer ? (
          <EmptyState
            icon={ShieldAlert}
            title="Stewards only"
            description="Only the steward who created this election can approve nominees."
          />
        ) : (
          <>
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-amber-300" />
                <h2 className="font-display text-lg font-semibold">Pending approval</h2>
                <Badge variant="upcoming">{pendingList.length}</Badge>
              </div>
              {pendingList.length === 0 ? (
                <div className="surface p-5 text-sm text-muted-foreground">
                  No nominations waiting for review.
                </div>
              ) : (
                <ul className="space-y-3">
                  {pendingList.map((c) => (
                    <li
                      key={c.address}
                      className="surface flex items-center justify-between gap-3 p-4"
                    >
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <a
                          href={explorerAddress(c.address)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-muted-foreground hover:text-primary"
                        >
                          {shortAddress(c.address)}
                        </a>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(c.address)}
                        disabled={pending}
                      >
                        {approving === c.address ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Check />
                        )}
                        Approve
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-success" />
                <h2 className="font-display text-lg font-semibold">On the ballot</h2>
                <Badge variant="live">{approvedList.length}</Badge>
              </div>
              {approvedList.length === 0 ? (
                <div className="surface p-5 text-sm text-muted-foreground">
                  No approved nominees yet.
                </div>
              ) : (
                <ul className="space-y-2">
                  {approvedList.map((c) => (
                    <li
                      key={c.address}
                      className="surface flex items-center justify-between p-4"
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {shortAddress(c.address)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
