# Voting dApp

## Deskripsi

Aplikasi voting on-chain yang memungkinkan pengguna untuk memilih kandidat secara transparan dan terdesentralisasi. Setiap alamat wallet hanya bisa memberikan satu suara (dijaga di level smart contract), dan hasil voting diperbarui secara real-time melalui event listening.

## Anggota Kelompok

| Nama | NRP | Kontribusi |
|------|-----|------------|
| Fico Simhanandi | 5027231002 | Smart Contract (Solidity, Testing, Deploy) |
| Michael Kenneth Salim | 5027231008 | Frontend UI/UX (React, Components, Styling) |
| Nathan Kho Pancras | 5027231002 | Integrasi Web3 (ethers.js, Wallet, Read/Write) |

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS v4 + Framer Motion
- **Smart Contract:** Solidity 0.8.24 + Hardhat
- **Web3 Library:** ethers.js v6
- **Wallet:** MetaMask
- **Routing:** React Router v7

## Fitur

- [x] Connect Wallet (MetaMask)
- [x] Menampilkan daftar kandidat (Read)
- [x] Menampilkan hasil voting / total votes (Read)
- [x] Cek status sudah vote atau belum (Read)
- [x] Cast vote untuk kandidat (Write)
- [x] Owner menambah kandidat baru (Write — Admin page)
- [x] Mencegah double voting (UI feedback + on-chain enforcement)
- [x] Loading state saat transaksi pending
- [x] Error handling user-friendly
- [x] Network detection (warning jika bukan Hardhat Local)
- [x] Live update via event listening (bonus)
- [x] Responsive design (mobile-friendly)
- [x] Multi-page navigation (Home, Vote, Results, Admin)

## Struktur Project

```
├── contracts/
│   └── Voting.sol              # Smart contract
├── frontend/
│   ├── src/
│   │   ├── components/         # ConnectWallet, NavBar, CandidateList, etc.
│   │   ├── hooks/              # useWallet, useContract
│   │   ├── pages/              # Home, Vote, Results, Admin
│   │   ├── utils/              # contract.js (address+ABI), helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── tests/
│   └── Voting.test.js          # 12 unit tests
├── scripts/
│   └── deploy.js
├── context/
│   └── project-03-dapp.md      # Project specification
├── hardhat.config.js
├── package.json
└── README.md
```

## Cara Menjalankan

### Prerequisites

- Node.js v18+
- MetaMask browser extension
- Git

### 1. Clone Repository

```bash
git clone <url-repo>
cd blockchain-project3-RumahMenur
```

### 2. Install Dependencies

```bash
# Root folder (smart contract)
npm install

# Frontend folder
cd frontend
npm install
```

### 3. Jalankan Local Blockchain

```bash
# Terminal 1 — biarkan berjalan
npx hardhat node
```

### 4. Deploy Smart Contract

```bash
# Terminal 2
npx hardhat run scripts/deploy.js --network localhost
```

Deploy script otomatis menulis address dan ABI ke `frontend/src/utils/contract.js`.

### 5. Setup MetaMask

1. Tambahkan network **Hardhat Local** di MetaMask:
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: ETH
2. Import salah satu private key yang dicetak oleh `npx hardhat node`

### 6. Jalankan Frontend

```bash
cd frontend
npm run dev
```

### 7. Buka Browser

http://localhost:5173

## Cara Penggunaan

1. Klik **Connect Wallet** di navbar
2. Di halaman **Vote**, pilih kandidat lalu klik **Cast Vote**
3. Konfirmasi transaksi di MetaMask
4. Lihat hasil di halaman **Results** (update real-time)
5. Halaman **Admin** tersedia untuk owner (menambah kandidat)
6. Coba vote lagi dengan akun yang sama — contract akan menolak

## Contract Tests

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

  12 passing
```
</details>

## Smart Contract

`contracts/Voting.sol` — fitur utama:

| Komponen | Detail |
|----------|--------|
| State Variables | `owner`, `candidates[]`, `totalVotes`, `hasVoted` mapping |
| Functions | `vote()`, `addCandidate()`, `getCandidate()`, `getAllCandidates()`, `getCandidateCount()` |
| Modifiers | `hasNotVoted`, `onlyOwner` |
| Events | `Voted`, `CandidateAdded` |

Model voting: multiple named candidates, single-choice, satu suara per address, bobot sama. Double-vote dicegah on-chain via mapping + modifier.

## Contract Address

- **Local:** `0x5FbDB2315678afecb367f032d93F642f64180aa3` (berubah tiap deploy ulang)
- **Sepolia (bonus):** `0x8549AB42C16F4D581BBE4253fe3534f6e2c4Ab2A`

## Deploy ke Sepolia

1. Buat akun di [Alchemy](https://www.alchemy.com) → buat app Ethereum Sepolia → copy HTTPS endpoint
2. Buat akun MetaMask throwaway, export private key, dan fund dengan test ETH dari faucet
3. Copy `.env.example` ke `.env` dan isi:

   ```bash
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/XXXXXXXX
   PRIVATE_KEY=0xyour_throwaway_private_key
   ```

4. Deploy:

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. Switch MetaMask ke Sepolia, jalankan frontend, dan vote — sekarang transaksi nyata di testnet.
