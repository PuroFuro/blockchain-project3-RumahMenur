/**
 * Shared status strip for the three required tx states: pending / success /
 * failed. Driven by a `{ type, message }` object from App; renders nothing when
 * there is no active status.
 */
const TONES = {
  pending: "border-primary/40 bg-primary/10 text-tulisan",
  success: "border-accent/40 bg-accent/10 text-accent",
  error: "border-error/40 bg-error/10 text-error",
};

export default function Notification({ status }) {
  if (!status) return null;

  const { type, message } = status;
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 mb-4 font-mono text-sm ${
        TONES[type] ?? TONES.pending
      }`}
    >
      {type === "pending" && (
        <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}
