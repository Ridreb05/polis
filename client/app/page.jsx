"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Eye,
  Users,
  Gavel,
  UserPlus,
  Vote,
  Trophy,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import ElectionCard from "@/components/ElectionCard";
import { Button } from "@/components/ui/button";
import { electionPhase } from "@/lib/utils";

const STEPS = [
  {
    icon: Gavel,
    title: "Open an election",
    body: "A steward defines the seat, the voting window and a shared access key. It's minted on-chain instantly.",
  },
  {
    icon: UserPlus,
    title: "Nominate & approve",
    body: "Members stand as nominees with the key; the steward approves the ballot before voting opens.",
  },
  {
    icon: Vote,
    title: "Members vote",
    body: "Each approved member casts one tamper-proof vote during the window — no double voting, ever.",
  },
  {
    icon: Trophy,
    title: "Verifiable outcome",
    body: "When the steward closes the election, the result is computed and auditable by anyone.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Tamper-proof by design",
    body: "Every ballot is settled on-chain. Results can't be altered, deleted, or quietly rewritten.",
  },
  {
    icon: Eye,
    title: "Radically transparent",
    body: "Nominations, approvals and votes are public and independently verifiable on the explorer.",
  },
  {
    icon: Fingerprint,
    title: "Sybil-resistant access",
    body: "Gated membership with a shared key and one-wallet-one-vote keeps elections honest.",
  },
  {
    icon: Users,
    title: "Built for communities",
    body: "DAO councils, cooperatives, nonprofits, guilds — any group that decides together.",
  },
];

export default function Home() {
  const { elections } = usePolis();
  const featured = elections.slice(0, 3);
  const liveCount = elections.filter((e) => electionPhase(e) === "live").length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[32rem] w-[42rem] -translate-x-1/2 rounded-full bg-brand-gradient opacity-20 blur-[120px] animate-aurora" />

        <div className="container-page relative py-24 text-center sm:py-32">
          <div className="mx-auto mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            On-chain governance on the AIA blockchain
          </div>

          <h1 className="mx-auto max-w-4xl animate-fade-up font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl">
            Governance,{" "}
            <span className="text-gradient">decided together</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-muted-foreground text-balance">
            Polis lets DAOs, councils and communities run elections that are
            secure, transparent and provably fair — from nomination to final
            tally, every step lives on-chain.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/elections/create">
                Start an election <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/elections">Explore elections</Link>
            </Button>
          </div>

          <div className="mx-auto mt-14 grid max-w-lg animate-fade-up grid-cols-3 gap-4">
            {[
              { k: elections.length, v: "Elections" },
              { k: liveCount, v: "Live now" },
              { k: "100%", v: "On-chain" },
            ].map((s) => (
              <div key={s.v} className="surface px-4 py-5">
                <div className="font-display text-3xl font-bold text-foreground">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            From proposal to tally in four steps
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            A governance flow your members can actually trust.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="surface relative p-6">
              <span className="absolute right-5 top-5 font-display text-sm font-bold text-primary/40">
                0{i + 1}
              </span>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient/10 ring-1 ring-primary/30">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface flex gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured elections */}
      {featured.length > 0 && (
        <section className="container-page py-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-3xl font-bold tracking-tight">Recent elections</h2>
            <Link href="/elections" className="text-sm font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => (
              <ElectionCard key={e.id} election={e} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-page py-16">
        <div className="surface relative overflow-hidden px-8 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.08]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Ready to let your community decide?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Spin up your first on-chain election in minutes. No servers, no
              spreadsheets, no trust required.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/elections/create">
                Create an election <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
