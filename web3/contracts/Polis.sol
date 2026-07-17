// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Polis — On-chain governance & council elections
/// @notice Stewards open elections, members join with a shared access key,
///         nominees are approved, and members cast a single verifiable vote.
///         Every action is settled on-chain and publicly auditable.
/// @dev Function selectors are kept stable so existing deployments and ABIs
///      remain compatible; only naming/semantics were rebranded around the
///      governance use case. An "election" is stored as a `VotingEvent`.
contract Polis {
    // Total number of elections ever created (also the id of the next one).
    uint256 public eventCount;

    /// @notice A candidate standing for election (a "nominee").
    struct Candidate {
        string name;              // Display name of the nominee
        address candidateAddress; // Wallet address of the nominee
        uint256 voteCount;        // Votes received so far
        bool requested;           // True once the nominee has applied
        bool registered;          // True once the steward has approved them
    }

    /// @notice A governance election.
    struct VotingEvent {
        string name;                              // Title of the election
        string purpose;                           // What is being decided
        address organizer;                        // Steward who opened it
        string key;                               // Shared access key (hashed on-chain compare)
        uint256 startTime;                        // Voting opens (unix seconds)
        uint256 endTime;                          // Voting closes (unix seconds)
        uint256 maxCandidates;                    // Ballot size cap
        bool active;                              // Whether the election is live
        mapping(address => bool) hasVoted;        // One-vote-per-member guard
        mapping(address => bool) registeredVoters; // Approved members
        Candidate[] candidates;                   // Ballot
    }

    // election id => election
    mapping(uint256 => VotingEvent) public votingEvents;

    // --- Events -------------------------------------------------------------
    event VotingEventCreated(uint256 eventId, string name, address organizer);
    event VoterRegistered(uint256 eventId, address voter);
    event CandidateRegistered(uint256 eventId, string name, address candidate);
    event CandidateRequestMade(uint256 eventId, string name, address candidate);
    event Voted(uint256 eventId, address candidate, address voter);
    event VotingEventEnded(uint256 eventId);

    // --- Modifiers ----------------------------------------------------------
    modifier onlyOrganizer(uint256 eventId) {
        require(msg.sender == votingEvents[eventId].organizer, "Not the steward");
        _;
    }

    modifier votingStarted(uint256 eventId) {
        require(block.timestamp >= votingEvents[eventId].startTime, "Voting has not started yet");
        require(block.timestamp < votingEvents[eventId].endTime, "Voting has ended");
        _;
    }

    // --- Steward: create an election ---------------------------------------
    /// @notice Open a new election.
    /// @param _name Title shown to members.
    /// @param _purpose Description of the decision at stake.
    /// @param _key Shared access key members and nominees must present.
    /// @param _startTime Unix timestamp when voting opens (>= 2h out).
    /// @param _duration Length of the voting window in seconds (>= 1h).
    /// @param _maxCandidates Maximum ballot size (>= 2).
    function createVotingEvent(
        string memory _name,
        string memory _purpose,
        string memory _key,
        uint256 _startTime,
        uint256 _duration,
        uint256 _maxCandidates
    ) public {
        require(_startTime >= block.timestamp + 2 hours, "Start time must be at least 2 hours from now");
        require(_duration >= 1 hours, "Duration must be at least 1 hour");
        require(_maxCandidates >= 2, "There must be at least 2 nominees");

        VotingEvent storage newEvent = votingEvents[eventCount];
        newEvent.name = _name;
        newEvent.purpose = _purpose;
        newEvent.organizer = msg.sender;
        newEvent.key = _key;
        newEvent.startTime = _startTime;
        newEvent.endTime = _startTime + _duration;
        newEvent.maxCandidates = _maxCandidates;
        newEvent.active = true;

        emit VotingEventCreated(eventCount, _name, msg.sender);
        eventCount++;
    }

    // --- Member: join an election ------------------------------------------
    /// @notice Register as an eligible member (voter) before voting opens.
    function registerVoter(uint256 eventId, string memory _key) public {
        VotingEvent storage voting = votingEvents[eventId];
        require(voting.active, "Election is not active");
        require(block.timestamp < voting.startTime, "Voting has already started");
        require(!voting.registeredVoters[msg.sender], "Already registered as a member");
        require(msg.sender != voting.organizer, "Steward cannot register as a member");

        for (uint256 i = 0; i < voting.candidates.length; i++) {
            require(
                voting.candidates[i].candidateAddress != msg.sender,
                "Nominees cannot register as members"
            );
        }

        require(
            keccak256(abi.encodePacked(_key)) == keccak256(abi.encodePacked(voting.key)),
            "Invalid key"
        );

        voting.registeredVoters[msg.sender] = true;
        emit VoterRegistered(eventId, msg.sender);
    }

    function isVoterRegistered(uint256 eventId, address voter) public view returns (bool) {
        return votingEvents[eventId].registeredVoters[voter];
    }

    // --- Nominee: stand for election ---------------------------------------
    /// @notice Apply to appear on the ballot as a nominee.
    function registerCandidate(uint256 eventId, string memory _name, string memory _key) public {
        VotingEvent storage voting = votingEvents[eventId];
        require(voting.active, "Election is not active");
        require(block.timestamp < voting.startTime, "Voting has already started");
        require(voting.candidates.length < voting.maxCandidates, "Ballot is full");
        require(!voting.registeredVoters[msg.sender], "Members cannot stand as nominees");
        require(msg.sender != voting.organizer, "Steward cannot stand as a nominee");

        require(
            keccak256(abi.encodePacked(_key)) == keccak256(abi.encodePacked(voting.key)),
            "Invalid key"
        );

        for (uint256 i = 0; i < voting.candidates.length; i++) {
            require(
                voting.candidates[i].candidateAddress != msg.sender,
                "You have already applied as a nominee"
            );
        }

        voting.candidates.push(Candidate(_name, msg.sender, 0, true, false));
        emit CandidateRequestMade(eventId, _name, msg.sender);
    }

    /// @notice Whether an address has applied to appear on the ballot.
    function isCandidateRegistered(uint256 eventId, address candidate) public view returns (bool) {
        VotingEvent storage voting = votingEvents[eventId];
        for (uint256 i = 0; i < voting.candidates.length; i++) {
            if (voting.candidates[i].candidateAddress == candidate) {
                return voting.candidates[i].requested;
            }
        }
        return false;
    }

    // --- Steward: approve a nominee ----------------------------------------
    function approveCandidate(uint256 eventId, address candidate) public onlyOrganizer(eventId) {
        VotingEvent storage voting = votingEvents[eventId];
        require(voting.active, "Election is not active");
        require(block.timestamp < voting.startTime, "Voting has already started");

        for (uint256 i = 0; i < voting.candidates.length; i++) {
            if (voting.candidates[i].candidateAddress == candidate) {
                require(voting.candidates[i].requested, "Nominee has not applied");
                voting.candidates[i].registered = true;
                emit CandidateRegistered(eventId, voting.candidates[i].name, candidate);
                return;
            }
        }
        revert("Nominee not found");
    }

    // --- Member: cast a vote -----------------------------------------------
    function vote(uint256 eventId, address candidate) public votingStarted(eventId) {
        VotingEvent storage voting = votingEvents[eventId];
        require(voting.registeredVoters[msg.sender], "You are not an approved member");
        require(!voting.hasVoted[msg.sender], "You have already voted");

        for (uint256 i = 0; i < voting.candidates.length; i++) {
            if (voting.candidates[i].candidateAddress == candidate && voting.candidates[i].registered) {
                voting.candidates[i].voteCount++;
                voting.hasVoted[msg.sender] = true;
                emit Voted(eventId, candidate, msg.sender);
                return;
            }
        }
        revert("Nominee not found or not approved");
    }

    // --- Reads -------------------------------------------------------------
    function getVotingEvent(uint256 eventId)
        public
        view
        returns (
            string memory name,
            string memory purpose,
            address organizer,
            uint256 startTime,
            uint256 endTime,
            bool active
        )
    {
        VotingEvent storage voting = votingEvents[eventId];
        return (voting.name, voting.purpose, voting.organizer, voting.startTime, voting.endTime, voting.active);
    }

    function getCandidates(uint256 eventId) public view returns (Candidate[] memory) {
        return votingEvents[eventId].candidates;
    }

    function getVoteCount(uint256 eventId, address candidate) public view returns (uint256) {
        VotingEvent storage voting = votingEvents[eventId];
        for (uint256 i = 0; i < voting.candidates.length; i++) {
            if (voting.candidates[i].candidateAddress == candidate) {
                return voting.candidates[i].voteCount;
            }
        }
        revert("Nominee not found");
    }

    /// @notice The address of the leading nominee once an election has closed.
    function getVotingResults(uint256 eventId) public view returns (address winner) {
        VotingEvent storage voting = votingEvents[eventId];
        require(!voting.active, "Election is still active");

        address topCandidate;
        uint256 highestVotes = 0;
        for (uint256 i = 0; i < voting.candidates.length; i++) {
            if (voting.candidates[i].voteCount > highestVotes) {
                highestVotes = voting.candidates[i].voteCount;
                topCandidate = voting.candidates[i].candidateAddress;
            }
        }
        return topCandidate;
    }

    // --- Steward: close an election ----------------------------------------
    /// @notice Close an election after voting has started so results can be read.
    /// @dev Simplified from the legacy implementation: a steward may close the
    ///      election any time after it has opened. This removes the previous
    ///      unsatisfiable "all members must have voted" guard.
    function endVotingEvent(uint256 eventId) public onlyOrganizer(eventId) {
        VotingEvent storage voting = votingEvents[eventId];
        require(block.timestamp > voting.startTime, "Election has not started yet");
        require(voting.active, "Election is already closed");
        voting.active = false;
        emit VotingEventEnded(eventId);
    }
}
