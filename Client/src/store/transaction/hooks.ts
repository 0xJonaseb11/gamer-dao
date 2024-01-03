import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ContractTransaction } from 'ethers';
import { ErrorHandler, getErrorMessage } from 'helpers';
import { t } from 'i18next';
import uniqueId from 'lodash/uniqueId';

import { setTransactions, Transaction, TransactionEditableParams } from './reducer';

import { getState, useAppSelector } from 'store';
import { useDaoVault } from 'store/dao-vault/hooks';

import { Bus } from 'utils';

export function useTransaction () {
  const dispatch = useDispatch();
  const { loadAllBalances } = useDaoVault();

  const pendingTransactions = useAppSelector(({ transaction }) => {
    return transaction.transactions.filter((item: Transaction) =>
      item.status === 'sending' || item.status === 'waitingConfirmation');
  });

  const transactions: Transaction[] = useAppSelector(({ transaction }) => transaction.transactions);

  async function submitTransaction ({
    submitFn,
    successMessage,
    isClosedModal = false,
    onSuccess = () => {},
    onConfirm = () => {},
    onError = () => {},
  }: {
    submitFn: () => Promise<ContractTransaction | void | undefined>;
    successMessage?: string;
    isClosedModal?: boolean;
    onSuccess?: () => void;
    onConfirm?: () => void;
    onError?: (error?: unknown) => void;
  }) {
    const transaction: Transaction = {
      id: uniqueId(),
      isClosedModal,
      message: successMessage || t('DEFAULT_MESSAGE_TX'),
      status: 'waitingConfirmation',
    };

    const { transactions } = getState().transaction;
    dispatch(setTransactions([{ ...transaction }, ...transactions]));

    try {
      const submitResponse = await submitFn();
      if (submitResponse?.wait) {
        updateTransaction(transaction.id, { hash: submitResponse.hash, status: 'sending' });
        onConfirm();
        await submitResponse.wait();
      }
      onSuccess();
      updateTransaction(transaction.id, { status: 'success' });
      await alertTxStatus(transaction.id, transaction.message);
    } catch (error) {
      getTxById(transaction.id)?.isClosedModal
        ? ErrorHandler.process(error)
        : ErrorHandler.processWithoutFeedback(error);

      onError(error);
      updateTransaction(transaction.id, { status: 'error', message: getErrorMessage(error) });
    }
  }

  const updateTransaction = (id: string, params: TransactionEditableParams) => {
    const { transactions } = getState().transaction;
    const txIndex = transactions.findIndex((tx: Transaction) => tx.id === id);
    if (txIndex === -1) return;
    const newTxs = [...transactions];
    newTxs[txIndex] = { ...newTxs[txIndex], ...params };
    dispatch(setTransactions(newTxs));
  };

  const getTxById = (id: string) => {
    const { transactions } = getState().transaction;
    return transactions.find((tx: Transaction) => tx.id === id);
  };

  const alertTxStatus = async (id: string, message: string) => {
    const currentTx = getTxById(id);
    if (currentTx?.isClosedModal) {
      Bus.success(message);
    }
    await loadAllBalances();
  };
  return {
    pendingTransactions,
    transactions,
    submitTransaction: useCallback(submitTransaction, []),
    updateTransaction: useCallback(updateTransaction, []),
  };
}
