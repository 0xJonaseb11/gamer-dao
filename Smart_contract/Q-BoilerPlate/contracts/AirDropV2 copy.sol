// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { IDAOResource } from "@q-dev/gdk-contracts/interfaces/IDAOResource.sol";
import { ACampaignAirDrop } from "./libs/ACampaignAirDrop.sol";

contract AirDropV2 is ACampaignAirDrop, Initializable, IDAOResource {
    
}