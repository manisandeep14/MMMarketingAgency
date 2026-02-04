import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------- EMAIL REGISTER (UNCHANGED) ---------------- */
  const handleEmailRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("https://mmmarketingagency.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  /* ---------------- GOOGLE REGISTER (REAL) ---------------- */
  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const res = await api.post("https://mmmarketingagency.onrender.com/api/auth/google", {
        tokenId: credentialResponse.credential,
      });

      if (res.data.success) {
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-sky-100 p-6 sm:p-8">

          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Create Account
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Join <span className="font-semibold text-sky-600">MM Furniture</span>
            </p>
          </div>

          {/* GOOGLE REGISTER */}
          <div className="mb-5 w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleRegister}
              onError={() => toast.error("Google Signup Failed")}
            />
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* EMAIL FORM */}
          <form onSubmit={handleEmailRegister} className="space-y-5">
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
            />

            <button className="w-full py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition">
              Create Account
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs sm:text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-sky-600 hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
