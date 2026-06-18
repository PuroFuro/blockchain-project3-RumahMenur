# Voting dApp

On-chain voting application. Connect a wallet, view candidates, cast one vote
(double-voting blocked at the contract level), watch results update live.

**Stack:** Solidity + Hardhat · React + Vite · ethers.js v6 · MetaMask


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

<details>
<summary>Expected output</summary>

```
  Voting
    deployment
      ✔ sets the owner to the deployer
      ✔ seeds the ballot with the constructor candidates
      ✔ starts with zero total votes
    voting
      ✔ records a vote and increments the tally
      ✔ emits a Voted event with the new count
      ✔ prevents the same address from voting twice
      ✔ rejects an out-of-range candidate id
      ✔ lets different addresses vote independently
    addCandidate
      ✔ lets the owner add a candidate
      ✔ rejects a non-owner adding a candidate
      ✔ rejects an empty candidate name
    getAllCandidates
      ✔ returns the full ballot

  12 passing (755ms)
```
</details>

## What the contract does

`Voting.sol`: multiple named candidates, one equally-weighted vote per address,
enforced on-chain via a `hasVoted` mapping + `require` in a modifier. Emits a
`Voted` event on each vote (the frontend listens to it for live updates). The
deployer is the owner and can add candidates.

## Sepolia

Sepolia is a public Ethereum test network — a real, shared blockchain that uses
free, fake ETH. Deploying there gives the contract a permanent public address
anyone can reach. The project is already wired for it: `hardhat.config.js` adds
the `sepolia` network only when the env vars below are present, and the frontend
already accepts both Hardhat Local (31337) and Sepolia (11155111).

### Setup

1. Get a Sepolia **RPC URL** from a free [Alchemy](https://www.alchemy.com) or
   [Infura](https://www.infura.io) app (Ethereum → Sepolia, copy the HTTPS endpoint).
2. Create a **throwaway** MetaMask account and export its private key
   (⋮ → Account details → Show private key). Use an account with no real funds.
3. Fund it with free test ETH from a faucet
   ([sepoliafaucet.com](https://sepoliafaucet.com) or the Google Cloud faucet).
4. Copy `.env.example` to `.env` and fill in both values:

   ```bash
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/XXXXXXXX
   PRIVATE_KEY=0xyour_throwaway_private_key
   ```

### Deploy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```