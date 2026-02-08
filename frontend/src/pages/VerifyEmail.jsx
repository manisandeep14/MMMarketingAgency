// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import api from "../utils/api";

// const VerifyEmail = () => {
//   const { token } = useParams();
//   const [status, setStatus] = useState("verifying");

//   useEffect(() => {
//     // backend already verified + redirected
//     navigate("/login?verified=true");
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-3 sm:px-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-sky-100 p-6 sm:p-8 text-center">

//           {/* VERIFYING */}
//           {status === "verifying" && (
//             <>
//               <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4">
//                 Verifying Email
//               </h2>
//               <p className="text-xs sm:text-sm text-slate-600 mb-5 sm:mb-6">
//                 Please wait while we verify your email address
//               </p>
//               <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500"></div>
//             </>
//           )}

//           {/* SUCCESS */}
//           {status === "success" && (
//             <>
//               <div className="text-green-500 text-5xl sm:text-6xl mb-4">✓</div>
//               <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-3">
//                 Email Verified!
//               </h2>
//               <p className="text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8">
//                 Your email has been successfully verified. You can now log in to your account.
//               </p>
//               <Link
//                 to="/login"
//                 className="inline-block px-6 py-2.5 sm:py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md text-sm sm:text-base"
//               >
//                 Go to Login
//               </Link>
//             </>
//           )}

//           {/* ERROR */}
//           {status === "error" && (
//             <>
//               <div className="text-red-500 text-5xl sm:text-6xl mb-4">✗</div>
//               <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-3">
//                 Verification Failed
//               </h2>
//               <p className="text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8">
//                 The verification link is invalid or has expired.
//               </p>
//               <Link
//                 to="/register"
//                 className="inline-block px-6 py-2.5 sm:py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md text-sm sm:text-base"
//               >
//                 Register Again
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;
