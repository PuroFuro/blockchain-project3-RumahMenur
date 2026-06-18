// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Voting
 * @notice A simple on-chain voting contract for a fixed set of candidates.
 *         One address may vote exactly once. The double-vote guard is enforced
 *         here in the contract (via a modifier + require), NOT in the UI.
 *
 * Voting model: multiple named candidates, single-choice, one vote per address,
 * equal weight. Anyone can read results; the owner seeds candidates at deploy time.
 */
contract Voting {
    // --- Types ---------------------------------------------------------------

    struct Candidate {
        uint256 id;        // 1-based id (0 is treated as "invalid")
        string name;       // human-readable label shown in the UI
        uint256 voteCount; // running tally
    }

    // --- State variables (>= 3) ---------------------------------------------

    address public immutable owner;          // who deployed the contract
    Candidate[] private candidates;          // the ballot
    uint256 public totalVotes;               // sum of all votes cast

    // mapping (>= 1): enforces one-vote-per-address
    mapping(address => bool) public hasVoted;

    // --- Events (>= 2) -------------------------------------------------------

    event Voted(address indexed voter, uint256 indexed candidateId, uint256 newVoteCount);
    event CandidateAdded(uint256 indexed candidateId, string name);

    // --- Modifier (>= 1) -----------------------------------------------------

    /// @dev Reverts if msg.sender has already voted. This is the security boundary.
    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "Voting: address has already voted");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Voting: caller is not the owner");
        _;
    }

    // --- Constructor ---------------------------------------------------------

    /// @param candidateNames initial ballot, e.g. ["Alice", "Bob", "Carol"]
    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            _addCandidate(candidateNames[i]);
        }
    }

    // --- Functions (>= 4) ----------------------------------------------------

    /// @notice Cast a vote for `candidateId`. One vote per address, ever.
    function vote(uint256 candidateId) external hasNotVoted {
        require(_isValidCandidate(candidateId), "Voting: invalid candidate id");

        hasVoted[msg.sender] = true;
        Candidate storage c = candidates[candidateId - 1];
        c.voteCount += 1;
        totalVotes += 1;

        emit Voted(msg.sender, candidateId, c.voteCount);
    }

    /// @notice Add a candidate after deployment (owner only).
    function addCandidate(string calldata name) external onlyOwner {
        _addCandidate(name);
    }

    /// @notice Number of candidates on the ballot.
    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    /// @notice Read a single candidate by id.
    function getCandidate(uint256 candidateId)
        external
        view
        returns (uint256 id, string memory name, uint256 voteCount)
    {
        require(_isValidCandidate(candidateId), "Voting: invalid candidate id");
        Candidate storage c = candidates[candidateId - 1];
        return (c.id, c.name, c.voteCount);
    }

    /// @notice Read the full ballot in one call (convenient for the frontend).
    function getAllCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    // --- Internal helpers ----------------------------------------------------

    function _addCandidate(string memory name) internal {
        require(bytes(name).length > 0, "Voting: empty candidate name");
        uint256 id = candidates.length + 1; // 1-based
        candidates.push(Candidate({id: id, name: name, voteCount: 0}));
        emit CandidateAdded(id, name);
    }

    function _isValidCandidate(uint256 candidateId) internal view returns (bool) {
        return candidateId >= 1 && candidateId <= candidates.length;
    }
}
