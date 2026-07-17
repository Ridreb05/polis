import Link from "next/link";
import Logo from "@/components/Logo";
import { AIA_TESTNET } from "@/services/network";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06]">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Polis is decentralized governance infrastructure. Open elections,
            approve nominees, and let members decide — every vote verifiable
            on-chain.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/elections" className="hover:text-foreground">Browse elections</Link></li>
            <li><Link href="/elections/create" className="hover:text-foreground">Create an election</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Network</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={AIA_TESTNET.explorerUrl} target="_blank" rel="noreferrer" className="hover:text-foreground">
                AIA Testnet Explorer
              </a>
            </li>
            <li className="font-mono text-xs">Chain ID {AIA_TESTNET.chainIdDecimal}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Polis. Governance, verified on-chain.</span>
          <span>Built on the AIA blockchain</span>
        </div>
      </div>
    </footer>
  );
}
