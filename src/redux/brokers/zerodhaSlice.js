// fyersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("zerodha_access_token") || "";

const zerodhaSlice = createSlice({
  name: "zerodha",
  initialState,
  reducers: {
    setZerodhaAccessToken: (state, action) => {
      const zerodha = action.payload;
      localStorage.setItem("zerodha_access_token",zerodha);
      return zerodha;
    },
    clearZerodhaAccessToken: () => {
      localStorage.removeItem("zerodha_access_token");
      return "";
    },
  },
});

export const { setZerodhaAccessToken, clearZerodhaAccessToken } =
  zerodhaSlice.actions;

export default zerodhaSlice.reducer;
