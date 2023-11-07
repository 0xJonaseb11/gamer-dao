
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DAO_RESERVED_NAME, DefaultVotingSituations, getDecodeData } from '@q-dev/gdk-sdk';
import { Tag } from '@q-dev/q-ui-kit';
import { ProposalBaseInfo } from 'typings/proposals';

import PageLayout from 'components/PageLayout';

import DAORegistryCallData from './components/DAORegistryCallData';
import ProposalActions from './components/ProposalActions';
import ProposalDetails from './components/ProposalDetails';
import ProposalTurnout from './components/ProposalTurnout';
import ProposalVeto from './components/ProposalVeto';
import ProposalVoting from './components/ProposalVoting';
import { ProposalLayoutContainer } from './styles';

import { getStatusState, statusMap } from 'contracts/helpers/proposals-helper';

import { PROPOSAL_STATUS } from 'constants/statuses';

function ProposalLayout ({ proposal }: {
  proposal: ProposalBaseInfo;
}) {
  const { t } = useTranslation();
  const status = useMemo(() => {
    return t(statusMap[proposal.votingStatus || PROPOSAL_STATUS.none]);
  }, [proposal.votingStatus, t]);

  const isDAORegistryProposal = useMemo(() => {
    return proposal.relatedVotingSituation === DefaultVotingSituations.DAORegistry &&
      proposal.relatedExpertPanel === DAO_RESERVED_NAME;
  }, [proposal.relatedExpertPanel, proposal.relatedVotingSituation]);

  const isMembershipSituation = useMemo(() => {
    return proposal.relatedVotingSituation === DefaultVotingSituations.Membership;
  }, [proposal.relatedVotingSituation]);

  const membershipSituationsDecodedCallData = useMemo(() => {
    if (!isMembershipSituation) return null;
    try {
      return getDecodeData('DAOMemberStorage', proposal.callData) || null;
    } catch (_) {
      return null;
    }
  }, [proposal.callData, isMembershipSituation]);

  return (
    <PageLayout
      title={`#${proposal.id} ${proposal.relatedVotingSituation}`}
      titleExtra={<Tag state={getStatusState(proposal.votingStatus)}>{status}</Tag>}
      action={<ProposalActions
        proposal={proposal}
        title={proposal.remark}
        decodedCallData={membershipSituationsDecodedCallData}
      />}
    >
      <ProposalLayoutContainer>
        <ProposalDetails
          proposal={proposal}
          membershipSituationsDecodedCallData={membershipSituationsDecodedCallData}
        />
        {isDAORegistryProposal && (
          <DAORegistryCallData callData={proposal.callData}/>
        )}

        <div className="proposal-layout__voting">
          <ProposalTurnout proposal={proposal} />
          <ProposalVoting proposal={proposal} />
          <ProposalVeto proposal={proposal} />
        </div>
      </ProposalLayoutContainer>
    </PageLayout>
  );
}

export default ProposalLayout;
