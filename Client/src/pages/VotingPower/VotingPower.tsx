import { useTranslation } from 'react-i18next';

import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

import PageLayout from 'components/PageLayout';

import BalanceOverview from './components/BalanceOverview';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';

const StyledWrapper = styled.div`
  display: grid;
  gap: 24px;

  ${media.lessThan('medium')} {
    gap: 16px;
  }

  .voting-power__main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    ${media.lessThan('medium')} {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
`;

function VotingPower () {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('VOTING_POWER')}>
      <StyledWrapper>
        <BalanceOverview />
        <div className="voting-power__main">
          <DepositForm />
          <WithdrawForm />
        </div>
      </StyledWrapper>
    </PageLayout>
  );
}

export default VotingPower;
