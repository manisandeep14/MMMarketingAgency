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
    // if (!isAuthenticated) return navigate("/login");
    navigate("/products");
  };

  const categories = [
    { id: "Sofa", title: "Sofa", img: "/categories/sofa.jpg" },
    { id: "Bed", title: "Bed", img: "/categories/bed.png" },
    { id: "Chair", title: "Chair", img: "/categories/chair.jpg" },
    { id: "Table", title: "Table", img: "/categories/table.webp" },
  ];

  return (
    <div className="w-full  bg-gradient-to-b from-sky-50 via-blue to-sky-50">

      {/* ------------------------------------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------ */}
      <section className="relative">
        <div
          className="h-[70vh] md:h-[80vh] bg-cover bg-center"
          style={{
            backgroundImage: "url('./categories/hero.jpg')",
          }}
        >
          {/* overlay */}
           <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

          {/* text */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center px-6 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 drop-shadow-lg leading-tight">
                Make Your Room <br /> Comfortable & Elegant
              </h1>

              <p className="mt-4 text-lg md:text-xl text-slate-700 max-w-2xl mx-auto">
                Discover thoughtfully designed furniture, crafted for comfort and style.
              </p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleExplore}
                  className="px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-700 shadow-sm transition transform hover:-translate-y-1"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* white card under hero */}
        {/* <div className="relative -mt-10 md:-mt-16 px-6">
          <div className="mx-auto max-w-5xl bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-100 text-center text-slate-600 text-sm">
            Curated furniture for modern homes
          </div>
        </div> */}
      </section>




      {/* ------------------------------------------------------------ */}
      {/* SHOP BY ROOM - CAROUSEL */}
      {/* ------------------------------------------------------------ */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Shop By Room</h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          spaceBetween={28}
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
                className="bg-white rounded-xl border border-sky-100 p-6 rounded-xl shadow hover:shadow-2xl shadow hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                <div
                  className="h-48 bg-center bg-cover"
                  style={{ backgroundImage: `url(${c.img})` }}
                ></div>
                <div className="p-4 text-center">
                  <p className="font-semibold">{c.title}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>




      {/* ------------------------------------------------------------ */}
      {/* WHO WE ARE + FEATURES */}
      {/* ------------------------------------------------------------ */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-sky-50/50 border border-sky-100 rounded-2xl shadow-sm">


        {/* LEFT SIDE - TEXT */}
        <div>
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>

          <p className="text-slate-600 mb-6 leading-relaxed">
            MM Furniture blends craft and comfort — we design furniture to make rooms feel lived-in.
            Every piece is tested for durability and style. From curated sofas to multifunctional storage,
            we bring modern designs with a timeless touch.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 rounded-full bg-sky-500 text-white font-semibold shadow-lg hover:bg-sky-600"
          >
            Shop Now
          </button>
        </div>

        {/* RIGHT SIDE - FEATURES */}
        <div className="  grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Free Delivery", sub: "Across city" },
            { title: "Secure Payment", sub: "Multiple options" },
            { title: "Free Installation", sub: "When required" },
            { title: "Warranty", sub: "1 year guarantee" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm border border-sky-100 p-6 rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="w-10 h-10 bg-sky-100 rounded-md flex items-center justify-center text-sky-600 text-xl mb-3">
                ✓
              </div>
              <h4 className="font-semibold">{f.title}</h4>
              <p className="text-slate-500 text-sm">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>




      {/* ------------------------------------------------------------ */}
      {/* WHY CHOOSE US - STATS */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Why Choose Us</h2>
          <p className="text-slate-600 mb-10">
            We combine comfort, quality, and service — making it easy to choose furniture that lasts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Years Experience", value: "7" },
              { label: "Branches", value: "2" },
              { label: "Furniture Sold", value: "10k+" },
              { label: "Variants", value: "260+" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gradient-to-tr from-sky-50 to-sky-100 p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-3 transform transition"
              >
                <div className="text-3xl font-bold text-sky-600">{s.value}</div>
                <div className="text-sm text-slate-600 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
