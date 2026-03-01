import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";

const images = [
  "/categories/workshop.png",
  "/categories/bed.png",
  "/categories/chair.jpg",
  "/categories/table.webp",
];

const Workshop = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
  });

  // 🔁 Auto Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/workshop-request", formData);
      toast.success("✨ Request sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        requirement: "",
      });
    } catch (err) {
      toast.error("Failed to send request. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-sky-50">

      {/* ================= HERO SECTION ================= */}
      <div
        className="relative h-[90vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${images[current]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-sky-900/40 backdrop-blur-sm"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white px-6"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-wide">
            WORKSHOP
          </h1>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
            Our Designs. Your Vision. Custom Crafted Furniture.
          </p>
        </motion.div>
      </div>

      {/* ================= SHOWCASE SLIDER ================= */}
      <div className="max-w-6xl mx-auto px-6 py-20">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-sky-700 text-center mb-12"
        >
          Our Works
        </motion.h2>

        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <motion.img
            key={current}
            src={images[current]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-[450px] object-cover"
            alt="Workshop"
          />
        </div>
      </div>

      {/* ================= CONTACT FORM ================= */}
      <div className="max-w-6xl mx-auto px-6 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-3xl p-10 border border-sky-100"
        >
          <h2 className="text-2xl font-bold text-sky-700 mb-6">
            Build Your Own Furniture
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none"
            />

            <textarea
              name="requirement"
              placeholder="Describe your custom requirement..."
              rows="5"
              value={formData.requirement}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition shadow-md"
            >
              Submit Request
            </button>

          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Workshop;