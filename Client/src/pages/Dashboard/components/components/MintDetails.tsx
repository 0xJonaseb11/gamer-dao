
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumberCompact } from '@q-dev/utils';
import styled from 'styled-components';

import { useDaoTokenStore } from 'store/dao-token/hooks';

import { fromWeiWithDecimals } from 'utils/numbers';

interface Props {
  isCanMint: boolean;
  availableMintValue: string;
}
export const MintDetailsWrapper = styled.div`
  display: grid;
  gap: 12px;

  .mint-details__item,
  .mint-details__item-amount {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mint-details__minted {
    display: flex;
    justify-content: center;
    color: ${({ theme }) => theme.colors.successMain};
  }
`;

function MintDetails ({ isCanMint, availableMintValue }: Props) {
  const { t } = useTranslation();
  const { tokenInfo } = useDaoTokenStore();

  const mintDetailsList = useMemo(() => tokenInfo
    ? [
      {
        title: t('TOTAL_TOKEN_SUPPLY_CAP'),
        amountTitle: tokenInfo.totalSupplyCap ? fromWeiWithDecimals(tokenInfo.totalSupplyCap, tokenInfo.decimals) : '–',
        amount: tokenInfo.totalSupplyCap
          ? formatNumberCompact(
            fromWeiWithDecimals(tokenInfo.totalSupplyCap, tokenInfo.decimals), tokenInfo.formatNumber
          )
          : '–'
      },
      {
        title: t('MINTED_TOKENS'),
        amountTitle: fromWeiWithDecimals(tokenInfo.totalSupply, tokenInfo.decimals),
        amount: formatNumberCompact(
          fromWeiWithDecimals(tokenInfo.totalSupply, tokenInfo.decimals), tokenInfo.formatNumber
        )
      },
      {
        title: t('AVAILABLE_TOKENS_FOR_MINT'),
        amountTitle: tokenInfo.totalSupplyCap ? availableMintValue : '–',
        amount: tokenInfo.totalSupplyCap ? formatNumberCompact(availableMintValue, tokenInfo.formatNumber) : '–'
      },
    ]
    : [], [availableMintValue, tokenInfo, t]);

  return (
    <MintDetailsWrapper>
      {
        mintDetailsList.map((item, index) => (
          <div key={index} className="mint-details__item">
            <p className="text-md color-secondary">
              {item.title}
            </p>
            <div className="mint-details__item-amount">
              <p className="text-lg font-semibold" title={item.amountTitle}>
                {item.amount}
              </p>
              <p className="text-lg font-semibold">{tokenInfo?.symbol}</p>
            </div>
          </div>
        ))
      }

      {!isCanMint && (
        <p className="mint-details__minted text-lg font-bold">{t('MINTED_ALL_TOKEN')}</p>
      )}
    </MintDetailsWrapper>
  );
}

export default MintDetails;
