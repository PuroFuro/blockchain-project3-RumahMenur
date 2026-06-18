/**
 * Shared status strip for the three required tx states: pending / success /
 * failed. Driven by a `{ type, message }` object from App; renders nothing when
 * there is no active status.
 */
export default function Notification({ status }) {
  if (!status) return null;

  const { type, message } = status;
  return (
    <div className={`notification notification-${type}`} role="status">
      {type === "pending" && <span className="spinner" />}
      <span>{message}</span>
    </div>
  );
}
