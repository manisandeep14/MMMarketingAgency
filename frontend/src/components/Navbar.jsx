// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart || {});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-sky-300 to-indigo-500 flex items-center justify-center text-white font-bold">
              MM
            </div>
            <div className="text-lg font-semibold text-slate-800">MM Furniture</div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-slate-700">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <Link to="/products" className="hover:text-sky-600">Products</Link>
          <Link to="/about" className="hover:text-sky-600">About</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-slate-700 hover:text-sky-600">
            <FaShoppingCart />
            {cart?.items?.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Link>

          <Link to="/wishlist" className="text-slate-700 hover:text-sky-600">
            <FaHeart />
          </Link>

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-slate-700">
                <FaUser />
                <span className="hidden md:inline">{user?.name?.split(' ')[0]}</span>
              </button>

              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-md py-1 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Admin</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Logout</button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-slate-700 hover:text-sky-600">Login</Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
