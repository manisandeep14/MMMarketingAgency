import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 py-16 px-4">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center mb-14"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          About Us
        </h1>

        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          Learn more about our journey, our mission, and why thousands of
          customers trust our furniture.
        </p>
      </motion.div>

      {/* ================= COMPANY STORY ================= */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center mb-16"
      >

        {/* TEXT */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-sky-700">
            MM Marketing Agencies
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            MM Marketing Agencies was founded in 2012 by
            <span className="font-medium"> Shaik Shahul Hameed</span>.
            Located in Nellore, Andhra Pradesh, our company has grown into a
            trusted furniture destination for thousands of happy customers.
          </p>

          <p className="text-slate-600 text-sm leading-relaxed">
            With over <b>14 years of experience</b>, we specialize in delivering
            furniture that combines comfort, durability, and modern design.
            Our goal is to help customers create beautiful living and working
            spaces with high-quality furniture.
          </p>

          <p className="text-slate-600 text-sm leading-relaxed">
            Today we proudly serve <b>1K+ customers</b> and continue expanding
            with innovative designs and custom furniture solutions.
          </p>
        </div>

        {/* IMAGE */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          src="/categories/workshop.png"
          alt="About"
          className="rounded-2xl shadow-xl border border-sky-100"
        />

      </motion.div>

      {/* ================= WHAT WE OFFER ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-bold text-center mb-10">
          What We Offer
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            "Sofas",
            "Beds",
            "Dining Tables",
            "Office Furniture",
            "Custom Furniture",
            "Latest Market Designs",
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-sky-100 rounded-xl p-6 shadow hover:shadow-2xl transition text-center"
            >
              <p className="font-semibold text-slate-700">{item}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-slate-600 mt-6 text-sm">
          Customers can also design and build their own furniture through our
          custom workshop services.
        </p>
      </motion.section>

      {/* ================= MISSION ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center mb-16"
      >
        <h2 className="text-2xl font-bold mb-4">
          Our Mission
        </h2>

        <p className="text-slate-600 leading-relaxed">
          Our mission is to create comfortable and stylish furniture that
          transforms living spaces while maintaining durability, affordability,
          and modern design. We aim to deliver furniture that not only looks
          beautiful but also improves everyday living.
        </p>
      </motion.section>

      {/* ================= WHY CHOOSE US ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-bold text-center mb-10">
          Why Choose Us
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "14+ Years Experience",
            "Quality Craftsmanship",
            "Custom Furniture Options",
            "Trusted by 1K+ Customers",
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-tr from-sky-50 to-sky-100 p-6 rounded-xl shadow hover:shadow-2xl transition text-center"
            >
              <p className="font-semibold text-slate-700">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= STATS ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        {[
          { label: "Years Experience", value: "14" },
          { label: "Customers", value: "1K+" },
          { label: "Branches", value: "1" },
          { label: "Furniture Types", value: "100+" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-sky-100 p-6 rounded-xl shadow hover:shadow-2xl transition"
          >
            <div className="text-3xl font-bold text-sky-600">
              {stat.value}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.section>

    </div>
  );
};

export default About;