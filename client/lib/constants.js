// Auto-generated from web3/contracts/Polis.sol — the Polis governance contract ABI.
// If you change the contract, recompile and update this file (or import deployments.json).

export const Polis = {
  contractName: "Polis",
  sourceName: "contracts/Polis.sol",
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        }
      ],
      "name": "CandidateRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        }
      ],
      "name": "CandidateRequestMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "VoterRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        }
      ],
      "name": "VotingEventCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "VotingEventEnded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        }
      ],
      "name": "approveCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_purpose",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_key",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxCandidates",
          "type": "uint256"
        }
      ],
      "name": "createVotingEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "endVotingEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "eventCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "getCandidates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "candidateAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "requested",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "registered",
              "type": "bool"
            }
          ],
          "internalType": "struct Polis.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        }
      ],
      "name": "getVoteCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "getVotingEvent",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "purpose",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "getVotingResults",
      "outputs": [
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        }
      ],
      "name": "isCandidateRegistered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "isVoterRegistered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_key",
          "type": "string"
        }
      ],
      "name": "registerCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_key",
          "type": "string"
        }
      ],
      "name": "registerVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "candidate",
          "type": "address"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "votingEvents",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "purpose",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "key",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxCandidates",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
};

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
