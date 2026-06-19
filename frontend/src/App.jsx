import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/home';
import Vote from './pages/vote';
import Results from './pages/results';
import Admin from './pages/admin';

function App() {
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const connectWallet = async () => { /* your code */ };
  const voteForCandidate = async (id) => { /* your code */ };

  return (
    <Router>
      <Navbar account={account} connectWallet={connectWallet} />

      <main className="min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={<Home isConnected={!!account} connectWallet={connectWallet} />} />
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
          <Route path="/results" element={<Results candidates={candidates} />} />
          <Route path="/admin" element={<Admin isOwner={isOwner} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;