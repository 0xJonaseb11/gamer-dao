import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { VotingType } from '@q-dev/gdk-sdk';
import { Icon, Progress } from '@q-dev/q-ui-kit';
import { formatNumber, formatPercent, toBigNumber } from '@q-dev/utils';
import BigNumber from 'bignumber.js';
import { singlePrecision } from 'helpers';
import { ProposalBaseInfo } from 'typings/proposals';

import { StyledProposalTurnout } from './styles';

import { useDaoTokenStore } from 'store/dao-token/hooks';

import { fromWeiWithDecimals } from 'utils/numbers';

function ProposalTurnout ({ proposal, }: { proposal: ProposalBaseInfo }) {
  const { t } = useTranslation();
  const { tokenInfo } = useDaoTokenStore();

  const leftQuorum = useMemo(() => {
    return BigNumber.max(
      toBigNumber(proposal.requiredQuorum.toString())
        .minus(proposal.currentQuorum.toString())
        .integerValue(BigNumber.ROUND_CEIL)
        .toNumber(), 0).toString();
  }, [proposal]);

  const isRestrictedVote = useMemo(() => {
    return proposal.params.votingType === VotingType.Restricted;
  }, [proposal]);

  const totalVotes = useMemo(() => {
    return toBigNumber(proposal.counters.votedFor.toString())
      .plus(proposal.counters.votedAgainst.toString()).toString();
  }, [proposal]);

  const noVoteValue = useMemo(() => {
    return toBigNumber(proposal.totalVoteValue)
      .minus(proposal.params.votingType === VotingType.Restricted
        ? toBigNumber(proposal.membersCount).plus(proposal.vetoMembersCount)
        : totalVotes
      )
      .toString();
  }, [proposal, totalVotes]);

  return (
    <StyledProposalTurnout className="block">
      <h2 className="text-h2">{t('TURNOUT')}</h2>

      <div className="block__content">
        <div className="proposal-turnout__quorum">
          <p className="text-md">
            {t('QUORUM', { quorum: formatPercent(singlePrecision(proposal.currentQuorum.toString())) })}
          </p>
          <p className="text-md">
            {leftQuorum
              ? t('LEFT_QUORUM', { quorum: formatPercent(singlePrecision(leftQuorum)) })
              : <Icon name="double-check" />
            }
          </p>
        </div>

        <Progress
          className="proposal-turnout__progress"
          value={Number(proposal.currentQuorum)}
          max={Number(proposal.requiredQuorum)}
        />

        <div className="proposal-turnout__votes">
          <div className="proposal-turnout__vote">
            <p className="text-md color-secondary">{t('VOTED')}</p>
            <p className="text-md proposal-turnout__votes-val">
              {formatNumber(isRestrictedVote ? totalVotes : fromWeiWithDecimals(totalVotes, tokenInfo?.decimals))}
            </p>
          </div>

          <div className="proposal-turnout__vote">
            <p className="text-md color-secondary">{t('DID_NOT_VOTE')}</p>
            <p className="text-md proposal-turnout__votes-val">
              {formatNumber(isRestrictedVote ? noVoteValue : fromWeiWithDecimals(noVoteValue, tokenInfo?.decimals))}
            </p>
          </div>
        </div>
      </div>
    </StyledProposalTurnout>
  );
}

export default ProposalTurnout;
