import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contract";
import { isContractDeployed } from "../utils/helpers";

/**
 * Builds the ethers v6 Contract instance and exposes the reads/writes the UI
 * needs. Reads use the provider (no signer required); writes need a signer,
 * which we fetch lazily with `await provider.getSigner()`.
 *
 * On-chain state is the source of truth: after a successful write we re-run the
 * read (`refresh`) rather than optimistically mutating local state.
 */
export function useContract(provider, account) {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0n);
  const [hasVoted, setHasVoted] = useState(false);
  const [owner, setOwner] = useState(null);
  const [loadingState, setLoadingState] = useState(true);

  const deployed = isContractDeployed(CONTRACT_ADDRESS);

  // Read-only contract bound to the provider. Recreated only when provider changes.
  const readContract = useMemo(() => {
    if (!provider || !deployed) return null;
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }, [provider, deployed]);

  // READ #1 + #2 + #3: ballot, total votes, and whether this account has voted.
  const refresh = useCallback(async () => {
    if (!readContract) {
      setLoadingState(false);
      return;
    }
    setLoadingState(true);
    try {
      const [rawCandidates, total, contractOwner] = await Promise.all([
        readContract.getAllCandidates(),
        readContract.totalVotes(),
        readContract.owner(),
      ]);

      setCandidates(
        rawCandidates.map((c) => ({
          id: Number(c.id),
          name: c.name,
          voteCount: c.voteCount, // keep as bigint; format at display time
        }))
      );
      setTotalVotes(total);
      setOwner(contractOwner);

      if (account) {
        setHasVoted(await readContract.hasVoted(account));
      } else {
        setHasVoted(false);
      }
    } finally {
      setLoadingState(false);
    }
  }, [readContract, account]);

  // Initial load + reload when the account changes.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Bonus: live-update by listening to the Voted event. Any vote (even from
  // another account) triggers a refresh so the tallies stay current.
  useEffect(() => {
    if (!readContract) return;
    const onVoted = () => refresh();
    readContract.on("Voted", onVoted);
    return () => {
      readContract.off("Voted", onVoted);
    };
  }, [readContract, refresh]);

  // WRITE #1: cast a vote. Needs a signer.
  const castVote = useCallback(
    async (candidateId) => {
      if (!provider) throw new Error("Wallet not connected.");
      const signer = await provider.getSigner(); // v6: returns a Promise
      const writeContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await writeContract.vote(candidateId);
      await tx.wait(); // wait for confirmation BEFORE refreshing state
      await refresh();
    },
    [provider, refresh]
  );

  // WRITE #2: owner-only — add a candidate.
  const addCandidate = useCallback(
    async (name) => {
      if (!provider) throw new Error("Wallet not connected.");
      const signer = await provider.getSigner();
      const writeContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await writeContract.addCandidate(name);
      await tx.wait();
      await refresh();
    },
    [provider, refresh]
  );

  const isOwner =
    !!account && !!owner && account.toLowerCase() === owner.toLowerCase();

  return {
    deployed,
    candidates,
    totalVotes,
    hasVoted,
    owner,
    isOwner,
    loadingState,
    refresh,
    castVote,
    addCandidate,
  };
}
