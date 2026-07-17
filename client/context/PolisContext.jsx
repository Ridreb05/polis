"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import {
  getReadContract,
  getWriteContract,
  normalizeElection,
  normalizeCandidate,
  parseContractError,
} from "@/services/contract";
import { ensureNetwork, hasInjectedWallet } from "@/services/network";
import { toast } from "@/hooks/use-toast";

const PolisContext = createContext(null);

export function PolisProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [pending, setPending] = useState(false); // a write tx is in flight
  const [elections, setElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(false);

  // ---- Reads ----------------------------------------------------------------
  const refreshElections = useCallback(async () => {
    setLoadingElections(true);
    try {
      const contract = getReadContract();
      const count = Number(await contract.eventCount());
      const items = await Promise.all(
        Array.from({ length: count }, async (_, i) => {
          const raw = await contract.getVotingEvent(i);
          return normalizeElection(raw, i);
        })
      );
      setElections(items.reverse()); // newest first
    } catch (err) {
      console.error("Failed to load elections:", err);
    } finally {
      setLoadingElections(false);
    }
  }, []);

  const getElection = useCallback(async (id) => {
    const contract = getReadContract();
    const raw = await contract.getVotingEvent(Number(id));
    return normalizeElection(raw, id);
  }, []);

  const getCandidates = useCallback(async (id) => {
    const contract = getReadContract();
    const list = await contract.getCandidates(Number(id));
    return list.map(normalizeCandidate);
  }, []);

  const getApprovedCandidates = useCallback(
    async (id) => (await getCandidates(id)).filter((c) => c.registered),
    [getCandidates]
  );

  const getWinner = useCallback(async (id) => {
    const contract = getReadContract();
    return contract.getVotingResults(Number(id));
  }, []);

  const isMember = useCallback(async (id, address) => {
    if (!address) return false;
    const contract = getReadContract();
    return contract.isVoterRegistered(Number(id), address);
  }, []);

  const hasNominated = useCallback(async (id, address) => {
    if (!address) return false;
    const contract = getReadContract();
    return contract.isCandidateRegistered(Number(id), address);
  }, []);

  // ---- Wallet ---------------------------------------------------------------
  const syncBalance = useCallback(async (addr) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const bal = await provider.getBalance(addr);
      setBalance(ethers.formatEther(bal));
    } catch {
      setBalance("0");
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!hasInjectedWallet()) {
      toast({
        title: "No wallet detected",
        description: "Install MetaMask to connect and participate.",
        variant: "destructive",
      });
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }
    setConnecting(true);
    try {
      await ensureNetwork();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const addr = accounts[0];
      setAccount(addr);
      setIsConnected(true);
      await syncBalance(addr);
      toast({ title: "Wallet connected", variant: "success" });
    } catch (err) {
      toast({
        title: "Connection failed",
        description: parseContractError(err),
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  }, [syncBalance]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setBalance("0");
  }, []);

  // ---- Writes ---------------------------------------------------------------
  // Wraps a transaction with pending state + toasts; returns true on success.
  const runTx = useCallback(async (fn, { success } = {}) => {
    setPending(true);
    try {
      const contract = await getWriteContract();
      const tx = await fn(contract);
      await tx.wait();
      if (success) toast({ title: success, variant: "success" });
      return true;
    } catch (err) {
      toast({
        title: "Transaction failed",
        description: parseContractError(err),
        variant: "destructive",
      });
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  const createElection = useCallback(
    (name, purpose, key, startTime, duration, maxCandidates) =>
      runTx(
        (c) => c.createVotingEvent(name, purpose, key, startTime, duration, maxCandidates),
        { success: "Election created" }
      ).then((ok) => {
        if (ok) refreshElections();
        return ok;
      }),
    [runTx, refreshElections]
  );

  const joinAsMember = useCallback(
    (id, key) =>
      runTx((c) => c.registerVoter(Number(id), key), { success: "You're now a member" }),
    [runTx]
  );

  const nominate = useCallback(
    (id, name, key) =>
      runTx((c) => c.registerCandidate(Number(id), name, key), {
        success: "Nomination submitted",
      }),
    [runTx]
  );

  const approveNominee = useCallback(
    (id, address) =>
      runTx((c) => c.approveCandidate(Number(id), address), {
        success: "Nominee approved",
      }),
    [runTx]
  );

  const castVote = useCallback(
    (id, address) =>
      runTx((c) => c.vote(Number(id), address), { success: "Vote recorded on-chain" }),
    [runTx]
  );

  const closeElection = useCallback(
    (id) =>
      runTx((c) => c.endVotingEvent(Number(id)), { success: "Election closed" }).then(
        (ok) => {
          if (ok) refreshElections();
          return ok;
        }
      ),
    [runTx, refreshElections]
  );

  // ---- Effects --------------------------------------------------------------
  useEffect(() => {
    refreshElections();
  }, [refreshElections]);

  // Reconnect silently if the wallet is already authorized.
  useEffect(() => {
    if (!hasInjectedWallet()) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts?.length) {
          setAccount(accounts[0]);
          setIsConnected(true);
          syncBalance(accounts[0]);
        }
      })
      .catch(() => {});

    const onAccounts = (accounts) => {
      if (!accounts?.length) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
        syncBalance(accounts[0]);
      }
    };
    const onChain = () => window.location.reload();

    window.ethereum.on?.("accountsChanged", onAccounts);
    window.ethereum.on?.("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAccounts);
      window.ethereum.removeListener?.("chainChanged", onChain);
    };
  }, [disconnectWallet, syncBalance]);

  const value = useMemo(
    () => ({
      // wallet
      account,
      balance,
      isConnected,
      connecting,
      connectWallet,
      disconnectWallet,
      // tx state
      pending,
      // elections
      elections,
      loadingElections,
      refreshElections,
      getElection,
      getCandidates,
      getApprovedCandidates,
      getWinner,
      isMember,
      hasNominated,
      // actions
      createElection,
      joinAsMember,
      nominate,
      approveNominee,
      castVote,
      closeElection,
    }),
    [
      account,
      balance,
      isConnected,
      connecting,
      connectWallet,
      disconnectWallet,
      pending,
      elections,
      loadingElections,
      refreshElections,
      getElection,
      getCandidates,
      getApprovedCandidates,
      getWinner,
      isMember,
      hasNominated,
      createElection,
      joinAsMember,
      nominate,
      approveNominee,
      castVote,
      closeElection,
    ]
  );

  return <PolisContext.Provider value={value}>{children}</PolisContext.Provider>;
}

export function usePolis() {
  const ctx = useContext(PolisContext);
  if (!ctx) throw new Error("usePolis must be used within a PolisProvider");
  return ctx;
}
