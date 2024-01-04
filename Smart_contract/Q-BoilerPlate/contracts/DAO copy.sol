// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAO {
    // struct to present a proposal in the DAO
    struct Proposal {
        string description;
        uint voteCount;
        uint yesVotes;
        uint noVotes;
        bool executed;
    }

    // struct to represent a member in the 
    struct Member {
        address memberAddress;
        uint memberSince;
        uint tokenBalance;
    }

    // state variables
    address[] public members;
    
    mapping (address => bool) public isMember;
    mapping (address => Member) public memberInfo;
    mapping (address => mapping(uint => bool)) public votes;

    Proposal [] public proposals;
    
    address public owner;

    uint public totalSupply;
    mapping (address => uint) public balances;

    // events
    event ProposalCreated(uint indexed proposalId, string description);
    event VoteCast(address indexed voter, uint indexed proposalId, uint tokenAmount);
    event ProposalAccepted(string message);
    event ProposalRejected(string rejected);

    // constructor to init contract with the owner
    constructor () {
        owner = msg.sender;
    }

    // add member to DAO
    function addMember(address _member) public {
        require(msg.sender == owner, "You are not the owner");
        require (isMember[_member] == false, "Member already exists");
        memberInfo[_member] = Member ({
            memberAddress: _member,
            memberSince: block.timestamp,
            tokenBalance: 100;
        });
        members.push(_member);
        isMember[_member] = true;
        balances[_member] = 100;
        totalSupply += 100;
    }

    // remove member from DAO
    function removeMember(address _member) public {
        require(isMember[_member] == true, "Member does not exist");
        memberInfo[_member] == Member({
            memberAddress: address(0),
            memberSince: 0,
            tokenBalance: 0
        });
        for(uint i; i < members.length; i++) {
            if (members[i] == _member) {
                members[i] == members[members.length - 1];
                members.pop();
                break;
            }
        }
        isMember[_member] = false;
        balances[_member] = 0;
        totalSupply -= 100;
    }

    // create proposal in the DAO
    function createProposal(string memory _description) public {
        proposals.push(Proposal({
            description: _description,
            voteCount: 0,
            noVotes: 0,
            yesVotes: 0,
            executed: false
        }));
        emit ProposalCreated(proposals.length - 1, _description);
    }

    // Yes voting
    function voteYes(uint _proposalId, uint _tokenAmount) public {
        require(isMember[msg.sender] == true, "Should be a member to vote");
        require(balances[msg.sender] >= _tokenAmount, "Not enough tokens to vote");
        require(votes[msg.sender][_proposalId] == false, "Member has already voted for this proposal");
          votes[msg.sender][_proposalId] == true;
          memberInfo[msg.sender].tokenBalance -= _tokenAmount;
          proposals[_proposalId].voteCount += _tokenAmount;
          proposals[_proposalId].yesVotes += _tokenAmount;

          emit VoteCast(msg.sender, _proposalId, _tokenAmount);
    }

    // No voting
    function voteNo(uint _proposalId, uint _tokenAmount) public {
        require(isMember[msg.sender] == true, "You must be a member to vote");
        require(balances[msg.sender] >= _tokenAmount, "Not enough tokens to vote");
        require(votes[msg.sender][_proposalId] == false, "You have already voted for this proposal");
          votes[msg.sender][_proposalId] = true;
          memberInfo[msg.sender].tokenBalance -= _tokenAmount;
          proposals[_proposalId].voteCount += _tokenAmount;
          proposals[_proposalId].noVotes += _tokenAmount;

          emit VoteCast(msg.sender, _proposalId, _tokenAmount);
    }

    // EXecute a proposal in the DAO
    function executeProposal(uint _proposalId) public {

        ? (
        require(proposals[_proposalId].executed == false, "Proposal has already been executed");
        require(proposals[_proposalId].yesVotes > proposals[_proposalId].noVotes, "Do not have enought votes");
        proposals[_proposalId].executed = true;
        ) 
        emit ProposalAccepted("Proposal has been approved");

        : (
            emit ProposalRejected("Proposal has been rejected");
        )
    }
}