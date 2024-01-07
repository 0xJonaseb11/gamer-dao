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

    // Modifiers to handle permissions
    modifier onlyCreateVotingPermission() {
        _requireVotingPermission(CREATE_VOTING_PERMISSION);
        _;
    }

    modifier onlyVotePermission(uint256 proposalId_) {
        _checkProposalExists(proposalId_);

        if (proposals[proposalId_].params.votingType == VotingType.RESTRICTED) {
            _checkRestriction();
        }
        _requireVotingPermission(VOTE_PERMISSION);
        _;
    }

    modifier onlyVetoPermission(uint256 proposalId_) {
        _checkProposalExists(proposalId_);
        _requireResourcePermission(proposals[proposalId_].target, VETO_FOR_PERMISSION);
        _;
    }

    modifier onlyCreatePermission() {
        _requireVotingPermission(CREATE_PERMISSION);
        _;
    }

    modifier onlyDeletePermission() {
        _requireVotingPermission(DELETE_PERMISSION);
        _;
    }

    /**
     * @notice Inititalizes the contract
     */

    function __DAOVoting_init(
        IDAOVoting.ConstructorParams calldata params_, string calldata resource_
    ) external initializer {
        DAO_VOTING_RESOURCE = resource_;

        votingToken = params_.votingToken;
        targetPanel = params_.panelName;
    }

    /**
     * Inheritdoc AbstractDependant
     */

    function setDependencies(address registryAddress_, bytes calldata)
       public virtual override dependant {
        daoRegistry = DAORegistry(registryAddress_);

        permissionManager = PermissionManager(daoRegistry.getPermissionManager());
        daoParameterStorage = DAOParameterStorage(daoRegistry.getConfDAOParameterStorage(targetPanel));
        daoVault = DAOVault(payable(daoRegistry.getDAOVault()));
    }

    /**
     * @dev Initializes the DAO voting contract with specified voting keys and values
     */

    function createDAOVotingSituation(IDAOVoting.InitialSituation memory conf_)
       external override onlyCreatePermission {
        string memory situation_ = conf_.votingSituationName;

        require(_votingSituations.add(situation_),
        "[GDK-018000] - The voting situation already exists.");

        DAOVotingValues memory votingValues_ = conf_.votingValues_;

        daoParameterStorage.setDAOParameters(
            [
                votingValues_.votingPeriod.encodeUint256(getVotingkey(situation_, VOTING_PERIOD)),
                votingValues_.vetoPeriod.encodeUint256(getVotingKey(situation_, VETO_PERIOD)),
                votingValues_.proposalExecutionPeriod.encodeUint256(getVotingKey(situation_, PROPOSAL_EXECUTION_PERIOD)),
                votingValues_.requiredQuorum.encodeUint256(getVotingKey(situation_, REQUIRED_QUORUM)),
                votingValues_.requiredMajority.encodeUint256(getVotingkey(situation_, REQUIRED_MAJORITY)),
                votingValues_.requiredVetoQuorum.encodeUint256(getVotingKey(situation_, REQUIRED_MAJORITY)),
                votingValues_.votingType.encodeUint256(getVotingKey(situation_, VOTING_TYPE)),
                votingValues_.votingTarget.encodeUint256(getVotingkey(situation_, VOTING_TARGET)),
                votingValues_.votingMinAmount.encodeUint256(getVotingKey(situation_, VOTING_MIN_AMOUNT))
            ].asArray();
        );

        emit VotingSituationCreated(situation_, votingValues_);
    }

    /**
     * @dev Removes a voting situation from the DAO
     * @param situation_ The name of the voting situation to remove
     */

    function removeVotingSituation(string memory situation_) 
       external override onlyDeletePermission {
        require (_votingSituations.remove(situation_),
        "[GDK-018001]- The voting situation does not exist.");

        daoParameterStorage.removeDAOParameters(
            [
                getVotingKey(situation_, VOTING_PERIOD),
                getVotingKey(situation_, VETO_PERIOD),
                getVotingKey(situation_, VETO_PERIOD),
                getVotingKey(situation_, PROPOSAL_EXECUTION_PERIOD),
                getVotingKey(situation_, REQUIRED_QUORUM),
                getVotingKey(situation_, REQUIRED_MAJORITY),
                getVotingKey(situation_, REQUIRED_VETO_QUORUM),
                getVotingKey(situation_, VOTING_TYPE),
                getVotingKey(situation_, VOTING_TARGET),
                getVotingKey(situation_, VOTING_MIN_AMOUNT)
            ].isArray();
        );

        emit VotingSituationRemoved(situation);
    }

    /**
     * inheritdoc IDAOVoting
     * 
     * @dev Minimally used variables here, b'coz of stack too deep error
     */

    

       

}