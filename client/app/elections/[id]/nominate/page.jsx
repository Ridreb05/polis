"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Vote, Loader2, Clock3 } from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import TxLoader from "@/components/TxLoader";
import EventSummary from "@/components/EventSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NominatePage() {
  const { id } = useParams();
  const router = useRouter();
  const { getElection, nominate, hasNominated, isConnected, connectWallet, account, pending } =
    usePolis();

  const [election, setElection] = useState(null);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);

  useEffect(() => {
    getElection(id).then(setElection).catch(() => setElection(false));
  }, [id, getElection]);

  useEffect(() => {
    if (account) hasNominated(id, account).then(setPendingApproval).catch(() => {});
  }, [id, account, hasNominated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) return connectWallet();
    const ok = await nominate(id, name.trim(), key);
    if (ok) {
      setPendingApproval(true);
      setName("");
      setKey("");
    }
  };

  return (
    <div className="container-page max-w-xl py-12">
      <TxLoader label="Submitting your nomination…" />
      <Link
        href={`/elections/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to election
      </Link>

      <h1 className="font-display text-3xl font-bold tracking-tight">Stand as a nominee</h1>
      <p className="mt-2 text-muted-foreground">
        Apply to appear on the ballot. The steward reviews and approves nominees before voting opens.
      </p>

      <div className="mt-6 space-y-5">
        <EventSummary election={election} />

        {pendingApproval ? (
          <div className="surface flex items-center gap-3 p-5 text-sm">
            <Clock3 className="h-5 w-5 text-amber-300" />
            Your nomination is submitted. Awaiting approval from the steward.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="surface space-y-4 p-6">
            <div>
              <span className="label">Nominee name</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name shown on the ballot"
                required
              />
            </div>
            <div>
              <span className="label">Access key</span>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter the election access key"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? <Loader2 className="animate-spin" /> : <Vote />}
              {!isConnected ? "Connect wallet to apply" : pending ? "Submitting…" : "Submit nomination"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
