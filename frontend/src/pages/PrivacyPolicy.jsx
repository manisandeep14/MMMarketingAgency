import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 py-16 px-4">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>

        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Your privacy is important to us. This policy explains how we collect
          and use your information.
        </p>
      </motion.div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white border border-sky-100 rounded-2xl shadow-xl p-8 space-y-8"
      >

        {/* DATA COLLECTION */}
        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">
            Information We Collect
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            When you use our website, we may collect the following information
            to process your orders and provide services:
          </p>

          <ul className="list-disc ml-6 mt-3 text-slate-600 text-sm space-y-1">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Shipping address</li>
            <li>Payment information</li>
          </ul>
        </div>

        {/* PAYMENT */}
        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">
            Payment Methods
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            All payments on our platform are securely processed using
            Razorpay. Razorpay supports multiple payment methods including:
          </p>

          <ul className="list-disc ml-6 mt-3 text-slate-600 text-sm space-y-1">
            <li>UPI</li>
            <li>Debit Cards</li>
            <li>Credit Cards</li>
            <li>Net Banking</li>
            <li>Wallets and other supported Razorpay payment methods</li>
          </ul>
        </div>

        {/* COOKIES */}
        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">
            Cookies
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            Our website may use minimal technical cookies necessary for
            authentication and payment processing. These cookies help ensure
            secure login sessions and smooth payment transactions.
          </p>
        </div>

        {/* DATA SECURITY */}
        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">
            Data Security
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            We take appropriate measures to protect your personal information
            from unauthorized access, disclosure, or misuse.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">
            Contact Us
          </h2>

          <p className="text-slate-600 text-sm">
            If you have any questions about this Privacy Policy, please contact
            us through our{" "}
            <Link
              to="/contact"
              className="text-sky-600 font-medium hover:underline"
            >
              Contact Page
            </Link>.
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;