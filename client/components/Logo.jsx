import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="Polis logo"
    >
      <defs>
        <linearGradient id="polis-mark" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6c5cf6" />
          <stop offset="0.55" stopColor="#a855f7" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="15" fill="#0c0b16" />
      <rect x="6.75" y="6.75" width="50.5" height="50.5" rx="14.25" stroke="url(#polis-mark)" strokeOpacity="0.5" strokeWidth="1.5" />
      <rect x="18" y="34" width="6.5" height="14" rx="3.25" fill="url(#polis-mark)" />
      <rect x="28.75" y="26" width="6.5" height="22" rx="3.25" fill="url(#polis-mark)" />
      <rect x="39.5" y="18" width="6.5" height="30" rx="3.25" fill="url(#polis-mark)" />
    </svg>
  );
}

export default function Logo({ className, href = "/" }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        Polis
      </span>
    </Link>
  );
}
