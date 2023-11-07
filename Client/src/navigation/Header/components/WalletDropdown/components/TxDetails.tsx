
import { useTranslation } from 'react-i18next';

import styled from 'styled-components';

import TxField from './TxField';

import { useTransaction } from 'store/transaction/hooks';

const TxDetailsWrapper = styled.div`
  .tx-details__list {
    max-height: 150px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }
  }

  .tx-details__empty { 
    display: flex;
    justify-content: center;
    padding: 12px 32px;
    height: 100%;
  }
`;

function TxDetails () {
  const { t } = useTranslation();
  const { transactions } = useTransaction();

  return (
    <TxDetailsWrapper>
      {transactions.length
        ? (
          <div className="tx-details__list">
            {transactions.map((transaction) => (
              <TxField
                key={transaction.id}
                tx={transaction}
              />
            ))}
          </div>
        )
        : (
          <p className="tx-details__empty color-secondary text-md">
            {t('EMPTY_TX')}
          </p>
        )
      }
    </TxDetailsWrapper >
  );
}

export default TxDetails;
