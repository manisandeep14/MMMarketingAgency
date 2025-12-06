// frontend/src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  isAuthenticated: !!token,
  user,
  token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Called after successful login / register
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Generic "user updated" reducer
    // Use this after profile update, address add/edit/delete, etc.
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

export const { setLoading, loginSuccess, logout, setError, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
