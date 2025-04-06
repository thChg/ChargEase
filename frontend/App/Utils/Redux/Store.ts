import { configureStore } from "@reduxjs/toolkit";
import ChargingStationReducer from "./Slices/ChargingStationSlice";
import FetchDirectionReducer from "./Slices/FetchDirectionSlice"

export const store = configureStore({
  reducer: {
    ChargingStations: ChargingStationReducer,
    FetchDirection: FetchDirectionReducer,    
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
