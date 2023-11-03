// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAO {
    struct Proposal {
        string description;
        uint voteCount;
        uint yesVotes;
        uint noVotes;
        bool executed;
    }

    struct Member {
        address memberAddress;
        uint memberSince;
        uint tokenBalance;
    }

    // state variables

    address public owner;
    address[] public members;
    mapping(address => Member) public memberInfo;
    mapping(address => mapping(uint => bool)) public votes;

    Proposal[] public proposals;

    // Token balances variables
    uint public totalSupply;
    mapping(address => uint) public balances;

    // Events
    event ProposalCreated(uint indexed proposalId, string description);
    event VoteCast(address indexed voter, uint indexed proposalId, uint tokenAmount);
    event ProposalAccepted(string message);
    event ProposalRejected(string rejected);


    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Add member
    function addMember(address _member) public {
        require(msg.sender == owner, "You are not the owner");
        require(isMember[_member] == false, "Member already exists");
        memberInfo[_member] = Member({
            memberAddress: _member,
            memberSince: block.timestamp,
            tokenBalance: 100
        });
        members.push(_member);
        isMember[_member] = true;
        balances[_member] = 100;
        totalSupply += 100;
    }


    // Remove member
    function removeMember(address _member) public {
        require(isMember[_member] == true, "Member doesnot exist");
        memberInfo[_member] = Member({
            memberAddress: address(0),
            memberSince: 0,
            tokenBalance: 0
        });

        for(uint i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                members[i] == _member[members.length - 1];
                members.pop();
                break;
            }
        }

        isMember[_member] = false;
        balances[_member] = 0;
        totalSupply -= 100;
    }


}