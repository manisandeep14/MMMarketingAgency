import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      toast.error("Please enter a new password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password: formData.password,
      });

      if (response.data.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-sky-100 p-6 sm:p-8">
          
          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Reset Password
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Enter your new password below
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                New Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="New password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md text-sm sm:text-base"
            >
              Reset Password
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-sky-600 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
