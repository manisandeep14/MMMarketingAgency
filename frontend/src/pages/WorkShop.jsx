import { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const Workshop = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 🔹 You can connect this to backend later
      await api.post("/workshop-request", formData);

      toast.success("✨ Request sent successfully! Our workshop team will contact you soon.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        requirement: "",
      });
    } catch (error) {
      toast.error("Failed to send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50">

      {/* HERO SECTION */}
      <div className="text-center py-20 px-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 tracking-wide">
          WORKSHOP
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
          Movement defines our latest designs, breathing life and energy into
          materials crafted uniquely for you.
        </p>
      </div>

      {/* FEATURE SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT IMAGE */}
        <div>
          <img
            src="/categories/workshop.png"
            alt="Workshop"
            className="rounded-2xl shadow-lg object-cover w-full h-[400px]"
          />
        </div>

        {/* RIGHT TEXT */}
        <div>
          <h2 className="text-3xl font-bold text-sky-700 mb-4">
            Crafted With Precision
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Our workshop blends traditional craftsmanship with modern design.
            From wood to metal, every custom piece is thoughtfully shaped to
            reflect your personality and functional needs.
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Whether it’s a bespoke chair, a custom table, or a complete
            interior solution — we bring your ideas to life.
          </p>
        </div>
      </div>

      {/* CUSTOM BUILD SECTION */}
      <div className="bg-white py-20 px-6 border-t border-sky-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Build Your Own Furniture
            </h2>
            <p className="text-slate-600 mb-4">
              Tell us your vision. Dimensions, materials, colors, inspirations —
              our design team will collaborate with you.
            </p>
            <p className="text-slate-600">
              Supplier will contact you within 24 hours to discuss your custom
              requirements.
            </p>
          </div>

          {/* FORM */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <textarea
                name="requirement"
                rows="4"
                placeholder="Describe your custom furniture requirement..."
                value={formData.requirement}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold transition"
              >
                {submitting ? "Sending..." : "Submit Request"}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* FOOTER MESSAGE */}
      <div className="text-center py-16">
        <p className="text-slate-500 text-sm">
          Designed & Crafted by MM Furniture Workshop
        </p>
      </div>
    </div>
  );
};

export default Workshop;