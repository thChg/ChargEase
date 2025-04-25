import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

const initialState = {
  loading: false,
  error: null,
  vehicleInfo: {},
};

export const fetchVehicleInfo = createAsyncThunk(
  "vehicle/fetchVehicleInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/smartcar/vehicle-info");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch vehicle information.");
    }
  }
);

const VehicleInformationSlice = createSlice({
  name: "VehicleInformation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleInfo = action.payload;
      })
      .addCase(fetchVehicleInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default VehicleInformationSlice.reducer;