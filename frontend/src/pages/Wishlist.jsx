import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { setWishlist, setLoading } from '../redux/slices/wishlistSlice';
import { setCart } from '../redux/slices/cartSlice';
import api from '../utils/api';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.get('/wishlist');
      dispatch(setWishlist(response.data.wishlist));
    } catch (error) {
      toast.error('Failed to load wishlist');
      dispatch(setLoading(false));
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      dispatch(setWishlist(response.data.wishlist));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await api.post('/cart', {
        productId: product._id,
        quantity: 1,
      });
      dispatch(setCart(response.data.cart));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {!wishlist.products || wishlist.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.products.map((product) => (
            <div key={product._id} className="card">
              <Link to={`/products/${product._id}`} className="aspect-square bg-gray-200 overflow-hidden block">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </Link>
              <div className="p-4">
                <Link to={`/products/${product._id}`} className="font-semibold text-lg mb-2 line-clamp-1 block hover:text-primary-600">
                  {product.name}
                </Link>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary-600 font-bold text-xl">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                  >
                    <FaShoppingCart />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="btn-secondary px-3"
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
  );
};

export default Wishlist;
