// Thin service layer over the Polis contract. Keeps ethers plumbing out of the
// React context so components/hooks depend on plain functions.
import { ethers } from "ethers";
import { Polis, CONTRACT_ADDRESS } from "@/lib/constants";
import { AIA_TESTNET, hasInjectedWallet } from "@/services/network";

/** Read-only provider: injected wallet if present, else public RPC. */
export function getReadProvider() {
  if (hasInjectedWallet()) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(AIA_TESTNET.rpcUrl);
}

/** Contract instance for view calls. */
export function getReadContract() {
  return new ethers.Contract(CONTRACT_ADDRESS, Polis.abi, getReadProvider());
}

/** Contract instance bound to a signer for transactions. */
export async function getWriteContract() {
  if (!hasInjectedWallet()) {
    throw new Error("A Web3 wallet (e.g. MetaMask) is required to sign transactions.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, Polis.abi, signer);
}

/** Normalize the tuple returned by getVotingEvent into a plain object. */
export function normalizeElection(raw, id) {
  return {
    id: Number(id),
    name: raw.name ?? raw[0],
    purpose: raw.purpose ?? raw[1],
    organizer: raw.organizer ?? raw[2],
    startTime: Number(raw.startTime ?? raw[3]),
    endTime: Number(raw.endTime ?? raw[4]),
    active: Boolean(raw.active ?? raw[5]),
  };
}

/** Normalize a Candidate struct from getCandidates. */
export function normalizeCandidate(c) {
  return {
    name: c.name ?? c[0],
    address: c.candidateAddress ?? c[1],
    voteCount: Number(c.voteCount ?? c[2]),
    requested: Boolean(c.requested ?? c[3]),
    registered: Boolean(c.registered ?? c[4]),
  };
}

/**
 * Turn a raw contract/ethers error into a short human message.
 * Surfaces Solidity revert reasons when available.
 */
export function parseContractError(err) {
  const reason =
    err?.reason ||
    err?.shortMessage ||
    err?.info?.error?.message ||
    err?.data?.message ||
    err?.message ||
    "";
  if (/user rejected|action_rejected|denied/i.test(reason)) {
    return "Transaction rejected in your wallet.";
  }
  // Strip ethers noise, keep the require() string if present.
  const match = reason.match(/reason="([^"]+)"|execution reverted:?\s*"?([^"]+)"?/i);
  if (match) return (match[1] || match[2] || "").trim();
  return reason.split("(")[0].trim() || "Something went wrong. Please try again.";
}
