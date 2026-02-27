import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getStoredAccessToken } from "@src/utils/authStorage";

type AuthState = {
  token: string | null;
  email: string | null;
};

const initialState: AuthState = {
  token: getStoredAccessToken(),
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string | null; email: string | null }>,
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.email = null;
    },
  },
});

export const { setAuth, setToken, setEmail, clearAuth } = authSlice.actions;
export default authSlice.reducer;
