import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Truncate an EVM address for display, e.g. 0x1B2d…a2E3 */
export function shortAddress(address, lead = 6, tail = 4) {
  if (!address) return "";
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

/** Format a token balance to at most `dp` decimals, trimming trailing zeros. */
export function formatBalance(balance, dp = 4) {
  const n = parseFloat(balance ?? 0);
  if (Number.isNaN(n)) return "0";
  return parseFloat(n.toFixed(dp)).toString();
}

/** Convert a unix-seconds value (number | bigint | string) to a Date. */
export function unixToDate(seconds) {
  return new Date(Number(seconds) * 1000);
}

/** Human-friendly date/time. */
export function formatDateTime(seconds) {
  return unixToDate(seconds).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Derive a lifecycle phase for an election from its timestamps + active flag.
 * @returns {"upcoming"|"live"|"closed"}
 */
export function electionPhase({ startTime, endTime, active }) {
  const now = Math.floor(Date.now() / 1000);
  const start = Number(startTime);
  const end = Number(endTime);
  if (!active) return "closed";
  if (now < start) return "upcoming";
  if (now >= end) return "closed";
  return "live";
}
