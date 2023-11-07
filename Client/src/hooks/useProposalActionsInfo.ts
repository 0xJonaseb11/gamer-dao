
import { useCallback } from 'react';

import { DAO_RESERVED_NAME } from '@q-dev/gdk-sdk';
import { toBigNumber } from '@q-dev/utils';
import { ErrorHandler } from 'helpers';

import { useDaoProposals } from './useDaoProposals';

import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useDaoVault } from 'store/dao-vault/hooks';
import { useProviderStore } from 'store/provider/hooks';

import { daoInstance } from 'contracts/contract-instance';

import { fromWeiWithDecimals } from 'utils/numbers';

function useProposalActionsInfo () {
  const { vaultBalance } = useDaoVault();
  const { getPanelSituationInfo, getAccountStatuses } = useDaoProposals();
  const { tokenInfo } = useDaoTokenStore();
  const { currentProvider } = useProviderStore();

  async function checkIsUserMember (panelName: string) {
    try {
      if (!daoInstance || panelName === DAO_RESERVED_NAME || !currentProvider?.selectedAddress) return false;
      const memberStorageInstance = await daoInstance.getMemberStorageInstance(panelName);
      return memberStorageInstance.instance.isMember(currentProvider.selectedAddress);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      return false;
    }
  }
  async function checkIsUserTokenHolder () {
    try {
      if (!currentProvider?.selectedAddress) return false;
      const accountStatuses = await getAccountStatuses();
      return accountStatuses.includes(DAO_RESERVED_NAME);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      return false;
    }
  }

  async function checkIsUserCanVeto (target: string) {
    try {
      if (!daoInstance || !currentProvider?.selectedAddress) return false;
      const permissionManagerInstance = await daoInstance.getPermissionManagerInstance();
      const isUserTokenHolder = await checkIsUserTokenHolder();
      const vetoGroupMembers = await permissionManagerInstance
        .instance.getVetoGroupMembers(target);
      return vetoGroupMembers.includes(currentProvider.selectedAddress) && isUserTokenHolder;
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      return false;
    }
  }
  async function checkIsUserCanCreateProposal (panelName: string, situation: string) {
    try {
      const situationInfo = await getPanelSituationInfo(panelName, situation);
      if (!situationInfo || !tokenInfo) return { isUserHasVotingPower: false, isUserMember: false };
      const isUserMember = await checkIsUserMember(panelName);
      const isUserTokenHolder = await checkIsUserTokenHolder();
      const isUserHasVotingPower = toBigNumber(vaultBalance)
        .isGreaterThanOrEqualTo(fromWeiWithDecimals(situationInfo?.votingMinAmount.toString(), tokenInfo.decimals));
      return {
        isUserHasVotingPower: isUserHasVotingPower && isUserTokenHolder,
        isUserMember: situationInfo.votingType.toString() === '0' || isUserMember
      };
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      return { isUserHasVotingPower: false, isUserMember: false };
    }
  };

  async function checkIsUserCanVoting (panelName: string, situation: string) {
    try {
      const situationInfo = await getPanelSituationInfo(panelName, situation);
      if (!situationInfo || !tokenInfo) return false;
      const isUserMember = await checkIsUserMember(panelName);
      const isUserTokenHolder = await checkIsUserTokenHolder();
      const isUserHasVotingPower = toBigNumber(vaultBalance)
        .isGreaterThanOrEqualTo((fromWeiWithDecimals(situationInfo?.votingMinAmount.toString(), tokenInfo.decimals)));
      return isUserTokenHolder && isUserHasVotingPower && (situationInfo.votingType.toString() !== '1' || isUserMember);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      return false;
    }
  };

  return {
    checkIsUserCanVeto: useCallback(checkIsUserCanVeto, []),
    checkIsUserCanCreateProposal: useCallback(checkIsUserCanCreateProposal, []),
    checkIsUserCanVoting: useCallback(checkIsUserCanVoting, []),
    checkIsUserTokenHolder: useCallback(checkIsUserTokenHolder, []),
    checkIsUserMember: useCallback(checkIsUserMember, [])
  };
}

export default useProposalActionsInfo;
