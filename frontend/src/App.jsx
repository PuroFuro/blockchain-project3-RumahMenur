import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import NetworkBanner from './components/NetworkBanner';
import Notification from './components/Notification';
import Home from './pages/home';
import Vote from './pages/vote';
import Results from './pages/results';
import Admin from './pages/admin';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import { friendlyError } from './utils/helpers';

function App() {
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
    isOwner,
    castVote,
    addCandidate,
  } = useContract(provider, account);

  // Transient tx status for the shared Notification strip.
  const [status, setStatus] = useState(null);

  const voteForCandidate = useCallback(
    async (id) => {
      setStatus({ type: 'pending', message: 'Submitting your vote…' });
      try {
        await castVote(id);
        setStatus({ type: 'success', message: 'Your vote has been recorded!' });
      } catch (err) {
        setStatus({ type: 'error', message: friendlyError(err) });
        throw err; // let the page reset its own submitting state
      }
    },
    [castVote]
  );

  const addNewCandidate = useCallback(
    async (name) => {
      setStatus({ type: 'pending', message: `Adding "${name}"…` });
      try {
        await addCandidate(name);
        setStatus({ type: 'success', message: `Candidate "${name}" added.` });
      } catch (err) {
        setStatus({ type: 'error', message: friendlyError(err) });
        throw err;
      }
    },
    [addCandidate]
  );

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar
          account={account}
          connecting={connecting}
          hasMetaMask={hasMetaMask}
          onConnect={connect}
        />

        <main className="flex flex-1 flex-col">
          <div className="max-w-3xl mx-auto w-full px-4 pt-4">
            <NetworkBanner
              deployed={deployed}
              wrongNetwork={wrongNetwork}
              account={account}
            />
          </div>

          <Notification status={status} onClose={() => setStatus(null)} />

          <Routes>
          <Route
            path="/"
            element={<Home isConnected={!!account} connectWallet={connect} />}
          />
          <Route
            path="/vote"
            element={
              <Vote
                candidates={candidates}
                onVote={voteForCandidate}
                hasVoted={hasVoted}
                isConnected={!!account}
              />
            }
          />
          <Route
            path="/results"
            element={<Results candidates={candidates} totalVotes={totalVotes} />}
          />
          <Route
            path="/admin"
            element={
              <Admin
                isConnected={!!account}
                isOwner={isOwner}
                candidates={candidates}
                onAddCandidate={addNewCandidate}
              />
            }
          />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
