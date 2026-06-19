/**
 * Shared status toast for the three required tx states: pending / success /
 * failed. Driven by a `{ type, message }` object from App; renders nothing when
 * there is no active status. Overlays in the top-right and is dismissable via
 * `onClose`.
 */
const TONES = {
  pending: "border-primary/40 bg-primary/10 text-tulisan",
  success: "border-accent/40 bg-accent/10 text-accent",
  error: "border-error/40 bg-error/10 text-error",
};

export default function Notification({ status, onClose }) {
  if (!status) return null;

  const { type, message } = status;
  return (
    <div className="fixed top-20 right-4 z-50 w-[min(92vw,22rem)]">
      <div
        role="status"
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-sm shadow-lg backdrop-blur-sm ${
          TONES[type] ?? TONES.pending
        }`}
      >
        {type === "pending" && (
          <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        <span className="flex-1">{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="shrink-0 -mr-1 rounded p-1 opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
