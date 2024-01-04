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

   
}