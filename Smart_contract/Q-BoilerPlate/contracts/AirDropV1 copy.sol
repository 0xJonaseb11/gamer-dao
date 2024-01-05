// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import external modules for access control and token balance handling
import { MerkleWhitelisted } from "@dlsl/dev-modules/access-control/MerkleWhitelisted.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { TokenBalance } from "./libs/TokenBalance.sol";

contract AirDropV1 is MerkleWhitelisted, Ownable {

    // events to log airdrop events and reward claims
    event RewardClaimed(bytes32 indexed merkleRoot, address indexed account);
    event AirDropCreated(bytes32 indexed merkleRoot, address indexed rewardToken, uint256 rewardAmount);

    // 
}
