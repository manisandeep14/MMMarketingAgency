import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { setWishlist, setLoading } from "../redux/slices/wishlistSlice";
import { setCart } from "../redux/slices/cartSlice";
import api from "../utils/api";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.get("/wishlist");
      dispatch(setWishlist(response.data.wishlist));
    } catch (error) {
      toast.error("Failed to load wishlist");
      dispatch(setLoading(false));
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      dispatch(setWishlist(response.data.wishlist));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      dispatch(setCart(response.data.cart));
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-4 border-t-sky-500 border-slate-200"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
            Loading wishlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-slate-900">
          My Wishlist
        </h1>

        {!wishlist.products || wishlist.products.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-sm">
            <p className="text-base sm:text-xl text-slate-600 mb-5 sm:mb-6">
              Your wishlist is empty
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
            {wishlist.products.map((product) => (
              <div
                key={product._id}
                className="bg-gradient-to-br from-sky-50 to-white backdrop-blur-sm rounded-2xl border border-sky-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition transform"
              >
                <Link
                  to={`/products/${product._id}`}
                  className="block aspect-square rounded-t-2xl overflow-hidden bg-gray-200 border-b border-sky-100"
                >
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </Link>

                <div className="p-3 sm:p-4">
                  <Link
                    to={`/products/${product._id}`}
                    className="font-semibold text-base sm:text-lg mb-1 block line-clamp-1 hover:text-sky-600 transition"
                  >
                    {product.name}
                  </Link>

                  <p className="text-slate-600 text-xs sm:text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sky-600 font-bold text-lg sm:text-xl">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition
                        ${
                          product.stock === 0
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-sky-500 text-white hover:bg-sky-600 shadow-sm"
                        }`}
                    >
                      <FaShoppingCart />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="px-3 py-2 rounded-full border border-sky-200 text-slate-600 hover:bg-sky-50 transition flex items-center justify-center"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
