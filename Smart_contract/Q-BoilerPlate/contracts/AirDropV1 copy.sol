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

    // state  variables to store reward token address, reward amount and claimed status
    address public rewardToken;
    uint256 public rewardAmount;

    mapping(bytes32 => mapping(address => bool)) public isUserClaimed;

    // modifier to check if the user has not claimed the reward
    modifier onlyNotClaimed(address account_) {
        require( !isUserClaimed[getMerkleRoot()][account_],
        "AirDropV1: Account already claimed reward.");
        _;
    }

    // Initialize contract with reward token, amount and merkle root
    function claimReward(address account_, bytes32[] calldata merkleProof_) 
      external onlyWhitelistedUser(account_, merkleProof_) onlyNotClaimed(account_) {
        bytes32 merkleRoot_ = getMerkleRoot();
        isUserClaimed[merkleRoot_][account_] = true;

        emit RewardClaimed(merkleRoot_, account_);
      }
}
