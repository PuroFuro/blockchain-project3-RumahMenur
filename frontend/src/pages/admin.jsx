import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Admin page — owner-only candidate management. Non-connected and non-owner
 * visitors get dedicated gated states; the owner gets a form to add candidates
 * to the ballot plus a roster of the current candidates.
 */
export default function AdminPage({
  isConnected,
  isOwner,
  candidates = [],
  onAddCandidate,
}) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConnected) {
    return (
      <Gate
        icon={<WarningIcon />}
        title="Wallet Not Connected"
        body="Connect your MetaMask wallet from the navbar to access the admin panel."
      />
    );
  }

  if (!isOwner) {
    return (
      <Gate
        tone="error"
        icon={
          <svg className="w-16 h-16 text-error mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        title="Access Restricted"
        body="Only the contract owner can manage candidates. The connected account does not have admin rights."
      />
    );
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !onAddCandidate) return;
    setIsSubmitting(true);
    try {
      await onAddCandidate(trimmed);
      setName("");
    } catch (error) {
      console.error("Failed to add candidate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-tulisan mb-2">
            Admin Panel
          </h1>
          <p className="text-tulisan/60 mb-0">
            Owner-only. Add candidates to the on-chain ballot.
          </p>
        </div>

        {/* Add candidate form */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            value={name}
            maxLength={32}
            placeholder="New candidate name"
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-bg border border-border text-tulisan placeholder:text-tulisan/40 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={isSubmitting || name.trim().length === 0}
            whileHover={isSubmitting || !name.trim() ? {} : { scale: 1.03 }}
            whileTap={isSubmitting || !name.trim() ? {} : { scale: 0.97 }}
            className={`px-6 py-3 rounded-full font-bold text-white transition-colors duration-300 flex justify-center items-center gap-2 ${
              isSubmitting || name.trim().length === 0
                ? "bg-border text-tulisan/40 cursor-not-allowed"
                : "bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20"
            }`}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Adding…
              </>
            ) : (
              "Add Candidate"
            )}
          </motion.button>
        </form>

        {/* Current roster */}
        <div>
          <h2 className="text-sm font-mono uppercase tracking-wide text-tulisan/50 mb-4">
            Current Candidates ({candidates.length})
          </h2>

          {candidates.length === 0 ? (
            <p className="text-center text-tulisan/50 py-10 border border-dashed border-border rounded-xl">
              No candidates yet. Add the first one above.
            </p>
          ) : (
            <motion.ul
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {candidates.map((candidate) => (
                <motion.li
                  key={candidate.id}
                  variants={rowVariants}
                  className="flex items-center justify-between p-4 rounded-xl bg-bg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-tulisan/40">
                      #{candidate.id}
                    </span>
                    <span className="font-semibold text-tulisan">
                      {candidate.name}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-tulisan/60">
                    {Number(candidate.voteCount)}{" "}
                    {Number(candidate.voteCount) === 1 ? "vote" : "votes"}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Gate({ icon, title, body, tone = "warning" }) {
  const ring =
    tone === "error" ? "border-error/30 bg-error/5" : "border-border bg-card";
  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <div className={`flex flex-col items-center justify-center text-center p-10 border rounded-2xl ${ring}`}>
        {icon}
        <h2 className="text-2xl font-mono font-bold mb-2 text-tulisan">{title}</h2>
        <p className="text-tulisan/60 max-w-sm">{body}</p>
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg className="w-16 h-16 text-warning mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
