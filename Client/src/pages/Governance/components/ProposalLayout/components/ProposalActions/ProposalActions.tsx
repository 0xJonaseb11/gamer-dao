import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DecodedData, DefaultVotingSituations } from '@q-dev/gdk-sdk';
import { Modal, Tooltip } from '@q-dev/q-ui-kit';
import { keccak_256 as keccak256 } from 'js-sha3';
import { MerkleTree } from 'merkletreejs';
import { ProposalBaseInfo } from 'typings/proposals';

import Button from 'components/Button';
import { ShareButton } from 'components/ShareButton';

import { useSignConstitution } from 'hooks';
import { useDaoProposals } from 'hooks/useDaoProposals';
import useProposalActionsInfo from 'hooks/useProposalActionsInfo';

import useEndTime from '../../hooks/useEndTime';

import VoteForm from './components/VoteForm';

import { useProviderStore } from 'store/provider/hooks';
import { useTransaction } from 'store/transaction/hooks';

import { claimAirdropReward } from 'contracts/helpers/airdrop-v2';

import { PROPOSAL_STATUS } from 'constants/statuses';
import { unixToDate } from 'utils/date';

interface Props {
  proposal: ProposalBaseInfo;
  title: string;
  decodedCallData: DecodedData | null;
}

type CampaignStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ENDED';

