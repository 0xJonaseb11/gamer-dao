import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UseProvider } from 'typings';

interface ProviderState {
  currentProvider: UseProvider | null;
};

const initialState: ProviderState = {
  currentProvider: null
};

const providerSlice = createSlice({
  name: 'provider-slice',
  initialState,
  reducers: {
    setProvider: (state, { payload }: PayloadAction<UseProvider>) => {
      state.currentProvider = payload;
    },
  }
});

export const { setProvider } = providerSlice.actions;
export default providerSlice.reducer;
