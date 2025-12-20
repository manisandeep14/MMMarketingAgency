import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { setCart, setLoading } from "../redux/slices/cartSlice";
import api from "../utils/api";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.get("/cart");
      dispatch(setCart(response.data.cart));
    } catch (error) {
      toast.error("Failed to load cart");
      dispatch(setLoading(false));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.put("/cart", { productId, quantity });
      dispatch(setCart(response.data.cart));
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      dispatch(setCart(response.data.cart));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return (
      cart.items?.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0) || 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-sky-500 border-slate-200 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-900">
          Shopping Cart
        </h1>

        {!cart.items || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur rounded-2xl shadow border border-sky-100">
            <p className="text-xl text-slate-600 mb-6">
              Your cart is empty
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CART ITEMS */}
            <div className="lg:col-span-2">
              {cart.items
                .filter((item) => item.product)
                .map((item) => (
                  <div
                    key={item.product._id || item._id}
                    className="flex gap-4 p-5 mb-4 rounded-2xl bg-white/80 backdrop-blur border border-sky-100 shadow-sm hover:shadow-md transition"
                  >
                    <Link
                      to={`/products/${item.product._id}`}
                      className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-sky-100 flex-shrink-0"
                    >
                      {item.product.images && item.product.images[0] ? (
                        <img
                          src={
                            item.product.images?.[0]?.url ||
                            item.product.images?.[0]?.secure_url ||
                            "/images/placeholder.png"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </Link>

                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="font-semibold text-lg text-slate-800 hover:text-sky-600 transition"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-slate-500 text-sm mt-1">
                        {item.product.category}
                      </p>
                      <p className="text-sky-600 font-bold mt-2 text-lg">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full border border-sky-200 hover:bg-sky-50"
                        >
                          -
                        </button>

                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full border border-sky-200 hover:bg-sky-50"
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-sky-100">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">
                      FREE
                    </span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-sky-600">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block text-center mt-4 text-sky-600 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
