import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginSuccess, setLoading } from "../redux/slices/authSlice";
import api from "../utils/api";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!phone || !otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      dispatch(setLoading(true));

      const response = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      if (response.data.success) {
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );

        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-sky-100 p-6 sm:p-8">

          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verify OTP
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Enter the OTP sent to{" "}
              <span className="font-semibold text-sky-600">
                {phone}
              </span>
            </p>
          </div>

          {/* OTP FORM */}
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                One Time Password
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md"
            >
              Verify & Login
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-xs sm:text-sm text-slate-600">
            <p>
              Didn’t receive OTP?{" "}
              <Link
                to="/login"
                className="font-semibold text-sky-600 hover:underline"
              >
                Try again
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
