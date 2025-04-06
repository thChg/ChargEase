import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChargingStation {
  distance: number;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  status: string;
  isFavourite: boolean;
  reachable: boolean;
  availableSlots: number;
}

interface StationState {
  selectedForDirection: ChargingStation | null;
}

const initialState: StationState = {
  selectedForDirection: null,
};

const FetchDirectionSlice = createSlice({
  name: "FetchDirection",
  initialState,
  reducers: {
    setSelectedForDirection: (
      state,
      action: PayloadAction<ChargingStation | null>
    ) => {
      state.selectedForDirection = action.payload;
    },
    clearSelectedForDirection: (state) => {
      state.selectedForDirection = null;
    },
  },
});

export const { setSelectedForDirection, clearSelectedForDirection } =
  FetchDirectionSlice.actions;
export default FetchDirectionSlice.reducer;
