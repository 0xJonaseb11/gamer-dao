import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Progress, Tooltip } from '@q-dev/q-ui-kit';
import { formatNumber, formatPercent, toBigNumber, unixToDate } from '@q-dev/utils';
import { singlePrecision } from 'helpers';
import { ProposalBaseInfo } from 'typings/proposals';

import useEndTime from '../../hooks/useEndTime';

import { StyledProposalVeto } from './styles';

function ProposalVeto ({ proposal }: { proposal: ProposalBaseInfo }) {
  const { t } = useTranslation();

  const vetoEndTime = useEndTime(unixToDate(proposal.params.vetoEndTime.toString()));

  const noVoteCount = useMemo(() => {
    return toBigNumber(proposal.vetoMembersCount).minus(proposal.counters.vetoesCount.toString()).toNumber();
  }, [proposal]);

  return proposal.isVetoGroupExists && Number(proposal.vetoMembersCount)
    ? (
      <StyledProposalVeto className="block">
        <div className="block__header">
          <h2 className="text-h2">{t('VETO')}</h2>
          <Tooltip
            placement="bottom"
            trigger={(
              <p className="text-md font-light">{vetoEndTime.relative}</p>
            )}
          >
            {vetoEndTime.formatted}
          </Tooltip>
        </div>

        <div className="block__content">
          <p className="text-md">
            {t('THRESHOLD', {
              threshold: formatPercent(singlePrecision(proposal.params.requiredVetoQuorum.toString())),
            })}
          </p>

          <Progress
            className="proposal-veto__progress"
            value={Number(proposal.counters.vetoesCount)}
            max={Number(proposal.vetoMembersCount)}
          />

          <div className="proposal-veto__votes">
            <div className="proposal-veto__vote">
              <p className="text-md">{t('OBJECTION')}</p>
              <p className="text-md proposal-veto__vote-val">
                {formatPercent(toBigNumber(proposal.counters.vetoesCount.toString())
                  .div(proposal.vetoMembersCount).multipliedBy(100))}
              </p>
              <p className="text-md proposal-veto__vote-val">
                {formatNumber(proposal.counters.vetoesCount.toString())}
              </p>
            </div>

            <div className="proposal-veto__vote">
              <p className="text-md">{t('DID_NOT_VOTE')}</p>
              <p className="text-md proposal-veto__vote-val">
                {formatPercent(toBigNumber(noVoteCount).div(proposal.vetoMembersCount).multipliedBy(100))}
              </p>
              <p className="text-md proposal-veto__vote-val">
                {formatNumber(noVoteCount)}
              </p>
            </div>
          </div>
        </div>
      </StyledProposalVeto>
    )
    : null;
}

export default ProposalVeto;
