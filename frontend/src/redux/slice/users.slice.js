import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: { accessToken: "", refreshToken: "" },
  reducers: {
    storeAccessToken(state, action) {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
    },

    storeRefreshToken(state, action) {
      const { refreshToken } = action.payload;
      state.refreshToken = refreshToken;
    },

    clearAccessToken(state, _) {
      state.accessToken = "";
    },

    clearRefreshToken(state, _) {
      state.refreshToken = "";
    },
  },
});

export const userActions = userSlice.actions;

export const userReducer = userSlice.reducer;
