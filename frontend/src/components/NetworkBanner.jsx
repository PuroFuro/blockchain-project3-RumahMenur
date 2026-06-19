import { SUPPORTED_NETWORK_NAMES } from "../utils/helpers";

/**
 * Surfaces two blocking conditions the user must know about:
 *  - the contract address is still a placeholder (no deploy yet)
 *  - MetaMask is connected to the wrong network
 */
export default function NetworkBanner({ deployed, wrongNetwork, account }) {
  if (!deployed) {
    return (
      <div className="rounded-xl border border-error/40 bg-error/10 text-error px-4 py-3 mb-4 text-sm">
        The contract isn’t deployed yet. Run{" "}
        <code className="font-mono bg-bg/60 px-1 py-0.5 rounded">
          npx hardhat run scripts/deploy.js --network localhost
        </code>
        , which writes the address into{" "}
        <code className="font-mono bg-bg/60 px-1 py-0.5 rounded">
          frontend/src/utils/contract.js
        </code>
        .
      </div>
    );
  }

  if (account && wrongNetwork) {
    return (
      <div className="rounded-xl border border-warning/40 bg-warning/10 text-warning px-4 py-3 mb-4 text-sm">
        Wrong network. Switch MetaMask to{" "}
        <strong>{SUPPORTED_NETWORK_NAMES}</strong> to vote.
      </div>
    );
  }

  return null;
}
