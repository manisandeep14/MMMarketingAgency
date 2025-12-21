import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        if (response.data.success) {
          setStatus("success");
          toast.success("Email verified successfully!");
        }
      } catch (error) {
        setStatus("error");
        toast.error(error.response?.data?.message || "Verification failed");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-sky-100 p-8 text-center">

          {/* VERIFYING */}
          {status === "verifying" && (
            <>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                Verifying Email
              </h2>
              <p className="text-slate-600 mb-6">
                Please wait while we verify your email address
              </p>
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500"></div>
            </>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <>
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Email Verified!
              </h2>
              <p className="text-slate-600 mb-8">
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md"
              >
                Go to Login
              </Link>
            </>
          )}

          {/* ERROR */}
          {status === "error" && (
            <>
              <div className="text-red-500 text-6xl mb-4">✗</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Verification Failed
              </h2>
              <p className="text-slate-600 mb-8">
                The verification link is invalid or has expired.
              </p>
              <Link
                to="/register"
                className="inline-block px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md"
              >
                Register Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
