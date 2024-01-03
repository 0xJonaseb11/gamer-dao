import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TxStatus = 'waitingConfirmation' | 'sending' | 'success' | 'error';

export interface Transaction {
  id: string;
  message: string;
  status: TxStatus;
  hash?: string;
  isClosedModal?: boolean;
}

export interface TransactionEditableParams {
  message?: string;
  status?: TxStatus;
  isConfirmed?: boolean;
  isClosedModal?: boolean;
  hash?: string;
}

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, { payload }: PayloadAction<Transaction[]>) => {
      state.transactions = payload;
    },
  },

});

export const { setTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
