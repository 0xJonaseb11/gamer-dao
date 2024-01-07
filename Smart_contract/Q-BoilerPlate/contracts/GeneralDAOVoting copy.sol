// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import { ERC165Checker } from "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import { Globals } from "@dlsl/dev-modules/utils/Globals.sol";
import { StrindSet } from "@dlsl/dev-modules/libs/data-structures/StringSet.sol";

import { IDAOVoting } from "@q-dev/gdk-contracts/interfaces/IDAOVoting.sol";
import { Globals } from "@q-dev/gdk-contracts/core/Globals.sol";
import { DAOVault } from "@q-dev/gdk-contracts/DAO/DAOVault.sol";
import { DAORegistry } from "@q-dev/gdk-contracts/DAO/DAORegistry.sol";
import { PermissionManager } from "@q-dev/gdk-contracts/DAO/PermissionManager.sol";
import { DAOParameterStorage } from "@q-dev/gdk-contracts/DAO/DAOParameterStorage.sol";
import { Parameters } from "@q-dev/gdk-contracts/libs/Parameters.sol";

/**
 * @title GeneralDAOVoting
 * @dev Implementation of contract that manages voting for the DAO 
 */

contract GenealDAOVoting is IDAOVoting, Initializable, AbstractDepandant {
    using ParameterCodec for *;
    using ArrayHelper for *;
    using ERC165Checker for address;
    using StringSet for StringSet.Set;

    // state variables
    string public constant VOTING_PERIOD = "VotingPeriod";
    string public constant VETO_PERIOD = "VetoPeriod";
    string public constant PROPOSAL_EXECUTION_PERIOD = "proposalExecutionPeriod";
    string public constant REQUIRED_QUORUM = "requiredQuorum";
    string public constant REQUIRED_MAJORITY = "requiredMajority";
    string public constant REQUIRED_VETO_QUORUM = "requiredVetoQuorum";
    string public constant VOTING_TYPE = "otingType";
    string public constant VOTING_TARGET = "votingTarget";
    string public constant VOTING_MIN_AMOUNT = "votingMinAmount";

    string public DAO_VOTING_RESOURCE;
    string public targetPanel;
    address public votingToken;
    uint256 public proposalCount;

    DAOVault public daoVault;
    DAORegistry public daoRegistry;
    PermissionManager public permissionManager;
    DAOParameterStorage public daoParameterStorage;

    StringSet.Set internal _votingSituations;

    mapping(uint256 => DAOProposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasUserVoted;
    mapping(uint256 => mapping(address => bool)) public hasUserVetoed;

    

}