// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { IDAOResource } from "@q-dev/gdk-contracts/interfaces/IDAOResource.sol";
import { ACampaignAirDrop } from "./libs/ACampaignAirDrop.sol";

contract AirDropV2 is ACampaignAirDrop, Initializable, IDAOResource {

    // state variables
    string public constant AIR_DROP_V2_RESOURCE = "AIR_DROP_V2";
    address public votingContract;

    // modifier to initialize contract
    modifier onlyVotingContract() {
        require(msg.sender == votingContract, "AirDropV2: Caller not contract");
        _;
    }

    // constructor

     // Initialize contract
    function __AirDropV2_init(address votingContract_) public {
        votingContract = votingContract_;
    }

     // Create campaign
    function createCampaign(
        address rewardToken_, uint256 rewardAmount_,
        bytes32 merkleRoot_, uint256 startingTimestamp_, uint256 endingTimeStamp_
    ) external onlyVotingContract returns(uint256) {
        return _createCampaign(rewardToken_, rewardAmount_, startingTimestamp_, endingTimeStamp_, merkleRoot_);
    }

     // Claim Reward
    function claimReward(uint256 campaignId_, address account_, bytes32[] calldata merkleProof_) external {
        _claimReward(campaignId_, account_, merkleProof_);
    }

    // check Permission
    function checkPermission(address /**member_ */, string calldata /**permission */) external returns(bool) {
        return true;
    }

    // Get resource
    function getResource() external pure returns(string memory) {
        return AIR_DROP_V2_RESOURCE;
    }
}