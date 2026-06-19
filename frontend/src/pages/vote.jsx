import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VotePage({
  candidates,
  onVote,
  hasVoted,
  isConnected,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center mx-auto min-h-screen text-center p-8 rounded-xl ">
        <svg
          className="w-16 h-16 text-yellow-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-mono font-bold mb-2 text-slate-900 dark:text-white">
          Wallet Not Connected
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Please connect your MetaMask wallet via the navbar to participate in the election
        </p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-green-50/50 dark:bg-emerald-950/20 rounded-xl border border-green-200 dark:border-emerald-900/50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <svg
            className="w-24 h-24 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-extrabold text-green-700 dark:text-emerald-400 mb-2">
          Vote Successfully Cast!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
          Your vote has been securely recorded on the blockchain.
        </p>
        <a
          href="/results"
          className="text-primary hover:text-primary-dark font-semibold underline underline-offset-4 transition-colors"
        >
          View Live Results &rarr;
        </a>
      </div>
    );
  }

  const handleVoteSubmit = async () => {
    if (!selectedId) return;
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
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-800">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          Official Ballot
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Select one candidate below. This action cannot be undone.
        </p>
      </div>

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
                  : "border-slate-200 dark:border-slate-700 hover:border-primary/40 bg-slate-50 dark:bg-slate-800/50"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {candidate.name}
                </span>
              </div>

              {/* Custom Radio Button Indicator */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                  isSelected
                    ? "border-primary"
                    : "border-slate-300 dark:border-slate-600 group-hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-radio"
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

      {/* Submission CTA */}
      <button
        onClick={handleVoteSubmit}
        disabled={!selectedId || isSubmitting}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 flex justify-center items-center ${
          !selectedId || isSubmitting
            ? "bg-slate-400 dark:bg-slate-700 opacity-50 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dark shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Confirming on blockchain...
          </span>
        ) : (
          "Cast Vote"
        )}
      </button>
    </div>
  );
}