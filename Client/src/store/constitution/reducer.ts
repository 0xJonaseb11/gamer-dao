import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConstitutionState {
  hash: string;
  lastUpdate: number;
};

const initialState: ConstitutionState = {
  hash: '',
  lastUpdate: 0
};

const constitutionSlice = createSlice({
  name: 'constitution',
  initialState,
  reducers: {
    setHash: (state, { payload }: PayloadAction<string>) => {
      state.hash = payload;
    },

    setLastUpdate: (state, { payload }: PayloadAction<number>) => {
      state.lastUpdate = payload;
    }
  }
});

export const { setHash, setLastUpdate } = constitutionSlice.actions;
export default constitutionSlice.reducer;
