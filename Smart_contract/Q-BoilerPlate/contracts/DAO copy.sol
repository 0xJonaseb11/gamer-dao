// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAO {
   
      // struct for proposal
    struct Proposal {
        string description;
        uint voteCount;
        uint yesVotes;
        uint noVotes;
        bool executed;
    }

        // struct for member
    struct Member {
        address memberAddress;
        uint memberSince;
        uint tokenBalance;
    }

    // state variables
    address[] public members;

    mapping(address => bool) public isMember;
    mapping(address => Member) public memberInfo;
    mapping(address => mapping(uint => bool)) public votes;

    Proposal[] public proposals;
    address public owner;

    event ProposalCreated(uint indexed proposalId, string description);
    event VoteCast(address indexed voter, uint indexed proposalId, uint tokenAmount);
    event ProposalAccepted(string message);
    event ProposalRejected(string rejected);



}