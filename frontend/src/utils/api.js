import axios from "axios";

const API_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Only auto logout if user was already logged in
    const token = localStorage.getItem("token");

    if (status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: use window.location only for protected route failures
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
