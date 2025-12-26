// frontend/src/pages/Home.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Swiper (carousel)
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
      {/* HERO SECTION */}
      {/* ================================================= */}
      <section className="relative">
        <div
          className="h-[55vh] sm:h-[65vh] md:h-[80vh] bg-cover bg-center"
          style={{ backgroundImage: "url('./categories/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center px-4 sm:px-6 max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Make Your Room <br /> Comfortable & Elegant
              </h1>

              <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-slate-700 max-w-2xl mx-auto">
                Discover thoughtfully designed furniture, crafted for comfort and style.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleBuyNow}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm sm:text-base font-semibold shadow-lg transition"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleExplore}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white border border-slate-300 text-slate-700 text-sm sm:text-base shadow-sm transition"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* SHOP BY ROOM */}
      {/* ================================================= */}
      <section className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
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
                className="bg-white rounded-xl border border-sky-100 p-4 sm:p-6 shadow hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                <div
                  className="h-40 sm:h-48 bg-center bg-cover"
                  style={{ backgroundImage: `url(${c.img})` }}
                ></div>
                <div className="p-3 sm:p-4 text-center">
                  <p className="font-semibold text-sm sm:text-base">{c.title}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ================================================= */}
      {/* WHO WE ARE */}
      {/* ================================================= */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-sky-50/50 border border-sky-100 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Who We Are
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
            MM Furniture blends craft and comfort — we design furniture to make rooms feel lived-in.
            Every piece is tested for durability and style. From curated sofas to multifunctional storage,
            we bring modern designs with a timeless touch.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-sky-500 text-white text-sm sm:text-base font-semibold shadow hover:bg-sky-600"
          >
            Shop Now
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { title: "Free Delivery", sub: "Across city" },
            { title: "Secure Payment", sub: "Multiple options" },
            { title: "Free Installation", sub: "When required" },
            { title: "Warranty", sub: "1 year guarantee" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/80 border border-sky-100 p-4 sm:p-6 rounded-xl shadow hover:shadow-2xl transition"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-sky-100 rounded-md flex items-center justify-center text-sky-600 text-lg sm:text-xl mb-3">
                ✓
              </div>
              <h4 className="font-semibold text-sm sm:text-base">{f.title}</h4>
              <p className="text-slate-500 text-xs sm:text-sm">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* WHY CHOOSE US */}
      {/* ================================================= */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
            Why Choose Us
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mb-8 sm:mb-10">
            We combine comfort, quality, and service — making it easy to choose furniture that lasts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Years Experience", value: "7" },
              { label: "Branches", value: "2" },
              { label: "Furniture Sold", value: "10k+" },
              { label: "Variants", value: "260+" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gradient-to-tr from-sky-50 to-sky-100 p-4 sm:p-6 rounded-xl shadow hover:shadow-2xl transition"
              >
                <div className="text-2xl sm:text-3xl font-bold text-sky-600">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
