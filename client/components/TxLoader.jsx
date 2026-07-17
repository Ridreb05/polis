"use client";

import { Loader2 } from "lucide-react";
import { usePolis } from "@/context/PolisContext";

/** Full-screen overlay shown while a wallet transaction is pending. */
export default function TxLoader({ label = "Confirm the transaction in your wallet" }) {
  const { pending } = usePolis();
  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="surface flex flex-col items-center gap-4 px-10 py-8 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-20 blur-md" />
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Awaiting confirmation</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
