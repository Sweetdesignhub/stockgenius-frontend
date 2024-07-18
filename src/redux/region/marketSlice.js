import { createSlice } from '@reduxjs/toolkit';

const initialState = 'NYSE';

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarket: (state, action) => {
      return action.payload;
    },
    clearMarket: () => {
      return '';
    }
  }
});

export const { setMarket, clearMarket } = marketSlice.actions;
export default marketSlice.reducer;
