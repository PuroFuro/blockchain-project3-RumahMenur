import { useCallback, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { isSupportedChain } from "../utils/helpers";

/**
 * Owns the MetaMask connection: account, chainId, and an ethers v6
 * BrowserProvider. Re-renders when the user switches account or network.
 *
 * ethers v6 notes (see AGENTS.md):
 *  - new BrowserProvider(window.ethereum)  (NOT Web3Provider)
 *  - provider.getSigner() returns a Promise — callers must await it
 */
export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum;

  const refreshChain = useCallback(async (prov) => {
    const network = await prov.getNetwork();
    setChainId(network.chainId);
  }, []);

  const connect = useCallback(async () => {
    if (!hasMetaMask) {
      setError("MetaMask not detected. Please install the MetaMask extension.");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const prov = new BrowserProvider(window.ethereum);
      const accounts = await prov.send("eth_requestAccounts", []);
      setProvider(prov);
      setAccount(accounts[0] ?? null);
      await refreshChain(prov);
    } catch (err) {
      setError(
        err?.code === 4001
          ? "Connection request was rejected."
          : "Could not connect to MetaMask."
      );
    } finally {
      setConnecting(false);
    }
  }, [hasMetaMask, refreshChain]);

  // Re-attach a provider silently if the site is already authorized, and
  // subscribe to MetaMask account/network change events.
  useEffect(() => {
    if (!hasMetaMask) return;

    const prov = new BrowserProvider(window.ethereum);

    // Silent reconnect (does not pop the MetaMask prompt).
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(async (accounts) => {
        if (accounts && accounts.length > 0) {
          setProvider(prov);
          setAccount(accounts[0]);
          await refreshChain(prov);
        }
      })
      .catch(() => {});

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
    };
    // Per MetaMask docs, the simplest correct response to a chain change is to
    // reload so all provider-derived state is rebuilt cleanly.
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [hasMetaMask, refreshChain]);

  const wrongNetwork = chainId != null && !isSupportedChain(chainId);

  return {
    hasMetaMask,
    account,
    chainId,
    provider,
    connecting,
    error,
    wrongNetwork,
    connect,
  };
}
