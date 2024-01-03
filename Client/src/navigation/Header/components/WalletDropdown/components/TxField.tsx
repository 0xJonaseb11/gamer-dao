import { Icon, Spinner } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

import useNetworkConfig from 'hooks/useNetworkConfig';

import { Transaction, TxStatus } from 'store/transaction/reducer';

interface Props {
  tx: Transaction;
}
const TxFieldContainer = styled.div<{ txState: TxStatus }>`
  .tx-field__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background-color: transparent;
    border: none;
    padding: 8px 16px;
    gap: 2px;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.tertiaryLight};
    }
  }

  .tx-field__item-title {
    display: block;
    max-width: 200px;
    width: 100%;
    white-space: break-spaces;
    word-wrap: break-word;
  }

  .tx-field__item-icon {
    color: ${({ theme, txState }) => {
    switch (txState) {
      case 'success':
        return theme.colors.successMain;
      case 'error':
        return theme.colors.errorMain;
      case 'waitingConfirmation':
      case 'sending':
        return theme.colors.infoPrimary;
    }
  }};
  }
`;
function TxField ({ tx }: Props) {
  const { explorerUrl } = useNetworkConfig();

  const getIconName = (type: string) => {
    return type === 'success' ? 'check-circle' : 'cross-circle';
  };

  const isTxCompleted = tx.status === 'success' || tx.status === 'error';

  return (
    <TxFieldContainer txState={tx.status}>
      {tx.hash
        ? (
          <a
            href={`${explorerUrl}/tx/${tx.hash}`}
            target="_blank"
            className="tx-field__item text-md"
            rel="noreferrer"
            title={tx.message}
          >
            <span className="tx-field__item-title">
              {tx.message}
            </span>
            {isTxCompleted
              ? <Icon name={getIconName(tx.status)} className="tx-field__item-icon" />
              : <Spinner size={20} />
            }
          </a>
        )
        : (
          <div
            className="tx-field__item text-md"
            title={tx.message}
          >
            <span className="tx-field__item-title">
              {tx.message}
            </span>
            {isTxCompleted
              ? <Icon name={getIconName(tx.status)} className="tx-field__item-icon" />
              : <Spinner size={20} />
            }
          </div>)
      }
    </TxFieldContainer>
  );
}

export default TxField;
