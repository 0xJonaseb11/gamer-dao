import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from '@q-dev/q-ui-kit';
import { unixToDate } from '@q-dev/utils';
import styled from 'styled-components';
import { ProposalBaseInfo } from 'typings/proposals';

import { formatDate, formatDateRelative } from 'utils/date';

const VotingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  grid-template-columns: repeat(2, 1fr);

  div:nth-child(2) {
    text-align: right;
  }
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  proposal: ProposalBaseInfo;
}

function VotingPeriods ({ proposal, ...rest }: Props) {
  const { t, i18n } = useTranslation();
  const votingEndTime = unixToDate(proposal.params.votingEndTime.toString()).getTime();
  const vetoEndTime = unixToDate(proposal.params.vetoEndTime.toString()).getTime();

  const votingText = votingEndTime > Date.now()
    ? t('VOTING_ENDS')
    : t('VOTING_ENDED');
  const vetoText = vetoEndTime > Date.now()
    ? t('VETO_ENDS')
    : t('VETO_ENDED');

  return (
    <VotingContainer {...rest}>
      <Tooltip
        placement="bottom"
        trigger={(
          <p className="text-md font-light">
            {`${votingText} ${formatDateRelative(votingEndTime, i18n.language)}`}
          </p>
        )}
      >
        {formatDate(votingEndTime, i18n.language)}
      </Tooltip>

      <Tooltip
        placement="bottom"
        disabled={!proposal.isVetoGroupExists || !Number(proposal.vetoMembersCount) || !vetoEndTime}
        trigger={(
          <p className="text-md font-light">
            {!proposal.isVetoGroupExists || !Number(proposal.vetoMembersCount) || !vetoEndTime
              ? t('NO_VETO')
              : `${vetoText} ${formatDateRelative(vetoEndTime, i18n.language)}`
            }
          </p>
        )}
      >
        {formatDate(vetoEndTime, i18n.language)}
      </Tooltip>
    </VotingContainer>
  );
}

export default VotingPeriods;
