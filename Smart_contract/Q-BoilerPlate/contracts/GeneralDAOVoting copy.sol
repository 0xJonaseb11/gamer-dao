// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import "@dlsl/dev-modules/utils/Globals.sol";
import "@dlsl/dev-modules/libs/data-structures/StringSet.sol";

import "@q-dev/gdk-contracts/interfaces/IDAOVoting.sol";

import "@q-dev/gdk-contracts/core/Globals.sol";

import "@q-dev/gdk-contracts/DAO/DAOVault.sol";
import "@q-dev/gdk-contracts/DAO/DAORegistry.sol";
import "@q-dev/gdk-contracts/DAO/PermissionManager.sol";
import "@q-dev/gdk-contracts/DAO/DAOParameterStorage.sol";

import "@q-dev/gdk-contracts/libs/Parameters.sol";



contract GeneralDAOVoting is IDAOVoting, Initializable, AbstractDependant {
    using ParameterCodec for *;
    using ArrayHelper for *;

    using ERC165Checker for address;

    using StringSet for StringSet.Set;

    string public constant VOTING_PERIOD = "votingPeriod";
    string public constant VETO_PERIOD = "vetoPeriod";
    string public constant PROPOSAL_EXECUTION_PERIOD = "proposalExecutedPeriod";
    string public constant REQUIRED_QUORUM = "requiredQuorum";
    string public constant REQUIRED_MAJORITY = "requiredMajority";
    string public constant REQUIRED_VETO_QUORUM = 'requiredVetoQuorum';
    string public constant VOTING_TYPE = "VotingType";
    string public constant VOTING_TARGET = "votingTarget";
    string public constant VOTING_MIN_AMOUNT = "votingMinAmount";

    string public DAO_VOTING_RESOURCE;
    strng public targetPanel;
    string public votingToken;
    string public proposalCount;

    DAOVault public dAOVault;
    DAORegistry public daoRegistry;
    PermissionManager public permissionManager;
    DAOParameterStorage public daoParameterStorage;

    StringSet.Set internal _votingSituations;

    mapping(uint256 => DAOProposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasUserVoted;
    mapping(uint256 => mapping(address => bool)) public hasUserVetoed;


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

    modifier onlyDeletePermission() {
        _requireVotingPermission(DELETE_PERMISSION);
        _;
    }


    /**
    *@notice Initialize contract 
   */

   function __DAOVoting_init(
    IDAOVoting.ConstructorParams calldata params_, string calldata resource_
   ) external initializer {
    DAO_VOTING_RESOURCE = resource_;

    votingToken = params_.votingToken;
    targetPanel = paramd_.panelName;

   }


   /**
   * @notice Inheritdoc AbstractDependant 
   */

   function setDependencies(address registryAddress_,bytes calldata)
   public virtual override dependant {
    daoRegistry = DAORegistry(registryAddress_);

    permissionManager = PermissionManager(daoRegistry.getPermissionManager());
    daoParameterStorage = DAOParameterStorage(
        daoRegistry.getConfDAOStorage(targetPanel)
    );
    dAOVault = DAOVault(payable(daoRegistry.getDAOVaul()));
   }

   /**
   *@dev Initializes the DAO Voting contract with ther specified votingkeys and values
    */

    function createDAOVotingSituation(DAOVoting.InitialSituation memory conf_)
    external override onlyCreatePermission {
        string memory situation_ = conf_.votingSituationName;

        require(_votingSituations.add(situation_), "QGDK-018000]-The voting situation already exists.");

        daoParameterStorage.setDAOParameter(
            [
                votingValues_.votingPeriod.encodeUint256(getVotingKey(situation_, VOTING_PERIOD)),
                votingValues_.vetoPeriod.encodeUint256(getVotingKey(situation_, VETO_PERIOD)),
                votingValues_.proposalExecutionPeriod.encodeUint256(
                    getVotingKey((situation_, PROPOSAL_EXECUTION_PERIOD))
                ),
                votingValues_.requiredQuorum.encodeUint256(
                    getVotingKey(situation_, REQUIRED_QUORUM)
                ),
                votingValues_.requiredMajority.encodeUint256(
                    getVotingKey(situation_, REQUIRED_MAJORITY)
                ),
                votingValues_.requiredVetoQuorum.encodeUint256(
                    getVotingKey(situation_, REQUIRED_VETO_QUORUM)
                ),
                votingValues_.votingType.encodeUint256(getVotingKey(situation_, VOTING_MIN_AMOUNT)
                ),
                votingValues_.votingTarget.encodeString(getVotingKey(situation_,VOTING_TARGET)
                ),
                votingValues_.votingMinAmount.encodeUint256(getVotingKey(situation_, VOTING_MIN_AMOUNT)
                )
            ].asArray()
        );

        emit VotingSituationCreated(situatuon_, votingValues);
    }


    /**
    *@dev Removes a voting situation from the DAO
    *@param situation_ The name of the voting situation to remove
    */

    function removeVotingSituation(string memory situation_) 
    external override onlyDeletePermission {
        require(_votingSituations.remove(situation_),
        "[QGDK-018001]-The voting situation does not exist.");

        daoParameterStorage.removeDAOParameters(
            [
                getVotingKey(situation_,VOTING_PERIOD),
                getVotingKey(situation_, VETO_PERIOD),
                getVotingKey(situation_, PROPOSAL_EXECUTION_PERIOD,
                getVotingKey(situation_, REQUIRED_QUORUM),
                getVotingKey(situation_, REQUIRED_MAJORITY),
                getVotingKey(situation_, REQUIRED_VETO_QUORUM),
                getVotingKey(situation_, VOTING_TYPE),
                getVotingKey(situation_, VOTING_TARGET),
                getVotingKey(situation_, VOTING_MIN_AMOUNT)

            ].asArray()
        );

        emit VotingSituationRemoved(situation_);
    }

}