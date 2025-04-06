import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import chargingStations from "../../dummyData";
import axios from "axios";

const BACKEND_URL = "http://192.168.1.8:8080";

interface ChargingStation {
  id: string;
  distance: number;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  status: string;
  isFavourite: boolean;
  reachable: boolean;
  availableSlots: number;
}

interface chargingStationsState {
  chargingStations: ChargingStation[];
  loading: boolean;
  error: string | null;
}

const initialState: chargingStationsState = {
  chargingStations: [],
  loading: false,
  error: null,
};

export const fetchChargingStations = createAsyncThunk(
  "/charger/findCharging",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      console.log(`${BACKEND_URL}/charger/findCharging`);
      const response = await axios.get(`${BACKEND_URL}/charger/findCharging`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch charging stations."
      );
    }
  }
);

const ChargingStationSlice = createSlice({
  name: "ChargingStations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargingStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChargingStations.fulfilled,
        (state, action: PayloadAction<ChargingStation>) => {
          state.loading = false;
          state.chargingStations = Array.isArray(action.payload)
            ? action.payload
            : [action.payload];
        }
      )
      .addCase(fetchChargingStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ChargingStationSlice.reducer;
