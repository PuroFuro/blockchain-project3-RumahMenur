import { useState } from "react";

/**
 * Owner-only write: add a candidate to the ballot. The contract enforces
 * onlyOwner — if a non-owner submits, the tx reverts and the error is shown
 * via the shared notification. This component is the second write operation.
 */
export default function AddCandidate({ disabled, pending, onAdd }) {
  const [name, setName] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return; // basic input validation before sending a tx
    await onAdd(trimmed);
    setName("");
  };

  return (
    <form className="add-candidate" onSubmit={submit}>
      <input
        type="text"
        placeholder="New candidate name"
        value={name}
        maxLength={32}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled || pending}
      />
      <button
        className="btn btn-secondary"
        type="submit"
        disabled={disabled || pending || name.trim().length === 0}
      >
        {pending ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
