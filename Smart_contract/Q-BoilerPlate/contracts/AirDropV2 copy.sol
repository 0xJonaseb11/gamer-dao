// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
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
     
}