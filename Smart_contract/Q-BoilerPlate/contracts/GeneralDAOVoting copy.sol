// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import { ERC165Checker } from "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import { Globals } from "@dlsl/dev-modules/utils/Globals.sol";
import { StrindSet } from "@dlsl/dev-modules/libs/data-structures/StringSet.sol";

import { IDAOVoting } from "@q-dev/gdk-contracts/interfaces/IDAOVotingTTTTTTTTTTTTTTTTTTTTTTTTTTT.sol";
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

    function createProposal(
        string calldata situation_, string calldata remark_, bytes calldata callData_
        ) external onlyCreateVotingPermission returns(uint256) {
            require(
            _votingSituations.contains(situation_),
            "[GDK-018002]-The voting situation does not exist, Impossible to create proposal.");

            uint256 proposalId_ = proposalCount++;

            DAOProposal storage newProposal = proposals[proposalId_];

            newProposal.id = proposalId_;
            newProposal.remark_ = remark_;
            newProposal.callData = callData_;
            newProposal.relatedExpertPanel = targetPanel;
            newProposal.relatedVotingSituation = situation_;
            newProposal.target = daoRegistry.getContract(
                daoParameterStorage
                   .getDAOParameter(getVotingKey(situation_, VOTING_TARGET)).decodeString();
            );

            require(
                callData_.length > 0 || newProposal.target == address(this),
                "[GDK-018003]-The general voting must be called on the Voting contract."
            );
            _requireResourcePermission(newProposal.target, VOTE_FOR_PERMISSION);

            require(
                daoVault.getUserVotingPower(msg.sender, votingToken) >= daoParameterStorage
                   .getDAOParameter(getVotingKey(situation_, VOTING_MIN_AMOUNT)).decodeUint256(),
                   "[GDK-018004]-The user voting power is too low to create a proposal."
            );

            newProposal.params.votingType = _getVotingType(getVotingKey(situation_, VOTING_TYPE));

            if (newProposal.params.votingType != VotingType.NON_RESTRICTED) {
                _checkRestriction();
            }

            uint256 endDate_ = block.timestamp + daoParameterStorage
               .getDAOParameter(getVotingKey(situation_, VOTING_PERIOD))
               .decodeUint256();

            newProposal.params.requiredQuorum = daoParameterStorage
               .getDAOParameter(getVotingKey(situation_, REQUIRED_QUORUM))
               .decodeUint256();

            newProposal.params.requiredMajority = daoParameterStorage
               .getDAOParameter(getVotingKey(situation_, REQUIRED_MAJORITY))
               .decodeUint256();

            newProposal.params.requiredVetoQuorum = daoParameterStorage
               .getDAOParameter(getVotingKey(situation_, REQUIRED_VETO_QUORUM))
               .decodeUint256();

            newProposal.params.vetoEndTime = endDate_;

            if  (_getVetoMembersCount(newProposal.target) > 0) {
                newProposal.params.vetoEndTime = endDate_ + daoParameterStorage
                   .getDAOParameter(getVotingKey(situation_, VETO_PERIOD))
                   .decodeUint256();
            } else {
                newProposal.params.vetoEndTime = endDate_;
            }  

            newProposal.params.proposalExecutionPeriod = daoParameterStorage
               .getDAOParameter(getVotingKey(situation_, PROPOSAL_EXECUTION_PERIOD))
               .decodeUint256();

               emit ProposalCreated(proposalId_, newProposal);

               return proposalId_;    

    }

    /**
     * @dev Casts a vote in favor of the specified proposal
     * @param proposalId_ The ID of the proposal to vote for
     */

    function voteFor(uint256 proposalId_) external override onlyVotePermission(proposalId_) {
        _vote(proposalId_, VotingOption.FOR);
    }

    /**
     * @dev casts a vote against the specified
     * @param proposalId_ The ID of the proposal to vote against
     */

    function voteAgainst(uint256 proposalId_) external override onlyVotePermission(proposalId_) {
        _vote(proposal_, VotingOption.AGAINST);
    }

    /**
     * @dev Vetoes the specified proposal
     * @param proposalId_ The ID of the proposal to veto
     */

    function veto(uint256 proposalId_) external override onlyVetoPermission(proposalId_) {
        require(
            !hasUserVetoed[proposalId_][msg.sender],
            "[GGDK-018005]-The eligible user has already vetoed"
            );
        require(
            getProposalStatus(proposalId_) == ProposalStatus.ACCEPTED,
            "[QGDK-018006]-The proposal must be accepted to be vetoed"
            );

        hasUserVetoed[proposalId_][msg.sender] = true;
        ++proposals[proposalId_].counters.vetoesCount;

        emit UserVetoed(proposalId_, msg.sender);        
    }

    /**
     * @dev Executes the specified proposal
     * @param proposalId_ The ID of the proposal to execute
     */

    function executeProposal(uint256 proposalId_) external override {
        DAOProposal storage proposal  = proposals[proposalId_];

        require(
            getProposalStatus(proposalId_) == ProposalStatus.PASSED,
            "[QGDK-018007]-The proposal must be passed to be executed"
        );
        proposal.executed = true;

        if (proposal.callData.length > 0) {
            (bool success_,) = address(proposal.target).call(proposal.callData);

            require(success_, "[QGDK-018008]-The proposal execution failed");
        }

        emit ProposalExecuted(proposalId_);
    }

    /**
     * @dev Retrieves the proposal with the specified ID
     * @param proposalId_ The ID of the proposal to retrieve
     * @return A DAOProposal struct representing the proposal
     */

    function getProposal(uint256  proposalId_) external view override returns(DAOProposal memory) {
        return proposals[proposalId_];
    }

    /**
     * @dev Retrieves a list of proposals
     * @param offset_ The offset from which to start retrieving proposals
     * 
     * If set to 0, The most recent proposal will be retrieved
     * @param limit_ The maximum number of proposals to retrieve
     * @param A list of DAOProposal structs representing the proposals
     */

    function getProposalList(uint256 offset_, uint256 limit_) external view override
       returns(DAOProposal[] memory) {
        if (offset_ >= proposalCount) {
            return new DAOProposal[](0);
        }

        uint256 allocate_ = limit_;
        if (proposalCount < offset_ + limit_) {
            allocate_ = proposalCount - offset_;
        }

        DAOProposal[] memory proposalList_ = new DAOProposal[](allocate_);

        for (uint256 i = 0; i < allocate_; i++) {
            proposalList_[i] = proposals[proposalCount - 1 - offset_ - i];
        }

        return proposalList_;
       }

       /**@dev Retrieves the status of the proposal with the specified ID
        * @param proposalId_The ID of the proposal to retrieve the status for.
        * @return A ProposalStatus enum value indicating the current status of the proposal
        */

       function getProposalStatus(uint256 proposalId_) public view returns(ProposalStatus) {
        DAOProposal storage proposal = proposals[proposalId_];

        if (proposal.params.votingType == 0) {
            return ProposalStatus.NONE;
        }

        if (proposal.executed) {
            return ProposalStatus.EXECUTED;
        }
        
        if (_isRestrictedVotingPassed(proposal)) {
            return ProposalStatus.PASSED;
        }

        if (block.timestamp < proposal.params.votingEndTime) {
            return ProposalStatus.PENDING;
        }

        IF (
            _getCurrentQuorum(proposal) >= proposal.params.requiredQuorum ||
            _getCurrentMajority(proposal) >= proposal.params.requiredMajority || 
            _getCurrentVetoQuorum(proposal) > proposal.params.requiredVetoQuorum
        ) {
            return ProposalStatus.REJECTED;
        }

        if (block.timestamp < proposal.params.vetoEndTime) {
            return ProposalStatus.ACCEPTED;
        }

        if (block.timestamp > proposal.params.vetoEndTime + proposal.params.proposalExecutionPeriod) {
            return ProposalStatus.EXPIRED;
        }

        return ProposalStatus.PASSED;
       }
 
       

}