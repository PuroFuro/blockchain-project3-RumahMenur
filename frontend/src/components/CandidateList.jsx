/**
 * Renders the ballot. Each row shows the candidate, a live vote count and a
 * progress bar, plus a "Vote" button. Voting is disabled when the user can't
 * vote (not connected, wrong network, already voted, or a tx is pending).
 */
export default function CandidateList({
  candidates,
  totalVotes,
  loading,
  canVote,
  hasVoted,
  pendingId,
  onVote,
}) {
  if (loading) {
    return <p className="muted">Loading candidates…</p>;
  }

  if (candidates.length === 0) {
    return <p className="muted">No candidates on the ballot yet.</p>;
  }

  const total = Number(totalVotes);

  return (
    <ul className="candidate-list">
      {candidates.map((c) => {
        const count = Number(c.voteCount);
        const pct = total === 0 ? 0 : Math.round((count / total) * 100);
        const isPending = pendingId === c.id;

        return (
          <li key={c.id} className="candidate">
            <div className="candidate-head">
              <span className="candidate-name">{c.name}</span>
              <span className="candidate-count">
                {count} {count === 1 ? "vote" : "votes"} · {pct}%
              </span>
            </div>

            <div className="bar">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>

            <button
              className="btn btn-vote"
              disabled={!canVote || isPending}
              onClick={() => onVote(c.id)}
            >
              {isPending ? "Confirming…" : hasVoted ? "Voted" : `Vote ${c.name}`}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
