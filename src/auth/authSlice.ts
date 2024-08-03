// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Notification {
  title: string;
  body: string;
}

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  encryptedPassword: string | null;
  notifications: Notification[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  encryptedPassword: null,
  notifications: []
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
    addNotification: (state, action: PayloadAction<Notification>) => {
      console.log('Adding notification:', action.payload);
      state.notifications.push(action.payload);
    },
  },
});

export const { login: loginRedux, logout } = authSlice.actions;

export default authSlice.reducer;
