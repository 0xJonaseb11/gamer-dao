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
        require(
            _votingSituations.remove(situation_),
        "[QGDK-018001]-The voting situation does not exist."
        );

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


    /**
    *@inheritdoc IDAVoting
    *
    *@dev Minimally used variables here, because of stack too deep error
    */

    function createPropoal(
        string calldata situation_,
        string calldata remark_,
        string calldata callData_,
    ) external onlyCreateVotingPermission returns(uint256) {
        require(
            _votingSituations.contains(situation_,
            "[QGDK-018002]-The voting situation does not exist, impossible to  create a proposal."
            );

            uint256 proposalId_ = proposalCount++;

            DAOProposal storage newProposal = proposals[ProposaId_];

            newProposal.id = proposalId_;
            newProposal.remark = remark_;
            newProposal.calldata = callData_;
            newProposal.relatedExpertPanel = targetPanel;
            newProposal.relateVotingSituation = situation_;
            
            newProposal.target = daoRegistry.getContract(
                daoParameterStorage
                      .getDAOParameter(getVotingKey(situation_, VOTING_TARGET))
                      .decodeString()
            );

            require(
                callData_.length > 0 || newProposal.target == address(this),
                "[QGDK-018003]-The general voting must be called on the Voting Contract."
            );

            _requireResourcePermission(newProposal.target, VOTE_FOR_PERMISSION);

            require(
                daoVault.getUserVotingPower(msg.sender, votingToken) >= 
                   daoParameterStorage
                        .getDAOParameter(getVotingKey(situation_, VOTING_MIN_AMOUNT))
                        .decodeUint256(),
                    "[QGDK-018004]-The voting power is too low to create a proposal."
            );
        );
                _requireResourcePermission(newProposal.target, VOTE_FOR_PERMISSION);


        require(
            daoVault.getUserVotingPower(msg.sender, votingToken) >= 
                daoParameterStorage
                   .getDAOParameter(getVotingKey(situation_, VOTING_MIN_AMOUNT))
                   .decodeUint256(),
                "[QGDK-018004]-The user voting power is too low to create a proposal."
        );

        newProposal.params.votingType = _getVotingType(getVotingKey(situation_, VOTING_TYPE));

       if (newProposal.params.votingType != VotingType.NON_RESTRICTED) {
        _checkRestriction();

        uint256 endDate_ = block.timestamp + 
            daoParameterStorage
                .getDAOParameter(getVotingKey(situation_, VOTING_PERIOD))
                .decodeUint256();

             newProposal.params.votingEndTime = endDate_;

        if (_getVetoMembersCount(newProposal.target) > 0) {
            newProposal.params.vetoEndTime =
                endDate_ +
                daoParameterStorage
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
     * @dev Casts a vote in favor of the specified proposal.
     * @param proposalId_ The ID of the proposal to vote for.
     */
    function voteFor(uint256 proposalId_) external override onlyVotePermission(proposalId_) {
        _vote(proposalId_, VotingOption.FOR);
    }

    /**
     * @dev Casts a vote against the specified proposal.
     * @param proposalId_ The ID of the proposal to vote against.
     */
    function voteAgainst(uint256 proposalId_) external override onlyVotePermission(proposalId_) {
        _vote(proposalId_, VotingOption.AGAINST);
    }


     /**
     * @dev Vetoes the specified proposal.
     * @param proposalId_ The ID of the proposal to veto.
     */
    function veto(uint256 proposalId_) external override onlyVetoPermission(proposalId_) {
        require(
            !hasUserVetoed[proposalId_][msg.sender],
            "[QGDK-018005]-The eligible user has already vetoed."
        );
        require(
            getProposalStatus(proposalId_) == ProposalStatus.ACCEPTED,
            "[QGDK-018006]-The proposal must be accepted to be vetoed."
        );

         hasUserVetoed[proposalId_][msg.sender] = true;

        ++proposals[proposalId_].counters.vetoesCount;

        emit UserVetoed(proposalId_, msg.sender);
    }

    /**
     * @dev Executes the specified proposal.
     * @param proposalId_ The ID of the proposal to execute.
     */
      hasUserVetoed[proposalId_][msg.sender] = true;

        ++proposals[proposalId_].counters.vetoesCount;

        emit UserVetoed(proposalId_, msg.sender);
    }

    /**
     * @dev Executes the specified proposal.
     * @param proposalId_ The ID of the proposal to execute.
     */

 function executeProposal(uint256 proposalId_) external override {
        DAOProposal storage proposal = proposals[proposalId_];

        require(
            getProposalStatus(proposalId_) == ProposalStatus.PASSED,
            "[QGDK-018007]-The proposal must be passed to be executed."
        );

        proposal.executed = true;

        if (proposal.callData.length > 0) {
            (bool success_, ) = address(proposal.target).call(proposal.callData);
            require(success_, "[QGDK-018008]-The proposal execution failed.");
        }

        emit ProposalExecuted(proposalId_);
    }

        /**
     * @dev Retrieves the proposal with the specified ID.
     * @param proposalId_ The ID of the proposal to retrieve.
     * @return A DAOProposal struct representing the proposal.
     */
    function getProposal(uint256 proposalId_) external view override returns (DAOProposal memory) {
        return proposals[proposalId_];
    }

    /**
     * @dev Retrieves a list of proposals.
     * @param offset_ The offset from which to start retrieving proposals.
     * If set to 0, the most recent proposal will be retrieved.
     * @param limit_ The maximum number of proposals to retrieve.
     * @return A list of DAOProposal structs representing the proposals.
     */

      function getProposalList(
        uint256 offset_,
        uint256 limit_
    ) external view override returns (DAOProposal[] memory) {
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

    /**
     * @dev Retrieves the status of the proposal with the specified ID.
     * @param proposalId_ The ID of the proposal to retrieve the status for.
     * @return A ProposalStatus enum value indicating the current status of the proposal.
     */
    function getProposalStatus(uint256 proposalId_) public view returns (ProposalStatus) {
        DAOProposal storage proposal = proposals[proposalId_];

        if (proposal.params.votingEndTime == 0) {
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

        if (
            _getCurrentQuorum(proposal) <= proposal.params.requiredQuorum ||
            _getCurrentMajority(proposal) <= proposal.params.requiredMajority ||
            _getCurrentVetoQuorum(proposal) > proposal.params.requiredVetoQuorum
        ) {
            return ProposalStatus.REJECTED;
        }

        if (block.timestamp < proposal.params.vetoEndTime) {
            return ProposalStatus.ACCEPTED;
        }

        if (
            block.timestamp > proposal.params.vetoEndTime + proposal.params.proposalExecutionPeriod
        ) {
            return ProposalStatus.EXPIRED;
        }

        return ProposalStatus.PASSED;
    }


 function getProposalVotingStats(
        uint256 proposalId_
    ) external view returns (VotingStats memory) {
        return
            VotingStats(
                proposals[proposalId_].params.requiredQuorum,
                _getCurrentQuorum(proposals[proposalId_]),
                proposals[proposalId_].params.requiredMajority,
                _getCurrentMajority(proposals[proposalId_]),
                _getCurrentVetoQuorum(proposals[proposalId_]),
                proposals[proposalId_].params.requiredVetoQuorum
            );
    }


       }
    }

}