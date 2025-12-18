import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setProducts, setLoading } from "../redux/slices/productSlice";
import api from "../utils/api";

// safe normalization for images
const normalizeImages = (images) => {
  if (!images || !Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((img) => {
      if (typeof img === "string") return { public_id: null, url: img };
      return {
        public_id: img.public_id || img.publicId || null,
        url: img.url || img.secure_url || null,
      };
    })
    .filter((i) => i.url);
};

const categories = ["All", "Sofa", "Bed", "Chair", "Table", "Cabinet", "Wardrobe", "Decor", "Other"];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    search: searchParams.get("search") || "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const params = new URLSearchParams();

      if (filters.category !== "All") params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.sort) params.append("sort", filters.sort);

      const response = await api.get(`/products?${params.toString()}`);
      dispatch(setProducts(response.data.products));
    } catch (error) {
      toast.error("Failed to load products");
      dispatch(setLoading(false));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    if (key === "category" && value !== "All") {
      setSearchParams({ category: value });
    } else if (key === "category") {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-extrabold mb-6 text-slate-900">Our Products</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white/80 backdrop-blur p-6 rounded-2xl shadow-sm border border-sky-100">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-2">Price Range</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-2">Sort By</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => fetchProducts()}
                  className="flex-1 px-4 py-2 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    handleFilterChange("category", "All");
                    handleFilterChange("search", "");
                    handleFilterChange("minPrice", "");
                    handleFilterChange("maxPrice", "");
                    handleFilterChange("sort", "newest");
                  }}
                  className="flex-1 px-4 py-2 rounded-full border border-sky-100 text-slate-700 hover:bg-sky-50 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-t-sky-500 border-slate-200"></div>
                <p className="mt-4 text-slate-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-slate-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const imgs = normalizeImages(product.images);
                  const mainImg = imgs[0]?.url;

                  return (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="bg-gradient-to-br from-sky-50 to-white backdrop-blur-sm rounded-2xl border border-sky-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition transform p-4"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 border border-sky-100">
                        {mainImg ? (
                          <img
                            src={mainImg}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 text-sm rounded-full shadow border border-sky-200">
                          {product.category}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-sky-600 font-bold text-xl">
                            ₹{product.price.toLocaleString()}
                          </span>

                          <span className="text-sm text-gray-500">
                            {product.stock === 0 ? "Out of stock" : "In stock"}
                          </span>
                        </div>
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
