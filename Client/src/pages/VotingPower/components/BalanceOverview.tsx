import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { media } from '@q-dev/q-ui-kit';
import { useAnimateNumber, useInterval } from '@q-dev/react-hooks';
import { formatNumberCompact, unixToDate } from '@q-dev/utils';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';

import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useDaoVault } from 'store/dao-vault/hooks';

import { formatDateDMY } from 'utils/date';

const StyledWrapper = styled.div`
  display: grid;
  gap: 24px;

  ${media.lessThan('medium')} {
    gap: 16px;
  }

  .balance-overview__params {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    ${media.lessThan('medium')} {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .balance-overview__params-value-wrapper {
    display: flex;
    gap: 4px;
  }

`;

function BalanceOverview () {
  const { t } = useTranslation();
  const {
    vaultBalance,
    lockedBalance,
    walletBalance,
    vaultTimeLock,
    loadWalletBalance,
    loadVaultBalance,
    loadWithdrawalAmount
  } = useDaoVault();
  const { tokenInfo } = useDaoTokenStore();

  const animateNumberFormatter = (value: BigNumber.Value) =>
    formatNumberCompact(value, tokenInfo ? tokenInfo.formatNumber : 4);
  const userQVBalanceRef = useAnimateNumber(vaultBalance, '', animateNumberFormatter);
  const userLockedBalanceRef = useAnimateNumber(lockedBalance, '', animateNumberFormatter);
  const userAccountBalanceRef = useAnimateNumber(walletBalance, '', animateNumberFormatter);

  useEffect(() => {
    loadWalletBalance();
    loadVaultBalance();
  }, []);

  useInterval(() => {
    loadWithdrawalAmount();
  }, 5000);

  return (
    <StyledWrapper className="block">
      <h2 className="text-h2">{t('OVERVIEW')}</h2>
      <div className="balance-overview__params">
        <div>
          <p className="text-md color-secondary">{t('VOTING_POWER')}</p>
          <div className="balance-overview__params-value-wrapper">
            <p
              ref={userQVBalanceRef}
              title={vaultBalance}
              className="text-xl font-semibold"
            >0</p>
            <p className="text-xl font-semibold">{tokenInfo?.symbol}</p>
          </div>
        </div>
        <div>
          <p className="text-md color-secondary">{t('TOKEN_ADDRESS_BALANCE', { token: tokenInfo?.symbol })}</p>
          <div className="balance-overview__params-value-wrapper">
            <p
              ref={userAccountBalanceRef}
              title={walletBalance}
              className="text-xl font-semibold"
            >0</p>
            <p className="text-xl font-semibold">{tokenInfo?.symbol}</p>
          </div>
        </div>
        <div>
          <p className="text-md color-secondary">{t('LOCKED_TOKENS', { symbol: tokenInfo?.symbol })}</p>
          <div className="balance-overview__params-value-wrapper">
            <p
              ref={userLockedBalanceRef}
              title={lockedBalance}
              className="text-xl font-semibold"
            >0</p>
            <p className="text-xl font-semibold">{tokenInfo?.symbol}</p>
          </div>
        </div>
        <div>
          <p className="text-md color-secondary">{t('LOCKING_END_TIME')}</p>
          {vaultTimeLock === '0'
            ? '–'
            : (
              <p className="text-xl font-semibold">{formatDateDMY(unixToDate(vaultTimeLock))}</p>
            )
          }
        </div>
      </div>
    </StyledWrapper>
  );
}

export default BalanceOverview;
