import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import chargingStations from "../../dummyData";

interface ChargingStation {
  distance: number;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  status: string;
  isFavourite: boolean;
}

const initialState: ChargingStation[] = chargingStations;

const FavouriteSlice = createSlice({
  name: "FavouriteStations",
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<ChargingStation>) => {
      state.push(action.payload);
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      return state.filter(
        (station) => station.id.toString() !== action.payload
      );
    },
  },
});

export const { addFavourite, removeFavourite } = FavouriteSlice.actions;
export default FavouriteSlice.reducer;
