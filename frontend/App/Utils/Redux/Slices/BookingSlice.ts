import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

const initialState = {
  loading: false,
  error: null,
  bookings: [],
};

export const fetchBookingHistory = createAsyncThunk(
  "/booking/getHistory",
  async ({ userID }: { userID: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/booking/getHistory?userId=${userID}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking history."
      );
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "/booking/cancelBooking/id",
  async (
    { bookingId, userId }: { bookingId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.delete(`/booking/cancelBooking/${bookingId}`, {
        data: { userId: userId },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete booking."
      );
    }
  }
);
const bookingSlice = createSlice({
  name: "Booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
      })
      .addCase(fetchBookingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
