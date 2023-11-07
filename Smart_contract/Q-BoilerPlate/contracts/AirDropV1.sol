// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.19;

// Importing external modules for access control and token balance handling.
import {MerkleWhitelisted} from "@dlsl/dev-modules/access-control/MerkleWhitelisted.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TokenBalance} from "./libs/TokenBalance.sol";

contract AirDropV1 is MerkleWhitelisted, Ownable {
    // Events to log airdrop events and reward claims.
    event RewardClaimed(bytes32 indexed merkleRoot, address indexed account);
    event AirDropCreated(bytes32 indexed merkleRoot, address indexed rewardToken, uint256 rewardAmount);

    // State variables to store reward token address, reward amount, and claimed status.
    address public rewardToken;
    uint256 public rewardAmount;
    mapping(bytes32 => mapping(address => bool)) public isUserClaimed;

    // Modifier to check if the user has not claimed the reward.
    modifier onlyNotClaimed(address account_) {
        require(
            !isUserClaimed[getMerkleRoot()][account_],
            "AirDropV1: account already claimed reward."
        );
        _;
    }

    // Initialize the contract with the reward token, amount, and Merkle root.
    function create_airdrop(address rewardToken_, uint256 rewardAmount_, bytes32 merkleRoot_) public {
        _setMerkleRoot(merkleRoot_);
        rewardToken = rewardToken_;
        rewardAmount = rewardAmount_;
        emit AirDropCreated(merkleRoot_, rewardToken_, rewardAmount_);
    }

    // Function to claim reward for an eligible user with a valid Merkle proof.
    function claimReward(address account_, bytes32[] calldata merkleProof_) external onlyWhitelistedUser(account_, merkleProof_) onlyNotClaimed(account_) {
        bytes32 merkleRoot_ = getMerkleRoot();
        isUserClaimed[merkleRoot_][account_] = true;
        TokenBalance.sendFunds(rewardToken, account_, rewardAmount);
        emit RewardClaimed(merkleRoot_, account_);
    }

    // Function for the contract owner to change the Merkle root for a new airdrop event.
    function setMerkleRoot(bytes32 merkleRoot_) external onlyOwner {
        _setMerkleRoot(merkleRoot_);
    }
}
