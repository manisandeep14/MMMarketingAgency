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
import Cart from "./Cart";


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
    .filter((i) => i.url); // keep only valid URLs
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

  const isInWishlist = wishlist?.products?.some((p) => p._id === product?._id);

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
      // 1️⃣ Add product to cart
      await api.post('/cart', {
        productId: product._id,
        quantity: quantity, // your selected quantity state
      });

      // 2️⃣ Redirect directly to checkout
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to proceed to checkout');
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
        const response = await api.post("/wishlist", { productId: product._id });
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
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-white to-sky-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-sky-100 shadow-sm hover:shadow-md"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* LEFT SECTION - Main Image + Thumbnails */}
          <div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-sky-100">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {imgs.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {imgs.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border transition-transform transform ${
                        selectedImage === idx
                          ? "ring-2 ring-sky-300 border-sky-300 -translate-y-1 shadow-md"
                          : "border-transparent hover:-translate-y-1 hover:shadow-sm"
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

          {/* RIGHT SECTION - Details */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-sky-100">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-slate-900">
              {product.name}
            </h1>

            <div className="flex items-start md:items-center gap-4 mb-6">
              <div className="text-4xl md:text-5xl font-bold text-sky-600">
                ₹{product.price.toLocaleString()}
              </div>
              <div className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-sm">
                {product.category}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
              <p className="text-slate-600">{product.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-slate-700 mb-6">
              {product.material && (
                <p><strong>Material:</strong> {product.material}</p>
              )}
              {product.color && (
                <p><strong>Color:</strong> {product.color}</p>
              )}
              {product.dimensions && (
                <p>
                  <strong>Dimensions:</strong>{" "}
                  {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height}{" "}
                  {product.dimensions.unit}
                </p>
              )}
              <p>
                <strong>Stock:</strong>{" "}
                {product.stock > 0 ? (
                  <span className="text-green-600">{product.stock} available</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>

            {product.stock > 0 && (
              <>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 text-lg font-semibold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <div className="text-xl font-semibold w-12 text-center">{quantity}</div>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 text-lg font-semibold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                <FaShoppingCart /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                 Buy Now
              </button>


              <button
                onClick={handleWishlistToggle}
                className="w-14 h-12 rounded-lg bg-white border border-sky-100 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                {isInWishlist ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-slate-600" />
                )}
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-4">
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
