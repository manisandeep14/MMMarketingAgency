import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";

const images = [
  "/categories/workshop1.png",
  "/categories/workshop2.png",
  "/categories/workshop3.png",
  "/categories/workshop4.png",
];

const Workshop = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
  });

  // 🔁 Hero Auto Slider
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
      <div className="relative h-[90vh] overflow-hidden">

        {/* Image Slider Container */}
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Workshop"
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-sky-900/40 backdrop-blur-sm"></div>

        {/* Text */}
        <div className="absolute inset-0 flex items-center justify-center text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white px-6"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-wide">
              WORKSHOP
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
              Our Designs. Your Vision. Custom Crafted Furniture.
            </p>
          </motion.div>
        </div>

      </div>
      
      {/* ================= IMAGE + FORM SECTION ================= */}
      <div className="max-w-6xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-14 items-center">

         {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >

          {/* Paragraph */}
          <p className="text-slate-600 text-base leading-relaxed">
            Tell us your vision. Dimensions, materials, colors, inspirations —
            our design team will collaborate with you and craft something truly unique.
          </p>

          {/* Glow Image Wrapper */}
          <div className="relative group">
            <div className="absolute -inset-2 rounded-3xl bg-sky-400 opacity-30 blur-2xl group-hover:opacity-60 transition duration-500"></div>

            <img
              src="/categories/workshop.png"
              alt="Workshop"
              className="relative rounded-3xl shadow-2xl transform group-hover:scale-105 transition duration-500"
            />
          </div>

        </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow-2xl rounded-3xl p-10 border border-sky-100"
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
                className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none transition"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none transition"
              />

              <input
                type="text"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none transition"
              />

              <textarea
                name="requirement"
                placeholder="Describe your custom requirement..."
                rows="5"
                value={formData.requirement}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none transition"
              ></textarea>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition shadow-md hover:shadow-lg"
              >
                Submit Request
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Workshop;