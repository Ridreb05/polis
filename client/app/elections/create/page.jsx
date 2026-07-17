"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePolis } from "@/context/PolisContext";
import TxLoader from "@/components/TxLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MIN_LEAD_HOURS = 2.5;
const MIN_DURATION_MIN = 30;

export default function CreateElectionPage() {
  const router = useRouter();
  const { createElection, isConnected, connectWallet, pending } = usePolis();

  const [form, setForm] = useState({
    name: "",
    purpose: "",
    key: "",
    confirmKey: "",
    startTime: "",
    endTime: "",
    maxCandidates: "3",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const now = new Date();
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    const leadHours = (start - now) / 36e5;
    const durationMin = (end - start) / 6e4;
    const e = {};

    if (!form.name.trim()) e.name = "Give your election a title.";
    if (!form.purpose.trim()) e.purpose = "Describe what's being decided.";
    if (form.key.length < 4) e.key = "Use an access key of at least 4 characters.";
    if (form.key !== form.confirmKey) e.confirmKey = "Access keys don't match.";
    if (Number(form.maxCandidates) < 2) e.maxCandidates = "Allow at least 2 nominees.";
    if (!form.startTime || leadHours < MIN_LEAD_HOURS)
      e.startTime = `Start must be at least ${MIN_LEAD_HOURS} hours from now.`;
    if (!form.endTime || durationMin < MIN_DURATION_MIN)
      e.endTime = `End must be at least ${MIN_DURATION_MIN} minutes after the start.`;

    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isConnected) return connectWallet();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const startUnix = Math.floor(new Date(form.startTime).getTime() / 1000);
    const endUnix = Math.floor(new Date(form.endTime).getTime() / 1000);
    const duration = endUnix - startUnix;

    const ok = await createElection(
      form.name.trim(),
      form.purpose.trim(),
      form.key,
      startUnix,
      duration,
      Number(form.maxCandidates)
    );
    if (ok) router.push("/elections");
  };

  return (
    <div className="container-page max-w-2xl py-12">
      <TxLoader label="Creating your election on-chain…" />

      <Link
        href="/elections"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to elections
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Create an election</h1>
        <p className="mt-2 text-muted-foreground">
          Define the seat, the window and a shared access key. Members and
          nominees will need the key to take part.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="surface space-y-6 p-6 sm:p-8">
        <Field label="Election title" error={errors.name}>
          <Input
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Core Council Seat — Q3 2026"
          />
        </Field>

        <Field label="Purpose" error={errors.purpose}>
          <textarea
            value={form.purpose}
            onChange={set("purpose")}
            rows={3}
            placeholder="What is this election deciding?"
            className="field resize-none"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Access key" error={errors.key}>
            <Input type="password" value={form.key} onChange={set("key")} placeholder="Set a shared key" />
          </Field>
          <Field label="Confirm access key" error={errors.confirmKey}>
            <Input
              type="password"
              value={form.confirmKey}
              onChange={set("confirmKey")}
              placeholder="Repeat the key"
            />
          </Field>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] p-3 text-xs text-muted-foreground">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Share the access key only with eligible members and nominees. Voting
          opens at least {MIN_LEAD_HOURS} hours after creation so people can register.
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Voting opens" error={errors.startTime}>
            <Input type="datetime-local" value={form.startTime} onChange={set("startTime")} />
          </Field>
          <Field label="Voting closes" error={errors.endTime}>
            <Input type="datetime-local" value={form.endTime} onChange={set("endTime")} />
          </Field>
        </div>

        <Field label="Maximum nominees" error={errors.maxCandidates} hint="Ballot size cap (minimum 2).">
          <Input type="number" min={2} value={form.maxCandidates} onChange={set("maxCandidates")} />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          {!isConnected ? "Connect wallet to continue" : pending ? "Creating…" : "Create election"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
      {hint && !error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="h-3 w-3" /> {hint}
        </p>
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
