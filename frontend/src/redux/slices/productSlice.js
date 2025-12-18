import { createSlice } from '@reduxjs/toolkit';

// Normalize image objects (supports: url, secure_url, raw string)
const normalizeImages = (images) => {
  if (!images || !Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((img) => {
      if (typeof img === "string")
        return { public_id: null, url: img };

      return {
        public_id: img.public_id || img.publicId || null,
        url: img.url || img.secure_url || null,
      };
    })
    .filter((i) => i.url); // ensure url exists
};

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // MULTIPLE PRODUCTS (list page)
    setProducts: (state, action) => {
      state.products = action.payload.map((p) => ({
        ...p,
        images: normalizeImages(p.images),
      }));
      state.loading = false;
    },

    // SINGLE PRODUCT (details page)
    setProduct: (state, action) => {
      state.product = {
        ...action.payload,
        images: normalizeImages(action.payload.images),
      };
      state.loading = false;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setProducts, setProduct, setError } = productSlice.actions;
export default productSlice.reducer;
