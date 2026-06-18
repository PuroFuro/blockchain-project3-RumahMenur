# Voting dApp

On-chain voting application. Connect a wallet, view candidates, cast one vote
(double-voting blocked at the contract level), watch results update live.

**Stack:** Solidity + Hardhat · React + Vite · ethers.js v6 · MetaMask

> For agent/contributor conventions and architecture notes, see [AGENTS.md](./AGENTS.md).

## Demo flow (local)

Open **two terminals**.

**Terminal 1 — local chain (keep running):**

```bash
npm install
npx hardhat node
```

**Terminal 2 — deploy + frontend:**

```bash
# Deploy. This also writes the address + ABI into the frontend automatically.
npx hardhat run scripts/deploy.js --network localhost

cd frontend
npm install
npm run dev          # http://localhost:5173
```

**In the browser:**

1. In MetaMask, add/select the **Hardhat Local** network (RPC `http://127.0.0.1:8545`, chain id `31337`).
2. Import one of the test accounts printed by `npx hardhat node` (use its private key).
3. Click **Connect Wallet**, pick a candidate, **Vote**, and watch the tally update.
4. Try voting again with the same account — the contract rejects it.

## Contract tests

```bash
npx hardhat test     # 12 tests
```

## What the contract does

`Voting.sol`: multiple named candidates, one equally-weighted vote per address,
enforced on-chain via a `hasVoted` mapping + `require` in a modifier. Emits a
`Voted` event on each vote (the frontend listens to it for live updates). The
deployer is the owner and can add candidates.

## Optional: Sepolia (bonus)

Copy `.env.example` to `.env`, fill in `SEPOLIA_RPC_URL` and a throwaway
`PRIVATE_KEY`, then:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Never commit `.env`.
