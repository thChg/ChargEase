import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

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
  async (
    { longitude, latitude, userID }: { longitude: number; latitude: number, userID: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/charger/findCharging/${userID}?longitude=${longitude}&latitude=${latitude}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch charging stations."
      );
    }
  }
);

export const handleFavouriteStation = createAsyncThunk(
  "/user/favourite",
  async (
    {
      isFavourite,
      userID,
      stationID,
    }: {
      isFavourite: boolean | null;
      userID: string | null;
      stationID: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      let response;
      if (isFavourite) {
        response = await api.post(`/user/delFavouriteCharger/${stationID}`, {
          userID: userID,
        });
      } else {
        response = await api.post(`/user/favoriteCharger/${stationID}`, {
          userID: userID,
        });
      }
      return { stationID: stationID, isFavourite: !isFavourite };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch charging stations."
      );
    }
  }
);

export const handleCommentStation = createAsyncThunk(
  "/user/comment",
  async (
    {
      comment,
      star,
      username,
      stationID,
    }: {
      comment: string;
      star: number;
      username: string | null;
      stationID: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/comment/${stationID}`, {
        comment,
        star,
        username,
      });
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
          state.chargingStations = action.payload.stations;
        }
      )
      .addCase(fetchChargingStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(handleFavouriteStation.fulfilled, (state, action) => {
        state.loading = false;
        state.chargingStations = state.chargingStations.map((station) => {
          if (station.id === action.payload.stationID) {
            return {
              ...station,
              isFavourite: action.payload.isFavourite,
            };
          }
          return station;
        });
      })
      .addCase(handleCommentStation.fulfilled, (state, action) => {
        state.loading = false;
        state.chargingStations = state.chargingStations.map((station) => {
          if (station.id === action.payload.stationID) {
            return {
              ...station,
              comments: [...station.comments, action.payload.comment],
            };
          }
          return station;
        });
      });
  },
});

export default ChargingStationSlice.reducer;
