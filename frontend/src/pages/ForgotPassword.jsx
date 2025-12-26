import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.success) {
        setIsSubmitted(true);
        toast.success("Password reset email sent!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-sky-100 p-6 sm:p-8">
          {!isSubmitted ? (
            <>
              {/* HEADER */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Forgot Password
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">
                  Enter your email and <br />we’ll send you a reset link
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white text-sm sm:text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md text-sm sm:text-base"
                >
                  Send Reset Link
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
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl sm:text-4xl mb-5 sm:mb-6">
                ✓
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Check Your Email
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8">
                We’ve sent a password reset link to{" "}
                <strong>{email}</strong>.
                <br />
                Please check your inbox.
              </p>

              <Link
                to="/login"
                className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md text-sm sm:text-base"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
