import {
  CreateVotingParameters,
  DefaultVotingSituations,
  getEncodedData,
  getParameter,
  ParameterType,
} from '@q-dev/gdk-sdk';
import { TagState } from '@q-dev/q-ui-kit/dist/components/Tag';
import { NewProposalForm } from 'typings/forms';

import { daoInstance } from 'contracts/contract-instance';

import { PROPOSAL_STATUS } from 'constants/statuses';
import AirDropV2 from 'artifacts/AirDropV2.json';
import { utils } from 'ethers';
import { useLocalStorage } from '@q-dev/react-hooks';
import { ProposalBaseInfo } from 'typings/proposals';
import { BigNumberish, ContractTransaction, providers, Signer } from "ethers";

export async function createMembershipSituationProposal (form: NewProposalForm) {
  if (!daoInstance) return;
  const votingInstance = await daoInstance.getDAOVotingInstance(form.panel);
  const votingParams: CreateVotingParameters = {
    remark: form.remark,
    situation: DefaultVotingSituations.Membership,
    callData: getEncodedData(
      'DAOMemberStorage',
      form.membershipSituationType === 'add-member' ? 'addMember' : 'removeMember',
      form.candidateAddress
    )
  };
  return daoInstance.createVoting(votingInstance, votingParams);
}

export async function createGeneralSituationProposal (form: NewProposalForm) {
  if (!daoInstance) return;

  const votingInstance = await daoInstance.getDAOVotingInstance(form.panel);
  const votingParams: CreateVotingParameters = {
    remark: form.remark,
    situation: DefaultVotingSituations.General,
    callData: '0x'
  };
  return daoInstance.createVoting(votingInstance, votingParams);
}

export async function createConstitutionProposal (form: NewProposalForm) {
  if (!daoInstance) return;
  const votingInstance = await daoInstance.getDAOVotingInstance(form.panel);

  const votingParams: CreateVotingParameters = {
    remark: form.remark,
    situation: DefaultVotingSituations.Constitution,
    callData: getEncodedData('DAOParameterStorage', 'setDAOParameters', [
      getParameter('constitution.hash', form.hash, ParameterType.BYTES),
      ...form.params.map((item) => {
        return getParameter(item.key, item.value, item.type);
      })
    ])
  };
  return daoInstance.createVoting(votingInstance, votingParams);
}

export async function createParameterSituationProposal (
  form: NewProposalForm,
  situation: DefaultVotingSituations.ConfigurationParameter |
  DefaultVotingSituations.RegularParameter
) {
  if (!daoInstance) return;
  const votingInstance = await daoInstance.getDAOVotingInstance(form.panel);

  const votingParams: CreateVotingParameters = {
    remark: form.remark,
    situation: situation,
    callData: getEncodedData(
      'DAOParameterStorage',
      'setDAOParameters',
      form.params.map((item) => {
        return getParameter(item.key, item.value, item.type);
      })
    )
  };
  return daoInstance.createVoting(votingInstance, votingParams);
}

export async function createDAORegistryProposal (form: NewProposalForm) {
  if (!daoInstance) return;
  const votingInstance = await daoInstance.getDAOVotingInstance(form.panel);

  const votingParams: CreateVotingParameters = {
    remark: form.remark,
    situation: DefaultVotingSituations.DAORegistry,
    callData: getEncodedData(
      'DAORegistry',
      'multicall',
      form.callData
    )
  };

  return daoInstance.createVoting(votingInstance, votingParams);
}

export async function createAirDropV2Proposal (form: NewProposalForm) {
  if (!daoInstance) return;
  const votingInstance = await daoInstance.getDAOVotingInstance(form.panel);
  const contractInterface = new utils.Interface(AirDropV2);
  const createCampaignCalldata = contractInterface.encodeFunctionData("createCampaign", [
    form.rewardToken,
    form.rewardAmount,
    form.merkleRoot,
    form.startTimestamp,
    form.endTimestamp,
  ]);
  
  const votingParams: CreateVotingParameters = {
    remark: form.remark,
    situation: 'AirDropV2',
    callData: createCampaignCalldata
  };

  return daoInstance.createVoting(votingInstance, votingParams); 

}

export const getStatusState = (status: PROPOSAL_STATUS): TagState => {
  switch (status) {
    case PROPOSAL_STATUS.pending:
      return 'pending';
    case PROPOSAL_STATUS.rejected:
    case PROPOSAL_STATUS.expired:
    case PROPOSAL_STATUS.obsolete:
      return 'rejected';
    default:
      return 'approved';
  }
};

export const statusMap: Record<PROPOSAL_STATUS, string> = {
  [PROPOSAL_STATUS.accepted]: 'STATUS_ACCEPTED',
  [PROPOSAL_STATUS.executed]: 'STATUS_EXECUTED',
  [PROPOSAL_STATUS.expired]: 'STATUS_EXPIRED',
  [PROPOSAL_STATUS.none]: 'STATUS_NONE',
  [PROPOSAL_STATUS.passed]: 'STATUS_PASSED',
  [PROPOSAL_STATUS.pending]: 'STATUS_PENDING',
  [PROPOSAL_STATUS.rejected]: 'STATUS_REJECTED',
  [PROPOSAL_STATUS.obsolete]: 'STATUS_OBSOLETE'
};
