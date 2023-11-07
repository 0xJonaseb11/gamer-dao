import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExpertPanelsState {
  expertPanels: string[];
  allPanels: string[];
}

const initialState: ExpertPanelsState = {
  expertPanels: [],
  allPanels: [],
};

const expertPanelsSlice = createSlice({
  name: 'expertPanels',
  initialState,
  reducers: {
    setExpertPanels: (state, { payload }: PayloadAction<string[]>) => {
      state.expertPanels = payload;
    },
    setAllPanels: (state, { payload }: PayloadAction<string[]>) => {
      state.allPanels = payload;
    }
  }
});

export const { setExpertPanels, setAllPanels } = expertPanelsSlice.actions;
export default expertPanelsSlice.reducer;
