import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 py-16 px-4">

      {/* PAGE TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Contact Us
        </h1>

        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          We’re always happy to help. Visit our store or reach us anytime.
        </p>
      </motion.div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* ================= LEFT SIDE ================= */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-sky-100 rounded-2xl shadow-xl p-8 space-y-6"
        >

          {/* ADDRESS */}
          <div>
            <h3 className="text-lg font-semibold text-sky-700 mb-1">
              📍 Address
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed">
              Walker's Rd, opp. AVK Car Parking <br/>
              Virat Nagar, Parameshwari Nagar <br/>
              Nellore, Andhra Pradesh 524001
            </p>
          </div>

          {/* PHONE */}
          <div>
            <h3 className="text-lg font-semibold text-sky-700 mb-1">
              📞 Phone
            </h3>

            <p className="text-slate-600 text-sm">
              +91 9494799534
            </p>

            <p className="text-slate-600 text-sm">
              +91 7981231001
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <h3 className="text-lg font-semibold text-sky-700 mb-1">
              📧 Email
            </h3>

            <p className="text-slate-600 text-sm">
              mmfurniturezone@gmail.com
            </p>
          </div>

          {/* TIMINGS */}
          <div>
            <h3 className="text-lg font-semibold text-sky-700 mb-1">
              🕒 Shop Timings
            </h3>

            <p className="text-slate-600 text-sm">
              Always open to customers’ needs
            </p>
          </div>

        </motion.div>

        {/* ================= MAP ================= */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-xl border border-sky-100"
        >

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.94041872492306!2d79.97153528883862!3d14.454611147408103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4c8cd092445f1d%3A0x11121291210f3976!2sM.M.%20MARKETING%20AGENCIES!5e0!3m2!1sen!2sin!4v1772966238034!5m2!1sen!2sin"
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

        </motion.div>

      </div>

    </div>
  );
};

export default Contact;