import { EXPECTED_NETWORK_NAME } from "../utils/helpers";

/**
 * Surfaces two blocking conditions the user must know about:
 *  - the contract address is still a placeholder (no deploy yet)
 *  - MetaMask is connected to the wrong network
 */
export default function NetworkBanner({ deployed, wrongNetwork, account }) {
  if (!deployed) {
    return (
      <div className="banner banner-error">
        The contract isn’t deployed yet. Run{" "}
        <code>npx hardhat run scripts/deploy.js --network localhost</code>, which
        writes the address into <code>frontend/src/utils/contract.js</code>.
      </div>
    );
  }

  if (account && wrongNetwork) {
    return (
      <div className="banner banner-warning">
        Wrong network. Switch MetaMask to <strong>{EXPECTED_NETWORK_NAME}</strong>{" "}
        to vote.
      </div>
    );
  }

  return null;
}
