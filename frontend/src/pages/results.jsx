import React from "react";
import { motion } from "framer-motion";

/**
 * Results page — read-only, live tally of the election. Shows each candidate's
 * vote count and share with an animated progress bar, plus headline stats. The
 * leading candidate is highlighted with the accent colour.
 */
export default function ResultsPage({ candidates = [], totalVotes }) {
  const total =
    totalVotes != null
      ? Number(totalVotes)
      : candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);

  // Sort a copy by votes (descending) so the standings read top-to-bottom.
  const ranked = [...candidates].sort(
    (a, b) => Number(b.voteCount) - Number(a.voteCount)
  );
  const leadingCount = ranked.length ? Number(ranked[0].voteCount) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-tulisan mb-2">
            Live Results
          </h1>
          <p className="text-tulisan/60 mb-0">
            Tallied directly from the blockchain. Updates as votes are cast.
          </p>
        </div>

        {/* Headline stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label="Total Votes" value={total} accent />
          <StatCard label="Candidates" value={candidates.length} />
        </div>

        {candidates.length === 0 ? (
          <p className="text-center text-tulisan/50 py-12">
            No candidates on the ballot yet.
          </p>
        ) : (
          <motion.ul
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {ranked.map((candidate, index) => {
              const count = Number(candidate.voteCount);
              const pct = total === 0 ? 0 : Math.round((count / total) * 100);
              const isLeading = count > 0 && count === leadingCount;

              return (
                <motion.li key={candidate.id} variants={rowVariants}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-tulisan/40 w-5">
                        #{index + 1}
                      </span>
                      <span className="text-lg font-semibold text-tulisan">
                        {candidate.name}
                      </span>
                      {isLeading && (
                        <span className="text-xs font-mono font-bold uppercase tracking-wide text-accent border border-accent/40 rounded-full px-2 py-0.5">
                          Leading
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-mono text-tulisan/70">
                      {count} {count === 1 ? "vote" : "votes"} · {pct}%
                    </span>
                  </div>

                  <div className="h-3 w-full rounded-full bg-bg border border-border overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        isLeading ? "bg-accent" : "bg-primary"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div className="bg-bg border border-border rounded-xl p-5 text-center">
      <div
        className={`text-3xl font-mono font-bold ${
          accent ? "text-accent" : "text-tulisan"
        }`}
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-tulisan/50 mt-1">
        {label}
      </div>
    </div>
  );
}
