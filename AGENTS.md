# AGENTS.md

Guidance for AI coding agents (Claude Code) working in this repository.

> **Status:** Project scaffolded and working. Contract compiles, 12 unit tests
> pass, and the frontend builds. Local demo flow is wired end-to-end. Keep this
> file in sync as the project evolves so the agent never trusts stale information.

## Project

A **Voting dApp**: an on-chain voting application where users connect a wallet,
view candidates/proposals, cast a vote, and see results update. Double-voting must
be prevented at the contract level (not just the UI).

This is a 3-person university project (Module 12–15). Demo target: real, working
local flow — `npx hardhat node` → deploy → connect MetaMask → vote → see result.

## Tech Stack

- **Smart contract:** Solidity + Hardhat
- **Frontend:** React + Vite
- **Web3 library:** ethers.js **v6** (note: v6 API differs from v5 — see below)
- **Wallet:** MetaMask

## Repository Layout

```
contracts/            # Solidity (e.g. Voting.sol)
test/                 # Hardhat unit tests for the contract
scripts/deploy.js     # Deployment script
hardhat.config.js
frontend/
  src/
    components/       # ConnectWallet.jsx + voting UI components
    hooks/            # optional custom hooks (e.g. useContract.js)
    utils/
      contract.js     # CONTRACT_ADDRESS + CONTRACT_ABI  <-- must be updated after every deploy
      helpers.js
    App.jsx
    main.jsx
```

## Commands

Root (contract side):

```bash
npm install                                              # install contract deps
npx hardhat node                                         # run local chain (keep running)
npx hardhat test                                         # run contract tests
npx hardhat run scripts/deploy.js --network localhost    # deploy to local chain
```

Frontend:

```bash
cd frontend
npm install
npm run dev          # Vite dev server, http://localhost:5173
npm run build        # production build
```

## Critical Workflow Rule

After **every** redeploy, the contract address changes. The agent must copy the new
address from the deploy output into `frontend/src/utils/contract.js`. A mismatched
address is the most common cause of "nothing works" — check this first when reads
return empty or writes revert immediately.

## ethers.js v6 Conventions

This project uses v6. Do **not** write v5-style code. Specifically:

- Provider: `new ethers.BrowserProvider(window.ethereum)` (not `Web3Provider`)
- Signer: `await provider.getSigner()` returns a Promise — must be `await`ed
- BigInt: v6 returns native `bigint`, not BigNumber. Convert with `.toString()` for
  display; do arithmetic in `bigint`, not by mixing with `Number`.

## Smart Contract Requirements (minimums from the brief)

- ≥3 state variables, ≥4 functions, ≥1 modifier, ≥2 events, ≥1 mapping
- A `mapping(address => bool) hasVoted` (or similar) to enforce one-vote-per-address
- The double-vote guard lives in the contract via `require`, enforced by a modifier
  or inline check — the UI block is feedback only, not the security boundary
- Emit an event on each vote so the frontend can read results / optionally live-update

## Frontend Requirements (minimums from the brief)

- ≥4 components, one of which is `ConnectWallet`
- ≥2 read operations, ≥2 write operations
- Loading state for every pending transaction
- User-friendly error messages — never surface raw MetaMask/revert strings to users
- Network detection: warn if MetaMask is on the wrong network
- Display the connected account address
- Mobile-friendly / responsive

## Async + Error Handling Rules

- Every blockchain call is async — always `await`. A missing `await` on `tx.wait()`
  is a frequent bug; state must refresh only *after* confirmation.
- Wrap every contract interaction in try/catch with three explicit UI states:
  `pending`, `success`, `failed`.
- After a successful write, re-run the relevant read to refresh on-chain state rather
  than mutating local state optimistically (votes are the source of truth on-chain).

## Security / Don't

- Never commit private keys. Use `.env` + `.gitignore`. Hardhat node accounts are for
  local testing only.
- `.gitignore` must exclude `node_modules`, Hardhat `artifacts`, `cache`, and `.env`.
- Validate user input (e.g. a selected candidate ID is in range) before sending a tx.

## Things the Agent Should NOT Assume

- **Do not invent the contract address.** Read it from `frontend/src/utils/contract.js`;
  if it's a placeholder, the contract hasn't been deployed in this session — say so.
- **Do not assume testnet/hosting exist.** Local-only is the baseline; Sepolia deploy
  and Vercel/Netlify hosting are optional bonuses and may not be set up.
- Academic-integrity note: this is graded coursework where each member must be able to
  explain any line. Prefer clear, explainable code over clever abstractions, and add
  brief comments on non-obvious Web3 logic.

## Decisions Made (resolved kickoff TODOs)

- **Contract / voting model:** `Voting.sol`. Multiple named candidates, single-choice,
  one equally-weighted vote per address. Owner seeds the ballot at deploy time and can
  add candidates afterward (`addCandidate`, owner-only). Candidate ids are **1-based**;
  id `0` is invalid.
- **Contract address:** auto-managed. `scripts/deploy.js` writes the deployed address
  **and** ABI into `frontend/src/utils/contract.js` on every deploy — no manual copy
  step. The committed file is a placeholder (zero address); the UI shows "not deployed"
  until you run a deploy.
- **Node version:** developed on Node v24; v18+ is fine. Not pinned via `engines`.
- **CSS approach:** plain CSS, single global `frontend/src/index.css`. No Tailwind/
  Bootstrap — keeps it explainable and dependency-free.
- **Live-update (bonus):** implemented. `useContract` subscribes to the `Voted` event
  and refreshes tallies when any vote lands (including from other accounts). Writes
  also re-read on-chain state after confirmation regardless.
- **Test command:** `npx hardhat test` (or `npm test`). 12 tests, all passing.

## Wallet / Hook Architecture (how the frontend is wired)

- `hooks/useWallet.js` — owns the MetaMask connection: account, chainId, ethers v6
  `BrowserProvider`. Silent reconnect on load, reloads on `chainChanged`, tracks
  `accountsChanged`. Exposes `wrongNetwork` (expected chain id **31337**, Hardhat local).
- `hooks/useContract.js` — builds the ethers `Contract`, exposes reads
  (`getAllCandidates`, `totalVotes`, `hasVoted`) and writes (`castVote`, `addCandidate`),
  plus `refresh()`. Reads use the provider; writes fetch a signer lazily.
- `components/` — `ConnectWallet`, `NetworkBanner`, `CandidateList`, `AddCandidate`,
  `Notification`. `App.jsx` owns the pending/success/failed notification state.
- Error strings are mapped to friendly text in `utils/helpers.js` (`friendlyError`).