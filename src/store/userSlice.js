// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { info: null, token: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.info = action.payload.user;
      state.token = action.payload.token;
    },
    clearUser(state) {
      state.info = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
