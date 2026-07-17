"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import WalletButton from "@/components/WalletButton";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/elections", label: "Elections" },
  { href: "/elections/create", label: "Create" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-white/[0.06] bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <WalletButton />
      </nav>
    </header>
  );
}
