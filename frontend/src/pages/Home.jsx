// frontend/src/pages/Home.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Swiper
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/autoplay";

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!isAuthenticated) return navigate("/login");
    navigate("/products");
  };

  const handleExplore = () => {
    navigate("/products");
  };

  const categories = [
    { id: "Sofa", title: "Sofa", img: "/categories/sofa.jpg" },
    { id: "Bed", title: "Bed", img: "/categories/bed.png" },
    { id: "Chair", title: "Chair", img: "/categories/chair.jpg" },
    { id: "Table", title: "Table", img: "/categories/table.webp" },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-sky-50 via-white to-sky-50">

      {/* ================================================= */}
      {/* HERO SECTION (SINGLE PREMIUM IMAGE) */}
      {/* ================================================= */}
      <section className="relative h-[80vh] overflow-hidden">

        {/* Background Image */}
        <img
          src="/categories/hero.jpg"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

        {/* Animated Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="px-6"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
              Make Your Room <br /> Comfortable & Elegant
            </h1>

            <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
              Discover thoughtfully designed furniture, crafted for comfort and style.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleBuyNow}
                className="px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition transform hover:scale-105"
              >
                Buy Now
              </button>

              <button
                onClick={handleExplore}
                className="px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-700 shadow-sm transition transform hover:scale-105"
              >
                Explore
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================= */}
      {/* SHOP BY ROOM */}
      {/* ================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop By Room
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {categories.map((c, i) => (
            <SwiperSlide key={i}>
              <div
                onClick={() => navigate(`/products?category=${c.id}`)}
                className="bg-white rounded-xl border border-sky-100 shadow hover:shadow-2xl transition transform hover:-translate-y-3 cursor-pointer overflow-hidden"
              >
                <div
                  className="h-48 bg-center bg-cover"
                  style={{ backgroundImage: `url(${c.img})` }}
                ></div>
                <div className="p-4 text-center font-semibold">
                  {c.title}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* ================================================= */}
      {/* WHO WE ARE */}
      {/* ================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center bg-sky-50/50 border border-sky-100 rounded-2xl shadow-sm"
      >
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Who We Are
          </h2>

          <p className="text-slate-600 mb-6 leading-relaxed">
            MM Furniture blends craft and comfort — we design furniture to make rooms feel lived-in.
            Every piece is tested for durability and style. We bring modern designs with timeless elegance.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 rounded-full bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            "Free Delivery",
            "Secure Payment",
            "Free Installation",
            "Warranty",
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white border border-sky-100 p-6 rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="text-sky-600 text-xl mb-2">✓</div>
              <div className="font-semibold">{f}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ================================================= */}
      {/* WHY CHOOSE US */}
      {/* ================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-slate-50 py-12 sm:py-16"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Why Choose Us
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mb-10">
            We combine comfort, quality, and service — making it easy to choose furniture that lasts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Years Experience", value: "7" },
              { label: "Branches", value: "2" },
              { label: "Furniture Sold", value: "10k+" },
              { label: "Variants", value: "260+" },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-tr from-sky-50 to-sky-100 p-6 rounded-xl shadow hover:shadow-2xl transition"
              >
                <div className="text-3xl font-bold text-sky-600">
                  {s.value}
                </div>
                <div className="text-sm text-slate-600 mt-2">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
}