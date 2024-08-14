import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: { authToken: "" },
  reducers: {
    storeToken(state, action) {
      const { token } = action.payload;
      state.authToken = token;
    },
    clearToken(state, _) {
      state.authToken = "";
    },
  },
});

export const userActions = userSlice.actions;

export const userReducer = userSlice.reducer;
