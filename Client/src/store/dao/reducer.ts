import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportedDaoNetwork } from 'typings/dao';

interface DAOState {
  daoAddress: string;
  supportedNetworks: SupportedDaoNetwork[];
};

const initialState: DAOState = {
  daoAddress: '',
  supportedNetworks: [],
};

const expertsSlice = createSlice({
  name: 'dao',
  initialState,
  reducers: {
    setDaoAddress: (state, { payload }: PayloadAction<string>) => {
      state.daoAddress = payload;
    },
    setSupportedNetworks: (state, { payload }: PayloadAction<SupportedDaoNetwork[]>) => {
      state.supportedNetworks = payload;
    },
  }
});

export const { setDaoAddress, setSupportedNetworks } = expertsSlice.actions;
export default expertsSlice.reducer;
