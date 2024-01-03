import { useEffect, useState } from 'react';

import TransactionModal from './components/TransactionModal';

import { useTransaction } from 'store/transaction/hooks';
import { Transaction } from 'store/transaction/reducer';

function TransactionLoader () {
  const { transactions } = useTransaction();
  const [activeTx, setActiveTx] = useState<Transaction | undefined>();

  useEffect(() => {
    setActiveTx(transactions[0]);
  }, [transactions]);

  return (
    <>
      {activeTx && !activeTx.isClosedModal
        ? <TransactionModal key={activeTx.id} tx={activeTx} />
        : null
      }
    </>
  );
}

export default TransactionLoader;
