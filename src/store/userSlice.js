import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("access_token");

const initialState = { 
  info: storedUser ? JSON.parse(storedUser) : null, 
  token: storedToken || null 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.info = action.payload.user;
      state.token = action.payload.token;

      // 🔥 Já salva no localStorage também
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("access_token", action.payload.token);
    },
    clearUser(state) {
      state.info = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
