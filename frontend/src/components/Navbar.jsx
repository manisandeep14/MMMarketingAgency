// frontend/src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
  };

  const toggleMenu = () => {
    setMenuOpen((s) => !s);
  };

  // close when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    const onEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            MM Furniture
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
                  <FaShoppingCart size={20} />
                  {cart?.items?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </Link>
                <Link to="/wishlist" className="text-gray-700 hover:text-primary-600">
                  <FaHeart size={20} />
                </Link>

                {/* PROFILE BUTTON (click to open menu) */}
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={toggleMenu}
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 outline-none focus:outline-none"
                  >

                    <FaUser size={20} />
                    <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                  </button>

                  {/* Menu - rendered on click */}
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      role="menu"
                      aria-label="Profile menu"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5"
                    >
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Admin
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
