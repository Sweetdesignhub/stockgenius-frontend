import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import regionReducer from "./region/regionSlice.js";
import marketReducer from "./region/marketSlice.js";
import fyersReducer from './brokers/fyersSlice.js'
import learningReducer from './eLearning/learningSlice.js'
import pricingReducer from './pricing/pricingSlice.js'

const rootReducer = combineReducers({
  user: userReducer,
  region: regionReducer,
  market: marketReducer,
  fyers:fyersReducer,
  learning: learningReducer,
  pricing: pricingReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
