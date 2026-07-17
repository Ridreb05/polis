<div align="center">

# ◭ Polis

### Governance, decided together

**Polis** is a decentralized governance platform for DAOs, councils and communities. Open an election, approve nominees, and let members cast verifiable, tamper-proof votes — every step settled on-chain and open to audit.

Built on the **AIA blockchain**.

</div>

---

## Overview

Traditional org voting relies on trust in whoever counts the ballots. Polis removes that trust assumption. A **steward** opens an election with a shared access key and a voting window. Community members **nominate** themselves for the ballot and are **approved** by the steward. Approved **members** then cast a single, one-wallet-one-vote ballot during the window. When the steward closes the election, the result is computed on-chain and independently verifiable by anyone.

Polis is a fit for DAO council seats, cooperative board elections, nonprofit governance, guild leadership, working-group representatives — any group that needs to decide together, transparently.

## Features

- **Tamper-proof by design** — every nomination, approval and vote is a transaction on the AIA blockchain. Results can't be altered or rewritten.
- **Radically transparent** — the full ballot and tally are public and auditable on the block explorer.
- **Sybil-resistant access** — gated membership via a shared access key plus one-wallet-one-vote.
- **End-to-end flow** — create → nominate → approve → vote → results, all in one app.
- **Live results & analytics** — real-time standings, leader share, turnout and a winner reveal on close.
- **Steward tools** — a dedicated panel to review and approve nominees, and close elections.
- **Premium, responsive UI** — a modern dark Web3 interface with live countdowns, empty/loading/error states and accessible controls.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, JavaScript |
| Styling | Tailwind CSS, custom design system, `lucide-react` icons |
| Web3 | ethers.js v6, injected wallet (MetaMask) |
| State | React Context + service/hook layer |
| Contracts | Solidity `^0.8.24`, Hardhat |
| Network | AIA Testnet (chain ID `1320`) |

## Project structure

```
polis/
├── client/                     # Next.js frontend
│   ├── app/
│   │   ├── layout.js           # Root layout, metadata, global chrome
│   │   ├── page.jsx            # Landing page
│   │   └── elections/
│   │       ├── page.jsx        # Browse elections
│   │       ├── create/         # Create an election
│   │       └── [id]/
│   │           ├── page.jsx    # Election detail hub
│   │           ├── join/       # Register as a member
│   │           ├── nominate/   # Stand as a nominee
│   │           ├── vote/       # Cast a vote
│   │           ├── results/    # Results & analytics
│   │           └── manage/     # Steward: approve nominees
│   ├── components/             # UI + feature components (ui/ primitives)
│   ├── context/PolisContext.jsx# Wallet + election state
│   ├── services/               # contract.js, network.js (ethers plumbing)
│   ├── hooks/                  # useCountdown, use-toast
│   └── lib/                    # constants (ABI), utils
└── web3/                        # Hardhat project
    ├── contracts/Polis.sol      # Governance contract
    ├── scripts/deploy.js
    └── test/Polis.test.js
```

## Getting started

### Prerequisites

- Node.js 18+
- A Web3 wallet (e.g. MetaMask)

### 1. Frontend

```bash
cd client
npm install
cp .env.example .env      # set NEXT_PUBLIC_CONTRACT_ADDRESS
npm run dev               # http://localhost:3000
```

### 2. Contracts

```bash
cd web3
npm install
cp .env.example .env      # set API_URL and PRIVATE_KEY
npm test                  # run the test suite
npm run deploy:aia        # deploy to AIA Testnet
```

## Environment variables

**`client/.env`**

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Address of the deployed Polis contract |

**`web3/.env`**

| Variable | Description |
| --- | --- |
| `API_URL` | RPC endpoint for the target network |
| `PRIVATE_KEY` | Deployer private key (no `0x` prefix) |

## Smart contract deployment

```bash
cd web3
npm run deploy:aia
```

Deployment writes the address and ABI to `web3/deployments.json`. Copy the
address into `client/.env` as `NEXT_PUBLIC_CONTRACT_ADDRESS`. If you change the
contract's interface, recompile and sync the ABI into `client/lib/constants.js`.

A reference deployment lives on AIA Testnet — see the address in
`client/.env.example`.

## Usage guide

1. **Connect wallet** — Polis auto-switches your wallet to AIA Testnet (adding it if needed).
2. **Create an election** — set a title, purpose, shared access key, voting window and ballot cap. Voting opens at least 2.5 hours out so people can register.
3. **Nominate** — candidates apply with the access key; the steward approves the ballot from **Manage nominees**.
4. **Join as a member** — eligible voters register with the same access key before voting opens.
5. **Vote** — during the window, each member casts one vote.
6. **Results** — watch live standings, then the steward closes the election to lock the final, verifiable result.

## Roadmap

- Weighted / token-based voting power
- Ranked-choice and multi-seat elections
- Merkle-allowlist membership (no shared key)
- Gasless voting via meta-transactions
- Election templates and recurring governance cycles
- Multi-chain deployments and an indexer/subgraph

## License

MIT
