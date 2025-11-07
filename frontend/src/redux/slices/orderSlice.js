import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setOrders, setOrder, setError } = orderSlice.actions;
export default orderSlice.reducer;
