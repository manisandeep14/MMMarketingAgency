import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { setCart, setLoading } from '../redux/slices/cartSlice';
import api from '../utils/api';

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
      const response = await api.get('/cart');
      dispatch(setCart(response.data.cart));
    } catch (error) {
      toast.error('Failed to load cart');
      dispatch(setLoading(false));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.put('/cart', { productId, quantity });
      dispatch(setCart(response.data.cart));
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      dispatch(setCart(response.data.cart));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cart.items?.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {!cart.items || cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.items
              .filter((item) => item.product) // ⬅️ IMPORTANT
              .map((item) => (
              <div key={item.product._id || item._id} className="card flex gap-4 p-4 mb-4">
                <Link to={`/products/${item.product._id}`} className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                  <Link to={`/products/${item.product._id}`} className="font-semibold text-lg hover:text-primary-600">
                    {item.product.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">{item.product.category}</p>
                  <p className="text-primary-600 font-bold mt-2">₹{item.product.price.toLocaleString()}</p>
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
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary"
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="block text-center mt-4 text-primary-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
