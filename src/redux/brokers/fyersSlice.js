// fyersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("fyers_access_token") || "";

const fyersSlice = createSlice({
  name: "fyers",
  initialState,
  reducers: {
    setFyersAccessToken: (state, action) => {
      const fyers = action.payload;
      localStorage.setItem("fyers_access_token",fyers);
      return fyers;
    },
    clearFyersAccessToken: () => {
      localStorage.removeItem("fyers_access_token");
      return "";
    },
  },
});

export const { setFyersAccessToken, clearFyersAccessToken } =
  fyersSlice.actions;

export default fyersSlice.reducer;
