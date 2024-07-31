// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  encryptedPassword: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  encryptedPassword: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; encryptedPassword: string }>) => {
      console.log('Logging in:', action.payload.username, action.payload.encryptedPassword);
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.encryptedPassword = action.payload.encryptedPassword;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.encryptedPassword = null;
    },
  },
});

export const { login: loginRedux, logout } = authSlice.actions;

export default authSlice.reducer;
