import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import { friendlyError } from "./utils/helpers";
import ConnectWallet from "./components/ConnectWallet";
import NetworkBanner from "./components/NetworkBanner";
import CandidateList from "./components/CandidateList";
import AddCandidate from "./components/AddCandidate";
import Notification from "./components/Notification";

export default function App() {
  const {
    hasMetaMask,
    account,
    provider,
    connecting,
    wrongNetwork,
    connect,
  } = useWallet();

  const {
    deployed,
    candidates,
    totalVotes,
    hasVoted,
    loadingState,
    castVote,
    addCandidate,
  } = useContract(provider, account);

  // Single source of truth for the pending/success/failed notification.
  const [status, setStatus] = useState(null);
  // Which candidate's vote tx is in flight (drives the per-row button label).
  const [pendingId, setPendingId] = useState(null);
  const [addPending, setAddPending] = useState(false);

  const ready = deployed && !!account && !wrongNetwork;
  const canVote = ready && !hasVoted;

  // WRITE: cast a vote — wrapped in the required pending/success/failed flow.
  const handleVote = async (candidateId) => {
    setStatus({ type: "pending", message: "Submitting your vote…" });
    setPendingId(candidateId);
    try {
      await castVote(candidateId);
      setStatus({ type: "success", message: "Vote recorded on-chain. Thanks!" });
    } catch (err) {
      setStatus({ type: "failed", message: friendlyError(err) });
    } finally {
      setPendingId(null);
    }
  };

  // WRITE: owner-only add candidate.
  const handleAdd = async (name) => {
    setStatus({ type: "pending", message: `Adding candidate “${name}”…` });
    setAddPending(true);
    try {
      await addCandidate(name);
      setStatus({ type: "success", message: `Added “${name}” to the ballot.` });
    } catch (err) {
      setStatus({ type: "failed", message: friendlyError(err) });
    } finally {
      setAddPending(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>🗳️ Voting dApp</h1>
          <p className="muted">One address, one vote — enforced on-chain.</p>
        </div>
        <ConnectWallet
          hasMetaMask={hasMetaMask}
          account={account}
          connecting={connecting}
          onConnect={connect}
        />
      </header>

      <NetworkBanner
        deployed={deployed}
        wrongNetwork={wrongNetwork}
        account={account}
      />

      <Notification status={status} />

      <main className="card">
        <div className="card-head">
          <h2>Candidates</h2>
          <span className="muted">
            {Number(totalVotes)} total {Number(totalVotes) === 1 ? "vote" : "votes"}
          </span>
        </div>

        {!account && deployed && (
          <p className="muted">Connect your wallet to cast a vote.</p>
        )}

        {hasVoted && (
          <p className="info-line">You’ve already voted from this account.</p>
        )}

        <CandidateList
          candidates={candidates}
          totalVotes={totalVotes}
          loading={loadingState}
          canVote={canVote}
          hasVoted={hasVoted}
          pendingId={pendingId}
          onVote={handleVote}
        />
      </main>

      <section className="card">
        <h2>Add a candidate</h2>
        <p className="muted">
          Owner-only. The contract rejects non-owners — others will see a polite
          error rather than a successful change.
        </p>
        <AddCandidate disabled={!ready} pending={addPending} onAdd={handleAdd} />
      </section>

      <footer className="app-footer muted">
        University voting dApp · Solidity + Hardhat · React + ethers v6
      </footer>
    </div>
  );
}
