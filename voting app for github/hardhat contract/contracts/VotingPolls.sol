// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingPolls {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Poll {
        string name;
        Candidate[] candidates;
    }

    Poll[] public polls;
    address owner;
    mapping(address => mapping(uint256 => bool)) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    constructor(uint256 _durationInMinutes) {
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function addPoll(string memory _name, string[] memory _candidateNames) public onlyOwner {
        Poll storage newPoll = polls.push(); // Push a new poll
        newPoll.name = _name;
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            newPoll.candidates.push(Candidate({
            name: _candidateNames[i],
            voteCount: 0
            }));
        }
    }

    function getAllPolls() public view returns (Poll[] memory) {
        return polls;
    }

    function deletePoll(uint256 _pollIndex) public onlyOwner {
        require(_pollIndex < polls.length, "Poll not found.");
        for (uint256 i = _pollIndex; i < polls.length - 1; i++) {
            polls[i] = polls[i + 1];
        }
        polls.pop();
    }

    function addCandidate(uint256 _pollIndex, string memory _name) public onlyOwner {
        require(_pollIndex < polls.length, "Poll not found.");
        polls[_pollIndex].candidates.push(Candidate({
        name: _name,
        voteCount: 0
        }));
    }

    function deleteCandidate(uint256 _pollIndex, string memory _name) public onlyOwner {
        require(_pollIndex < polls.length, "Poll not found.");
        uint256 index = findCandidateIndex(_pollIndex, _name);
        require(index < polls[_pollIndex].candidates.length, "Candidate not found.");

        for (uint256 i = index; i < polls[_pollIndex].candidates.length - 1; i++) {
            polls[_pollIndex].candidates[i] = polls[_pollIndex].candidates[i + 1];
        }
        polls[_pollIndex].candidates.pop();
    }

    function findCandidateIndex(uint256 _pollIndex, string memory _name) internal view returns (uint256) {
        for (uint256 i = 0; i < polls[_pollIndex].candidates.length; i++) {
            if (keccak256(abi.encodePacked(polls[_pollIndex].candidates[i].name)) == keccak256(abi.encodePacked(_name))) {
                return i;
            }
        }
        revert("Candidate not found.");
    }

    function vote(uint256 _pollIndex, uint256 _candidateIndex) public {
        require(!voters[msg.sender][_pollIndex], "You have already voted.");
        require(_pollIndex < polls.length, "Invalid poll index.");
        require(_candidateIndex < polls[_pollIndex].candidates.length, "Invalid candidate index.");

        polls[_pollIndex].candidates[_candidateIndex].voteCount++;
        voters[msg.sender][_pollIndex] = true;
    }

    function getAllVotesOfCandidates(uint256 _pollIndex) public view returns (Candidate[] memory) {
        require(_pollIndex < polls.length, "Invalid poll index.");
        return polls[_pollIndex].candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }
}
