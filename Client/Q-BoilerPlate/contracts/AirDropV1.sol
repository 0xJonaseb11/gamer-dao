// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import {MerkleWhitelisted} from "@dlsl/dev-modules/access-control/MerkleWhitelisted.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TokenBalance} from "./libs/TokenBalance.sol";


contract AirDropV1 is MerkleWhiteListed, Ownable {

    // events

    event RewardClaimed(bytes32 indexed merkelRoot, address indexed account);
    event AirDropCreated(bytes32 indexed merkleRoot, address indexed rewardToken, uint256 rewardAmount);

    // state variables
    address public rewardToken;
    uint256 public rewardAmount;
    mapping(bytes32 => mapping(address => bool)) public isUserClaimed;
    
}