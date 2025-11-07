import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlist: { products: [] },
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setWishlist, setError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
