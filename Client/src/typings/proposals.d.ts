import { BigNumber } from 'ethers';

import { PROPOSAL_STATUS } from 'constants/statuses';

export type VotingActionType = 'vote' | 'veto';

export interface DaoProposalVotingInfo {
  votingStatus: PROPOSAL_STATUS;
  requiredQuorum: BigNumber;
  currentQuorum: BigNumber;
  requiredMajority: BigNumber;
  currentMajority: BigNumber;
  currentVetoQuorum: BigNumber;
  requiredVetoQuorum: BigNumber;
}

export interface DaoProposalVotingParams {
  proposalExecutionPeriod: BigNumber;
  requiredMajority: BigNumber;
  requiredQuorum: BigNumber;
  requiredVetoQuorum: BigNumber;
  vetoEndTime: BigNumber;
  votingEndTime: BigNumber;
  votingStartTime: BigNumber;
  votingType: number;
}

export interface DaoProposalVotingCounters {
  vetoesCount: BigNumber;
  votedAgainst: BigNumber;
  votedFor: BigNumber;
}

export interface DaoProposal {
  id: BigNumber;
  remark: string;
  callData: string;
  target: string;
  relatedExpertPanel: string;
  relatedVotingSituation: string;
  params: DaoProposalVotingParams;
  counters: DaoProposalVotingCounters;
  executed: boolean;
}

export interface UserProposalVotingInfo {
  isUserVoted: boolean;
  isUserVetoed: boolean;
}

export interface ProposalVetoGroupInfo {
  target: string;
  name: string;
  members: string[];
  linkedMemberStorage: string;
}

export interface ProposalVetoInfo {
  isVetoGroupExists: boolean;
  vetoMembersCount: string;
  membersCount: string;
}

export interface TurnoutDetails {
  totalVoteValue: string;
}

export interface VotingSituationInfo {
  votingPeriod: BigNumber;
  vetoPeriod: BigNumber;
  proposalExecutionPeriod: BigNumber;
  requiredQuorum: BigNumber;
  requiredMajority: BigNumber;
  requiredVetoQuorum: BigNumber;
  votingType: number;
  votingTarget: BigNumber;
  votingMinAmount: BigNumber;
}

export type ProposalBaseInfo = DaoProposal & DaoProposalVotingInfo & UserProposalVotingInfo
& ProposalVetoGroupInfo & ProposalVetoInfo & TurnoutDetails & VotingSituationInfo;
