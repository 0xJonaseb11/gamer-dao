// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import { IDAOResource } from "@q-dev/gdk-contracts/interfaces/IDAOResource.sol";

enum VotingType {
    NON_RESTRICTED,
    RESTRICTED,
    PARTIALLY_RESTRICTED
}

/**
 * @title IDAOVoting
 * @dev Interface for a contract that manages voting and proposal for a DAO.
 */

interface IDAOVoting is IDAOResource {
    enum ProposalStatus {
        NONE,
        PENDING,
        REJECTED,
        ACCEPTED,
        PASSED,
        EXECUTED,
        EXPIRED
    }

    enum VotingOption {
        NONE,
        FOR,
        AGAINST
    }

    struct DAOVotingKeys {
        string votingPeriodKey;
        string vetoPeriodKey;
        string proposalExecutionPeriodKey;
        string requiredQuorumKey;
        string requiredMajorityKey;
        string requiredVetoQuorumKey;
        string votingTypeKey;
        string votingTargetKey;
        string votingMinAmountKey;
    }

    struct DAOVotingValues {
        uint256 votingPeriod;
        uint256 vetoPeriod;
        uint256 proposalExecutionPeriod;
        uint256 requiredQuorum;
        uint256 requiredMajority;
        uint256 vetoVetoQuorum;
        uint256 VotingType;
        string votingTarget;
        uint256 votingAmount;
    }

    struct InitialSituation {
        string votingSituationName;
        DAOVotingValues votingValues;
    }

    struct ConstructorParams {
        string panelName;
        address votingToken;
    }

    struct VotingParams {
        VotingType VotingType;
        uint256 votingStartTime;
        uint256 votingEndTime;
        uint256 vetoEndTime;
        uint256 proposalExecutionPeriod;
        uint256 requiredQuorum;
        uint256 requiredMajority;
        uint256 requiredVetoQuorum;
    }

    struct VotingCounters {
        uint256 votedFor;
        uint256 votedAgainst;
        uint256 vetoesCount;
    }

    struct VotingStats {
        uint256 requiredQuorum;
        uint256 currentQuorum;
        uint256 requiredMajority;
        uint256 currentMajority;
        uint256 currentVetoQuorum;
        uint256 requiredVetoQuorum;
    }

    struct DAOProposal {
        uint256 id;
        string remark;
        string relatedExpertPanel;
        string relatedVotingSituation;
        bytes callData;
        address target;
        VotingParams params;
        VotingCounters counters;
        bool executed;
    }

    


}