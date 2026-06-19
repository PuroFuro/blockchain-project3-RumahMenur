import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Vote page — the official ballot. The voter picks exactly one candidate and
 * casts a single, irreversible vote. Connect/already-voted are handled as
 * dedicated states so the ballot itself stays focused.
 */
export default function VotePage({
  candidates = [],
  onVote,
  hasVoted,
  isConnected,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConnected) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center text-center p-10 bg-card border border-border rounded-2xl">
          <WarningIcon />
          <h2 className="text-2xl font-mono font-bold mb-2 text-tulisan">
            Wallet Not Connected
          </h2>
          <p className="text-tulisan/60 max-w-sm">
            Connect your MetaMask wallet from the navbar to receive your ballot
            and participate in the election.
          </p>
        </div>
      </PageShell>
    );
  }

  if (hasVoted) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center text-center p-10 bg-accent/5 border border-accent/30 rounded-2xl">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <svg
              className="w-20 h-20 text-accent mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-mono font-bold text-accent mb-2">
            Vote Successfully Cast
          </h2>
          <p className="text-tulisan/60 mb-8 max-w-sm">
            Your vote has been permanently recorded on the blockchain. Each
            address can vote only once.
          </p>
          <Link
            to="/results"
            className="text-accent hover:text-accent/80 font-semibold underline underline-offset-4 transition-colors"
          >
            View Live Results &rarr;
          </Link>
        </div>
      </PageShell>
    );
  }

  const handleVoteSubmit = async () => {
    if (!selectedId || !onVote) return;
    setIsSubmitting(true);
    try {
      await onVote(selectedId);
    } catch (error) {
      console.error("Failed to cast vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <PageShell>
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-tulisan mb-2">
            Official Ballot
          </h1>
          <p className="text-tulisan/60 mb-0">
            Select one candidate below. This action cannot be undone.
          </p>
        </div>

        {candidates.length === 0 ? (
          <p className="text-center text-tulisan/50 py-12">
            No candidates on the ballot yet.
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {candidates.map((candidate) => {
              const isSelected = selectedId === candidate.id;
              return (
                <motion.div
                  key={candidate.id}
                  variants={cardVariants}
                  onClick={() => setSelectedId(candidate.id)}
                  className={`group relative flex items-center justify-between p-5 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40 bg-bg"
                  }`}
                >
                  <span className="text-lg font-semibold text-tulisan">
                    {candidate.name}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      isSelected
                        ? "border-primary"
                        : "border-border group-hover:border-primary/50"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <motion.button
          onClick={handleVoteSubmit}
          disabled={!selectedId || isSubmitting}
          whileHover={!selectedId || isSubmitting ? {} : { scale: 1.02 }}
          whileTap={!selectedId || isSubmitting ? {} : { scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-full font-bold text-lg text-white transition-colors duration-300 flex justify-center items-center ${
            !selectedId || isSubmitting
              ? "bg-border text-tulisan/40 cursor-not-allowed"
              : "bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-3">
              <Spinner />
              Confirming on blockchain…
            </span>
          ) : (
            "Cast Vote"
          )}
        </motion.button>
      </div>
    </PageShell>
  );
}

/* Shared layout wrapper: clears the fixed navbar and centers the content. */
function PageShell({ children }) {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">{children}</div>
  );
}

function WarningIcon() {
  return (
    <svg
      className="w-16 h-16 text-warning mb-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
