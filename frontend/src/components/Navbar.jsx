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
  const cartItemCount =
  cart?.items
    ?.filter((item) => item.product)   // 🔥 IMPORTANT
    ?.reduce((total, item) => total + item.quantity, 0) || 0;



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
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent"
          >
            MM Furniture
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <Link className="font-medium text-slate-700 hover:text-sky-600 transition" to="/">
              Home
            </Link>
            <Link className="font-medium text-slate-700 hover:text-sky-600 transition" to="/products">
              Products
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4 sm:gap-5">
            {isAuthenticated ? (
              <>
                {/* CART */}
                <Link to="/cart" className="relative text-slate-700 hover:text-sky-600 transition">
                  <FaShoppingCart className="text-lg sm:text-xl" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[10px] sm:text-xs font-semibold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow">
                      {cartItemCount}
                    </span>
                  )}

                </Link>

                {/* WISHLIST */}
                <Link to="/wishlist" className="text-slate-700 hover:text-pink-500 transition">
                  <FaHeart className="text-lg sm:text-xl" />
                </Link>

                {/* PROFILE */}
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={toggleMenu}
                    className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition"
                  >
                    <FaUser className="text-base sm:text-lg" />
                    <span className="hidden sm:inline font-medium">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {/* DROPDOWN */}
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 sm:mt-3 w-44 sm:w-48 rounded-xl bg-white shadow-xl border border-sky-100 py-2"
                    >
                      {/* 👉 MOBILE / TABLET NAV LINKS */}
                      <div className="block md:hidden">
                        <Link
                          to="/"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 transition"
                        >
                          Home
                        </Link>
                        <Link
                          to="/products"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 transition"
                        >
                          Products
                        </Link>
                        <div className="my-1 border-t border-sky-100" />
                      </div>

                      {/* COMMON LINKS */}
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 transition"
                      >
                        Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 transition"
                      >
                        My Orders
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 transition"
                        >
                          Admin
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm sm:text-base font-medium text-slate-700 hover:text-sky-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm sm:text-base font-semibold shadow hover:shadow-lg transition"
                >
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
