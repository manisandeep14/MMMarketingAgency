import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { loginSuccess, setLoading } from "../redux/slices/authSlice";
import api from "../utils/api";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params] = useSearchParams();

  useEffect(() => {
    window.location.href =
      `https://mmmarketingagency.onrender.com/api/auth/verify-email/${token}`;
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------- EMAIL LOGIN (UNCHANGED) ---------------- */
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      dispatch(setLoading(true));

      const response = await api.post("https://mmmarketingagency.onrender.com/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );

        toast.success("Login successful!");
        navigate(response.data.user.role === "admin" ? "/admin" : "/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      dispatch(setLoading(false));
    }
  };

  /* ---------------- GOOGLE LOGIN (REAL) ---------------- */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      dispatch(setLoading(true));

      const res = await api.post("https://mmmarketingagency.onrender.com/api/auth/google", {
        tokenId: credentialResponse.credential,
      });

      if (res.data.success) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
          })
        );

        toast.success("Logged in with Google 🚀");
        navigate(res.data.user.role === "admin" ? "/admin" : "/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
      dispatch(setLoading(false));
    }
  };

  const handleGoogleError = () => {
    toast.error("Google authentication failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-sky-100 p-6 sm:p-8">

          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Sign in to continue to{" "}
              <span className="font-semibold text-sky-600">
                MM Furniture
              </span>
            </p>
          </div>

          {/* GOOGLE LOGIN */}
          <div className="mb-5 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* EMAIL LOGIN FORM */}
          <form onSubmit={handleEmailLogin} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-200 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-200 text-sm sm:text-base"
              />
            </div>

            <div className="flex justify-end text-xs sm:text-sm">
              <Link
                to="/forgot-password"
                className="text-sky-600 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md"
            >
              Sign In
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs sm:text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-sky-600 hover:underline"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
