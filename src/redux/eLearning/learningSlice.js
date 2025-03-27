import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tradingExperience: "",
  focusArea: "",
  learningTime: "",
};

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    // ✅ Set all values at once (on Submit)
    setLearningPreferences: (state, action) => {
      return { ...state, ...action.payload };
    },

    // ✅ Update only one value at a time (on selection)
    updateLearningPreferences: (state, action) => {
      const { category, value } = action.payload;
      state[category] = value;
    },
  },
});

export const { setLearningPreferences, updateLearningPreferences } =
  learningSlice.actions;
export default learningSlice.reducer;
