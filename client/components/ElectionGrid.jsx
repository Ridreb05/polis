"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Vote, Plus } from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import ElectionCard from "@/components/ElectionCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { electionPhase } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "closed", label: "Closed" },
];

function CardSkeleton() {
  return (
    <div className="surface p-5">
      <div className="skeleton mb-3 h-6 w-20" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton mt-2 h-4 w-full" />
      <div className="skeleton mt-6 h-4 w-2/3" />
    </div>
  );
}

export default function ElectionGrid() {
  const { elections, loadingElections } = usePolis();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return elections.filter((e) => {
      const matchesFilter = filter === "all" || electionPhase(e) === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        e.name?.toLowerCase().includes(q) ||
        e.purpose?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [elections, filter, query]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search elections…"
            aria-label="Search elections"
            className="field pl-10"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors " +
                (filter === f.key
                  ? "bg-white/[0.08] text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loadingElections ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Vote}
          title={query || filter !== "all" ? "No matching elections" : "No elections yet"}
          description={
            query || filter !== "all"
              ? "Try a different search or filter."
              : "Be the first to open a governance election for your community."
          }
          action={
            <Button asChild>
              <Link href="/elections/create">
                <Plus /> Create an election
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <ElectionCard key={e.id} election={e} />
          ))}
        </div>
      )}
    </div>
  );
}
