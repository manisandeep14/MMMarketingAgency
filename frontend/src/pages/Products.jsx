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
    const timer = setTimeout(fetchProducts, 400); // debounce search
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const params = new URLSearchParams();

      if (filters.category !== "All") params.append("category", filters.category);
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
          <h1 className="text-3xl font-extrabold text-slate-900">Our Products</h1>
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
              
              {/* SEARCH */}
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="input-field"
              />

              {/* CATEGORY */}
              <select
                className="input-field"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* TAG FILTER */}
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

              {/* PRICE */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  className="input-field"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  className="input-field"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* PRODUCTS GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No products found
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const img = normalizeImages(product.images)[0]?.url;

                  return (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="bg-gradient-to-br from-sky-50 to-white rounded-2xl border border-sky-200 shadow-md 
                      hover:shadow-xl transition transform 
                      hover:-translate-y-1 sm:hover:-translate-y-2 
                      p-3 sm:p-4">
                      <div className="relative aspect-square mb-3 rounded-xl overflow-hidden">
                        {img ? (
                          <img src={img} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        {product.showNew && (
                          <span className="badge badge-new">NEW</span>
                        )}
                        {product.tag === "popular" && (
                          <span className="badge badge-popular">POPULAR</span>
                        )}
                        {product.tag === "special" && (
                          <span className="badge badge-special">SPECIAL</span>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex justify-between mt-2">
                        <span className="text-sky-600 font-bold">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.stock > 0 ? "In stock" : "Out of stock"}
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
