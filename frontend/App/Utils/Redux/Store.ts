import { configureStore } from "@reduxjs/toolkit";
import ChargingStationReducer from "./Slices/ChargingStationSlice";
import FetchDirectionReducer from "./Slices/FetchDirectionSlice"
import VehicleInformationReducer from "./Slices/VehicleInformationSlice";
import BookingReducer from "./Slices/BookingSlice";

export const store = configureStore({
  reducer: {
    ChargingStations: ChargingStationReducer,
    FetchDirection: FetchDirectionReducer, 
    VehicleInformation: VehicleInformationReducer,   
    Booking: BookingReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
