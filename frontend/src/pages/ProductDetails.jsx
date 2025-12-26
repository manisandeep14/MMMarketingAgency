// frontend/src/pages/ProductDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { setProduct, setLoading } from "../redux/slices/productSlice";
import { setCart } from "../redux/slices/cartSlice";
import { setWishlist } from "../redux/slices/wishlistSlice";
import api from "../utils/api";

// ✅ Normalize backend image formats
const normalizeImages = (images) => {
  if (!images || !Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((img) => {
      if (typeof img === "string") {
        return { public_id: null, url: img };
      }
      return {
        public_id: img.public_id || img.publicId || null,
        url: img.url || img.secure_url || null,
      };
    })
    .filter((i) => i.url);
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { product, loading } = useSelector((state) => state.products);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(`/products/${id}`);
      dispatch(setProduct(response.data.product));
      setSelectedImage(0);
      setQuantity(1);
    } catch (error) {
      toast.error("Product not found");
      navigate("/products");
    }
  };

  const imgs = normalizeImages(product?.images || []);
  const mainImage = imgs[selectedImage]?.url || imgs[0]?.url;

  const isInWishlist = wishlist?.products?.some(
    (p) => p._id === product?._id
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/cart", {
        productId: product._id,
        quantity,
      });
      dispatch(setCart(response.data.cart));
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      await api.post("/cart", {
        productId: product._id,
        quantity,
      });
      navigate("/checkout");
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist) {
        const response = await api.delete(`/wishlist/${product._id}`);
        dispatch(setWishlist(response.data.wishlist));
        toast.success("Removed from wishlist");
      } else {
        const response = await api.post("/wishlist", {
          productId: product._id,
        });
        dispatch(setWishlist(response.data.wishlist));
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4 text-sm sm:text-base text-gray-600">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-white to-sky-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">

        {/* Back button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm sm:text-base rounded-lg bg-white border border-sky-100 shadow-sm hover:shadow-md"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">

          {/* LEFT SECTION */}
          <div>
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-md border border-sky-100">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {imgs.length > 1 && (
                <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto">
                  {imgs.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border transition ${
                        selectedImage === idx
                          ? "ring-2 ring-sky-300 border-sky-300"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-md border border-sky-100">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 text-slate-900">
              {product.name}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-sky-600">
                ₹{product.price.toLocaleString()}
              </div>
              <div className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs sm:text-sm w-fit">
                {product.category}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Description
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-3 text-sm sm:text-base text-slate-700 mb-4 sm:mb-6">
              {product.material && (
                <p><strong>Material:</strong> {product.material}</p>
              )}
              {product.color && (
                <p><strong>Color:</strong> {product.color}</p>
              )}
              {product.dimensions && (
                <p>
                  <strong>Dimensions:</strong>{" "}
                  {product.dimensions.length} × {product.dimensions.width} ×{" "}
                  {product.dimensions.height} {product.dimensions.unit}
                </p>
              )}
              <p>
                <strong>Stock:</strong>{" "}
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    {product.stock} available
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>

            {product.stock > 0 && (
              <>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-50 border border-slate-200 text-lg font-semibold"
                  >
                    -
                  </button>
                  <div className="text-lg sm:text-xl font-semibold w-10 sm:w-12 text-center">
                    {quantity}
                  </div>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-50 border border-slate-200 text-lg font-semibold"
                  >
                    +
                  </button>
                </div>
              </>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold"
              >
                <FaShoppingCart />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold"
              >
                Buy Now
              </button>

              <button
                onClick={handleWishlistToggle}
                className="w-full sm:w-14 h-12 rounded-lg bg-white border border-sky-100 flex items-center justify-center shadow-sm"
              >
                {isInWishlist ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-slate-600" />
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-4">
              By ordering you agree to our terms and shipping time. Need help?{" "}
              <button
                onClick={() => navigate("/contact")}
                className="text-sky-600 underline"
              >
                Contact us
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
