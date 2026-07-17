"use client";

import { Wallet, LogOut, Loader2 } from "lucide-react";
import { usePolis } from "@/context/PolisContext";
import { Button } from "@/components/ui/button";
import { shortAddress, formatBalance } from "@/lib/utils";

export default function WalletButton() {
  const { account, balance, isConnected, connecting, connectWallet, disconnectWallet } =
    usePolis();

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-ring" />
          <span className="font-medium text-foreground">{formatBalance(balance)} AIA</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            {shortAddress(account)}
          </span>
        </div>
        <Button variant="secondary" size="icon" onClick={disconnectWallet} aria-label="Disconnect wallet">
          <LogOut />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet} disabled={connecting}>
      {connecting ? <Loader2 className="animate-spin" /> : <Wallet />}
      {connecting ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
