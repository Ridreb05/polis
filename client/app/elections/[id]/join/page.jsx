"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import TxLoader from "@/components/TxLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventSummary from "@/components/EventSummary";

export default function JoinPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getElection, joinAsMember, isMember, isConnected, connectWallet, account, pending } =
    usePolis();

  const [election, setElection] = useState(null);
  const [key, setKey] = useState("");
  const [already, setAlready] = useState(false);

  useEffect(() => {
    getElection(id).then(setElection).catch(() => setElection(false));
  }, [id, getElection]);

  useEffect(() => {
    if (account) isMember(id, account).then(setAlready).catch(() => {});
  }, [id, account, isMember]);

  const handleJoin = async () => {
    if (!isConnected) return connectWallet();
    const ok = await joinAsMember(id, key);
    if (ok) router.push(`/elections/${id}`);
  };

  return (
    <div className="container-page max-w-xl py-12">
      <TxLoader label="Registering you as a member…" />
      <Link
        href={`/elections/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to election
      </Link>

      <h1 className="font-display text-3xl font-bold tracking-tight">Join as a member</h1>
      <p className="mt-2 text-muted-foreground">
        Enter the shared access key to become an eligible voter for this election.
      </p>

      <div className="mt-6 space-y-5">
        <EventSummary election={election} />

        {already ? (
          <div className="surface flex items-center gap-3 p-5 text-sm">
            <CheckCircle2 className="h-5 w-5 text-success" />
            You&apos;re already registered as a member for this election.
          </div>
        ) : (
          <div className="surface space-y-4 p-6">
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
                />
              </div>
            </div>
            <Button onClick={handleJoin} disabled={pending || (!key && isConnected)} className="w-full">
              {pending ? <Loader2 className="animate-spin" /> : <UserPlus />}
              {!isConnected ? "Connect wallet to join" : pending ? "Registering…" : "Join as member"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
