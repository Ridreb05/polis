# Polis — Contracts

Solidity contracts for **Polis**, the on-chain governance & council election platform.

## Contract

`contracts/Polis.sol` implements the full election lifecycle:

- **Stewards** open elections (`createVotingEvent`) with a title, purpose, shared access key, voting window and ballot cap.
- **Nominees** apply to appear on the ballot (`registerCandidate`) and are approved by the steward (`approveCandidate`).
- **Members** join with the access key (`registerVoter`) and cast a single vote (`vote`) during the voting window.
- Results (`getVotingResults`) become readable once the steward closes the election (`endVotingEvent`).

## Setup

```bash
npm install
cp .env.example .env   # add your RPC URL and deployer key
```

## Commands

```bash
npm run compile        # compile contracts
npm test               # run the test suite
npm run node           # start a local hardhat node
npm run deploy:local   # deploy to the local node
npm run deploy:aia     # deploy to AIA testnet (chainId 1320)
```

Deploying writes the address and ABI to `deployments.json`. Copy the address into
`client/.env` as `NEXT_PUBLIC_CONTRACT_ADDRESS` and, if the ABI changed, sync it
into `client/lib/constants.js`.
