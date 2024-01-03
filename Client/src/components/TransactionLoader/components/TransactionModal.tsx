import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, Modal, Spinner } from '@q-dev/q-ui-kit';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

import Button from 'components/Button';

import TxHashLink from './TxHashLink';

import { useTransaction } from 'store/transaction/hooks';
import { Transaction, TxStatus } from 'store/transaction/reducer';

const TransactionModalContainer = styled.div<{ txState: TxStatus }>`
  display: flex;
  height: 250px;
  width: 100%;
  padding-top: ${({ txState }) => (txState === 'error' ? '30px' : '10px')};

  .transaction-modal__loading {
    margin-top: 10px;
    height: 100%;
  }

  .transaction-modal__text {
    padding-top: 10px;
  }

  .transaction-modal__centered {
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
  }

  .transaction-modal__icon {
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
    font-size: 70px;
  }
`;

interface Props {
  tx: Transaction;
}

function TransactionModal ({ tx }: Props) {
  const { t } = useTranslation();

  const { updateTransaction } = useTransaction();

  const [modalOpen, setModalOpen] = useState(true);

  const handleClose = () => {
    setModalOpen(false);
    updateTransaction(tx.id, { isClosedModal: true });
  };

  const txStateTitles: Record<TxStatus, string> = {
    waitingConfirmation: t('WAITING_FOR_CONFIRMATION'),
    sending: t('WAITING_FOR_SUCCESS'),
    success: t('TRANSACTION_SUCCESS'),
    error: t('TRANSACTION_REJECTED'),
  };

  return (
    <Modal
      title={txStateTitles[tx.status]}
      open={modalOpen}
      onClose={handleClose}
    >
      <TransactionModalContainer txState={tx.status}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={tx.status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="transaction-modal__centered"
          >
            {tx.status === 'waitingConfirmation' && (
              <div className="transaction-modal__loading transaction-modal__centered">
                <Spinner size={160} thickness={4} />
                <p className="text-md break-word color-primary transaction-modal__text">
                  {t('WAITING_FOR_A_TRANSACTION_TO_BE_CONFIRMED')}
                </p>
              </div>
            )}

            {(tx.hash && tx.status === 'sending') && (
              <>
                <Spinner size={110} thickness={4} />
                <div>
                  <p className="text-xl break-word color-primary transaction-modal__text">
                    {t('TRANSACTION_CONFIRMED')}
                  </p>
                  <TxHashLink hash={tx.hash} />
                </div>
              </>
            )}

            {(tx.status === 'success' || tx.status === 'error') && (
              <>
                <div>
                  <Icon name={tx.status === 'success' ? 'double-check' : 'cross'} className="transaction-modal__icon" />
                  <p className="text-xl break-word color-primary transaction-modal__text">{tx.message}</p>
                  {tx.hash && <TxHashLink hash={tx.hash} />}
                </div>
                <Button style={{ width: '100%' }} onClick={handleClose}>
                  {t('CLOSE')}
                </Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </TransactionModalContainer>
    </Modal>
  );
}

export default TransactionModal;
