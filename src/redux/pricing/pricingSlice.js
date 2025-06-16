import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showPlanSelectDialog: false,
};

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    setShowPlanSelectDialog: (state, action) => {
      state.showPlanSelectDialog = action.payload;
    },
  },
});

export const { setShowPlanSelectDialog } = pricingSlice.actions;
export default pricingSlice.reducer;
