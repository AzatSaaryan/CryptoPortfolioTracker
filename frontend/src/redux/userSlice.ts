import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/User";

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.data = null;
    },
  },
});

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, logout } =
  userSlice.actions;

export default userSlice.reducer;
