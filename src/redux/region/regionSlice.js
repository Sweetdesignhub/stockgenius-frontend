import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('region') || '';

const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    setRegion: (state, action) => {
      const region = action.payload;
      localStorage.setItem('region', region);
      return region;
    },
    clearRegion: () => {
      localStorage.removeItem('region');
      return '';
    }
  }
});

export const { setRegion, clearRegion } = regionSlice.actions;
export default regionSlice.reducer;
