import { shortenAddress } from "../utils/helpers";

/**
 * Connect button + connected-account display. One of the required components.
 */
export default function ConnectWallet({
  hasMetaMask,
  account,
  connecting,
  onConnect,
}) {
  if (!hasMetaMask) {
    return (
      <a
        className="btn btn-warning"
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer"
      >
        Install MetaMask
      </a>
    );
  }

  if (account) {
    return (
      <div className="account-pill" title={account}>
        <span className="dot" /> {shortenAddress(account)}
      </div>
    );
  }

  return (
    <button className="btn btn-primary" onClick={onConnect} disabled={connecting}>
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
