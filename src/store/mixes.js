import { createSlice } from "@reduxjs/toolkit";

const mixesSlice = createSlice({
  name: 'mixes',
  initialState: [],
  reducers: {
    setMixesState: (state, action) => {
      const { mixes, ingredientsState } = action.payload;
      return mixes;
    },
    addOrUpdateMixState: (state, action) => {
      const { newMix, ingredientsState } = action.payload;
      const updatedMix = newMix;
      const existingIndex = state.findIndex((mix) => mix._id === newMix._id);

      if (existingIndex !== -1) {
        state[existingIndex] = updatedMix;
      } else {
        state.push(updatedMix);
      }
    },
    updateMixState: (state, action) => {
      const { updatedMix, ingredientsState } = action.payload;
      const calculatedMix = updatedMix;
      const existingIndex = state.findIndex((mix) => mix._id === updatedMix._id);

      if (existingIndex !== -1) {
        state[existingIndex] = calculatedMix;
      }
    },
    deleteMixState: (state, action) => {
      return state.filter((mix) => mix._id !== action.payload._id);
    },
  },
});

export const { setMixesState, addOrUpdateMixState, updateMixState, deleteMixState } = mixesSlice.actions;
export default mixesSlice.reducer;
