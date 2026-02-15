import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setProducts, setLoading } from "../redux/slices/productSlice";
import api from "../utils/api";

/* ---------------- IMAGE NORMALIZER ---------------- */
const normalizeImages = (images) => {
  if (!images || !Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((img) => {
      if (typeof img === "string") return { url: img };
      return { url: img.url || img.secure_url };
    })
    .filter((i) => i.url);
};

const categories = [
  "All",
  "Sofa",
  "Bed",
  "Chair",
  "Table",
  "Cabinet",
  "Wardrobe",
  "Decor",
  "Other",
];

const tagOptions = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Popular", value: "popular" },
  { label: "Special", value: "special" },
];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);

  /* ---------------- FILTER STATE ---------------- */
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    search: searchParams.get("search") || "",
    tag: searchParams.get("tag") || "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const params = new URLSearchParams();

      if (filters.category !== "All")
        params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.tag) params.append("tag", filters.tag);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.sort) params.append("sort", filters.sort);

      const res = await api.get(`/products?${params.toString()}`);
      dispatch(setProducts(res.data.products || []));
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* ---------------- FILTER HANDLER ---------------- */
  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    const params = {};
    if (updated.category !== "All") params.category = updated.category;
    if (updated.search) params.search = updated.search;
    if (updated.tag) params.tag = updated.tag;

    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Our Products
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-full border border-sky-200 text-sky-600 font-semibold"
          >
            {showFilters ? "✕ Close Filters" : "☰ Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="lg:w-64 bg-white border border-sky-200 rounded-xl p-4 space-y-4">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="input-field"
              />

              <select
                className="input-field"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className="input-field"
                value={filters.tag}
                onChange={(e) => updateFilter("tag", e.target.value)}
              >
                {tagOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  className="input-field"
                  value={filters.minPrice}
                  onChange={(e) =>
                    updateFilter("minPrice", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  className="input-field"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    updateFilter("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* PRODUCTS GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No products found
              </div>
            ) : (
              <div
                className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                xl:grid-cols-5 
                gap-5
              "
              >
                {products.map((product) => {
                  const img =
                    normalizeImages(product.images)[0]?.url;

                  return (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="
                        bg-white 
                        rounded-xl 
                        border border-sky-100 
                        shadow-sm 
                        hover:shadow-lg 
                        transition-all duration-300 
                        hover:-translate-y-1 
                        p-3
                      "
                    >
                      {/* IMAGE */}
                      <div className="relative aspect-[4/3] mb-3 rounded-lg overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}

                        {product.showNew && (
                          <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                        {product.tag === "popular" && (
                          <span className="absolute top-2 right-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                            POPULAR
                          </span>
                        )}
                        {product.tag === "special" && (
                          <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                            SPECIAL
                          </span>
                        )}
                      </div>

                      {/* CONTENT */}
                      <h3 className="font-semibold text-base line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-gray-500 text-xs line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex justify-between mt-2 items-center">
                        <span className="text-sky-600 font-bold text-sm">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.stock > 0
                            ? "In stock"
                            : "Out of stock"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
