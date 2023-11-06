// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IDAOResource} from "@q-dev/gdk-contracts/interfaces/IDAOResource.sol";
import {ACampaignAirDrop} from "./libs/ACampaignAirDrop.sol";


contract AirDropV2 is ACampaignAirDrop, Initializable, IDAOResource {
    
    // state variables
    string public constant AIR_DROP_V2_RESOURCE = "AIR_DROP_V2";
    address public votingContract;

    // modifier
    modifier onlyVotingContract() {
        require(msg.sender == votingContract, "AirDropV2: caller is not contract.");
        _;
    }
}