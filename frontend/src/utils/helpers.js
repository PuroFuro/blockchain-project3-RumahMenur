// Small, dependency-free helpers shared across components.

// Hardhat's local chain id. The frontend warns if MetaMask is on anything else.
// (31337 = 0x7a69. The default `npx hardhat node` chain.)
export const EXPECTED_CHAIN_ID = 31337n;
export const EXPECTED_NETWORK_NAME = "Hardhat Local (31337)";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/** True when the deploy script has not yet written a real address. */
export function isContractDeployed(address) {
  return !!address && address.toLowerCase() !== ZERO_ADDRESS;
}

/** Shorten an address for display: 0x1234...abcd */
export function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Turn a raw wallet/contract error into a short, human-friendly message.
 * Per AGENTS.md: never surface raw MetaMask/revert strings to users.
 */
export function friendlyError(err) {
  if (!err) return "Something went wrong.";

  // User clicked "reject" in MetaMask.
  if (err.code === "ACTION_REJECTED" || err.code === 4001) {
    return "Transaction rejected in your wallet.";
  }

  // A require(...) in the contract reverted. ethers v6 surfaces the reason string
  // on err.reason; fall back to digging through nested error objects.
  const reason =
    err.reason ||
    err?.info?.error?.message ||
    err?.error?.message ||
    err.shortMessage ||
    err.message ||
    "";

  if (reason.includes("already voted")) {
    return "This account has already voted. Each address can vote only once.";
  }
  if (reason.includes("invalid candidate")) {
    return "Please choose a valid candidate before voting.";
  }
  if (reason.toLowerCase().includes("insufficient funds")) {
    return "This account has no ETH to pay for gas. On the local chain, import a Hardhat test account.";
  }

  // Last resort: keep it generic but not scary.
  return "The transaction could not be completed. Please try again.";
}
