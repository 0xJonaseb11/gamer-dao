import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConstitutionData {
  isSigned: boolean;
  signedAt: string;
}

interface QVaultState {
  walletBalance: string;
  chainBalance: string;
  walletNftsList: string[];
  vaultBalance: string;
  withdrawalBalance: string;
  withdrawalNftsList: string[];
  lockedBalance: string;
  deposit: number;
  vaultTimeLock: string;

  constitutionData: ConstitutionData;
}

const initialState: QVaultState = {
  walletBalance: '0',
  chainBalance: '0',
  walletNftsList: [],
  vaultBalance: '0',
  deposit: 0,
  withdrawalBalance: '0',
  withdrawalNftsList: [],
  lockedBalance: '0',
  vaultTimeLock: '0',
  constitutionData: {
    isSigned: false,
    signedAt: '0',
  }
};

const qVaultSlice = createSlice({
  name: 'q-vault',
  initialState,
  reducers: {
    setVaultBalance (state, { payload }: PayloadAction<string>) {
      state.vaultBalance = payload;
    },

    setWalletBalance (state, { payload }: PayloadAction<string>) {
      state.walletBalance = payload;
    },

    setChainBalance (state, { payload }: PayloadAction<string>) {
      state.chainBalance = payload;
    },

    setVaultTimeLock (state, { payload }: PayloadAction<string>) {
      state.vaultTimeLock = payload;
    },

    setWithdrawalBalance (state, { payload }: PayloadAction<string>) {
      state.withdrawalBalance = payload;
    },

    setWithdrawalNftsList (state, { payload }: PayloadAction<string[]>) {
      state.withdrawalNftsList = payload;
    },

    setWalletNftsList (state, { payload }: PayloadAction<string[]>) {
      state.walletNftsList = payload;
    },

    setLockedBalance (state, { payload }: PayloadAction<string>) {
      state.lockedBalance = payload;
    },

    setConstitutionData (state, { payload }: PayloadAction<ConstitutionData>) {
      state.constitutionData = payload;
    },
  }
});

export const {
  setVaultBalance,
  setWalletBalance,
  setVaultTimeLock,
  setWithdrawalBalance,
  setWithdrawalNftsList,
  setLockedBalance,
  setWalletNftsList,
  setChainBalance,
  setConstitutionData
} = qVaultSlice.actions;
export default qVaultSlice.reducer;
