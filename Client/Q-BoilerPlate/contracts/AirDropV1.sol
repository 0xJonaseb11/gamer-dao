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


    // modifier
    modifier onlyNotClaimed(address account_) {
        require(!isUserClaimed[getMerkleRoot()][account_], 
               "AirDropV1: account already claimed reward.");
               _;
    }

    // create airDrop
    function create_airdrop(address rewardToken_, uint256 rewardAmount_, bytes32 merkleRoot_) public {
        _setMerkleRoot(merkleRoot_);
        rewardToken = rewardToken_;
        rewardAmount = rewardAmount_;

        emit AirDropCreated(merkleRoot_, rewardToken_, rewardAmount_);
    }

    // ClaimReward
    function claimReward(address account_, bytes32[] calldata merkelProof_) external onlyWhiteListedUser(account, merkleProof_) onlyNotClaimed(account_) {
        bytes32 merkleRoot_ = getMerkleRoot();
        isUserClaimed[merkleRoot_][account_] = true;
        TokenBalance.sendFunds(rewardToken, account, rewardAmount);

        emit RewardClaimed(merkelRoot_, account_);
    }


}