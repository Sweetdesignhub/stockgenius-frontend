import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config.js";

export const fetchFeatures = createAsyncThunk(
  "features/fetchFeatures",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/v1/features/features", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch features");
    }
  }
);

const featuresSlice = createSlice({
  name: "features",
  initialState: {
    plan: null,
    usage: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.status = "idle";
        state.plan = action.payload.plan;
        state.usage = action.payload.usage;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default featuresSlice.reducer;