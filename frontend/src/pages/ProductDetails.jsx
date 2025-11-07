import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { setProduct, setLoading } from '../redux/slices/productSlice';
import { setCart } from '../redux/slices/cartSlice';
import { setWishlist } from '../redux/slices/wishlistSlice';
import api from '../utils/api';

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
  }, [id]);

  const fetchProduct = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(`/products/${id}`);
      dispatch(setProduct(response.data.product));
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    }
  };

  const isInWishlist = wishlist?.products?.some((p) => p._id === product?._id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/cart', {
        productId: product._id,
        quantity,
      });
      dispatch(setCart(response.data.cart));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        const response = await api.delete(`/wishlist/${product._id}`);
        dispatch(setWishlist(response.data.wishlist));
        toast.success('Removed from wishlist');
      } else {
        const response = await api.post('/wishlist', { productId: product._id });
        dispatch(setWishlist(response.data.wishlist));
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-200 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <img src={img.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-bold text-primary-600">₹{product.price.toLocaleString()}</span>
            <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
              {product.category}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.material && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700">Material: </span>
              <span className="text-gray-600">{product.material}</span>
            </div>
          )}

          {product.color && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700">Color: </span>
              <span className="text-gray-600">{product.color}</span>
            </div>
          )}

          {product.dimensions && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700">Dimensions: </span>
              <span className="text-gray-600">
                {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
              </span>
            </div>
          )}

          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-700">Stock: </span>
            {product.stock > 0 ? (
              <span className="text-green-600">{product.stock} available</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn-secondary px-4 py-2"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="btn-secondary px-4 py-2"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <FaShoppingCart />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlistToggle}
              className="btn-secondary px-6 flex items-center gap-2"
            >
              {isInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
