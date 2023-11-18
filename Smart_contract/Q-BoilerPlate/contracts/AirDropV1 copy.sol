// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import {MerkleWhitelisted} from "@dlsl/dev-modules/access-control/MerkleWhitelisted.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import {TokenBalance} from "./libs/TokenBalance.sol";


contract AirDropV1 is MerkleWhitelisted, Ownable {

    event RewardClaimed(bytes32 indexed merkleRoot, address indexed account);
    event AirDropCreated(bytes32 indexed merkelRoot, address indexed rewardToken, uint256 rewardAmount);


    // state variables
    address public rewardToken;
    uint256 public rewardAmount;

    mapping(bytes32 => mapping(address => bool)) public isUserClaimed;

    modifier onlyNotClaimed(address account_) {
        require(
            !isUserClaimed[getMerkleRoot()][account_],
            "AirDropV1: Account already claimed reward."
        );
        _;
    }


    function create_airdrop(address rewardToken_, uint256 rewardAmount_, bytes32 merkleRoot_) public {
        _setMerkleRoot(merkleRoot_);
        rewardToken = rewardToken_;
        rewardAmount = rewardAmount_;

        emit AirDropCreated(merkelRoot_, rewardToken_, rewardAmount_);
    }

    function claimReward(address account_, bytes32[] calldata MerkleProof_) external onlyWhitelistedUser(account_, merkleProof_) onlyNotClaimed(account_ ){
        bytes32 merkleRoot_ = getMerkleRoot();
        isUserClaimed[merkleRoot_][account_] = true;
        TokenBalance.sendFunds(rewardToken, account_, rewardAmount);
        emit RewardClaimed(merkleRoot_, account_);
    }

    function setMerkleRoot(bytes32 merkleRoot_) external onlyOwner {
        _setMerkleRoot(merkleRoot_);
    }
}