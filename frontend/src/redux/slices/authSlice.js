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

/**
 * Normalize user object
 * - Ensures name always exists
 * - Works for email & phone users
 */
const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    name:
      user.name && user.name.trim()
        ? user.name
        : user.email
        ? user.email.split('@')[0]
        : user.phone
        ? 'User'
        : 'User',
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUser: (state, action) => {
      const normalizedUser = normalizeUser(action.payload);
      state.user = normalizedUser;
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    },

    // ✅ Called after successful login (email or phone OTP)
    loginSuccess: (state, action) => {
      const normalizedUser = normalizeUser(action.payload.user);

      state.isAuthenticated = true;
      state.user = normalizedUser;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
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

    /**
     * ✅ Used after:
     * - profile update
     * - address add / update / delete
     */
    updateUser: (state, action) => {
      const normalizedUser = normalizeUser(action.payload);
      state.user = normalizedUser;
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    },
  },
});

export const {
  setLoading,
  setUser,
  loginSuccess,
  logout,
  setError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
