// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAO {

    struct Poposal {
        string description;
        uint voteCount;
        uint yesVotes;
        uint noVotes;
        bool executed;
    }
    
}