function ProposalActions ({ proposal, title, decodedCallData }: Props) {
  const { t } = useTranslation();

  const { userAddress } = useProviderStore();
  const { submitTransaction } = useTransaction();
  const { voteForProposal, executeProposal } = useDaoProposals();
  const { checkIsUserCanVeto, checkIsUserCanVoting } = useProposalActionsInfo();
  const { isConstitutionSignNeeded, signConstitution, loadConstitutionData } = useSignConstitution();
  const [isUserCanVoting, setIsUserCanVoting] = useState(false);
  const [isUserCanVeto, setIsUserCanVeto] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [merkleProof, setMerkleProof] = useState<any>([]);
  const votingEndTime = useEndTime(unixToDate(proposal.params.votingEndTime.toString()));
  const [canClaimAirdrop, setCanClaimAirdrop] = useState<boolean>(false);
  const [isAddressVerified, setIsAddressVerified] = useState<boolean>(false);
  const [countdownMessage, setCountdownMessage] = useState<string>('');
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>('NOT_STARTED');

  const formatTimeDifference = (diffInSeconds: number) => {
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hours and ${minutes} minutes`;
    } else if (minutes < 0) {
      return `${diffInSeconds} seconds`;
    } else {
      return `${minutes} minutes`;
    }
  };

  useEffect(() => {
    const checkCampaignStatus = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const startDate = parseInt(localStorage.getItem('startTimestamp') ?? '0');
      const endDate = parseInt(localStorage.getItem('endTimestamp') ?? '0');

      if (currentTime < startDate) {
        setCampaignStatus('NOT_STARTED');
        const timeToStart = startDate - currentTime;
        setCountdownMessage(`Campaign starts in: ${formatTimeDifference(timeToStart)}`);
      } else if (currentTime >= startDate && currentTime <= endDate) {
        setCampaignStatus('IN_PROGRESS');
      } else if (currentTime > endDate) {
        setCountdownMessage('Campaign ended');
        setCampaignStatus('ENDED');
      }
    };

    const interval = setInterval(checkCampaignStatus, 60000); // Check every minute
    checkCampaignStatus(); // Check immediately upon mounting

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  const loadPermissions = async () => {
    const [isCanVoting, isCanVeto] = await Promise.all([
      checkIsUserCanVoting(proposal.relatedExpertPanel, proposal.relatedVotingSituation),
      checkIsUserCanVeto(proposal.target)
    ]);
    setIsUserCanVoting(isCanVoting);
    setIsUserCanVeto(isCanVeto);
  };

  const isMembershipSituation = useMemo(() => {
    return proposal.relatedVotingSituation === DefaultVotingSituations.Membership;
  }, [proposal.relatedVotingSituation]);

  const isSignNeeded = useMemo(() => {
    return isMembershipSituation && isConstitutionSignNeeded;
  }, [isMembershipSituation, isConstitutionSignNeeded]);

  const verifyAddressInMerkleTree = async (address: string) => {
    const treeData = await fetch('/src/artifacts/tree.json').then(res => res.json());
    const leafNodes = treeData.leafNodes.map((node:any) => Buffer.from(node, 'hex'));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

    const proofArray = leafNodes.map((node:any) =>
      merkleTree.getHexProof(node)
    );
    setMerkleProof(proofArray[0]);

    // Check if the address exists in the Merkle tree and update the state accordingly
    setIsAddressVerified(leafNodes.includes(keccak256(address)));
  };

  useEffect(() => {
    if (userAddress) {
      verifyAddressInMerkleTree(userAddress);
    }
  }, [userAddress]);

  useEffect(() => {
    if (
      campaignStatus === 'IN_PROGRESS' &&
      proposal.votingStatus === PROPOSAL_STATUS.executed
    ) {
      setCanClaimAirdrop(true);
    } else {
      setCanClaimAirdrop(false);
    }
  }, [campaignStatus, proposal.votingStatus, userAddress, isAddressVerified]);

  const canExecute = useMemo(() => {
    if (proposal.votingStatus !== PROPOSAL_STATUS.passed) return false;
    if (!decodedCallData || (isMembershipSituation && decodedCallData?.functionName !== 'addMember')) return true;

    return Boolean(userAddress) && decodedCallData.arguments?.member_ === userAddress;
  }, [proposal.votingStatus, userAddress, decodedCallData, isMembershipSituation]);

  const executeOrSignConstitution = () => {
    isSignNeeded
      ? signConstitution()
      : submitTransaction({
        successMessage: t('EXECUTE_TX'),
        submitFn: () => executeProposal(proposal)
      });
  };

  useEffect(() => {
    if (isMembershipSituation) {
      loadConstitutionData();
    }
  }, [isMembershipSituation]);

  useEffect(() => {
    loadPermissions();
  }, [proposal]);

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <ShareButton title={`#${proposal.id} ${title}`} url={window.location.href} />

      {proposal.votingStatus === PROPOSAL_STATUS.pending && isUserCanVoting && (
        <Button
          style={{ width: '160px' }}
          disabled={proposal.isUserVoted}
          onClick={() => setModalOpen(true)}
        >
          {proposal.isUserVoted ? t('YOU_VOTED') : t('VOTE')}
        </Button>
      )}

      {proposal.votingStatus === PROPOSAL_STATUS.executed && canClaimAirdrop && campaignStatus === 'IN_PROGRESS' && (
        <Button
          style={{ width: '160px' }}
          disabled={campaignStatus !== 'IN_PROGRESS'}
          onClick={() => submitTransaction({
            submitFn: () => claimAirdropReward({
              index: localStorage.getItem('campaign_id'),
              address: userAddress,
              proof: merkleProof,
            }),
            successMessage: 'Airdrop claimed successfully',
            onError: (error) => {
              console.error(error);
            }
          })}
        >
          {campaignStatus === 'IN_PROGRESS' ? t('CLAIM') : countdownMessage}
        </Button>
      )}

      {proposal.votingStatus === PROPOSAL_STATUS.executed && (campaignStatus !== 'IN_PROGRESS') && (
        <div className="page-layout__title-actions">{countdownMessage}</div>
      )}

      {proposal.votingStatus === PROPOSAL_STATUS.accepted && isUserCanVeto && (
        <Tooltip
          trigger={
            <Button
              look="danger"
              style={{ width: '160px' }}
              disabled={proposal.isUserVetoed}
              onClick={() => submitTransaction({
                successMessage: t('VETO_TX'),
                submitFn: () => voteForProposal({ type: 'veto', proposal })
              })}
            >
              {proposal.isUserVetoed ? t('YOU_VETOED') : t('VETO')}
            </Button>
          }
        >
          {t('ROOT_NODES_VETO_TIP')}
        </Tooltip>
      )}

      {canExecute && (
        <Button
          onClick={executeOrSignConstitution}
        >
          {isSignNeeded ? t('SIGN_CONSTITUTION_TO_EXECUTE') : t('EXECUTE')}
        </Button>
      )}

      <Modal
        open={modalOpen}
        title={t('VOTE')}
        tip={
          t('VOTE_MODAL_TIP', { time: votingEndTime.formatted })
        }
        onClose={() => setModalOpen(false)}
      >
        <VoteForm
          proposal={proposal}
          onSubmit={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default ProposalActions;
