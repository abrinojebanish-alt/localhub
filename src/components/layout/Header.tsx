import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, LogIn } from 'lucide-react';
import { userService } from '../../services/userService';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = userService.getCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    userService.logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">LocalHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`text-sm font-medium transition-colors ${
                isActive('/explore') ? 'text-primary-600' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Explore
            </Link>
            <a href="#categories" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Categories
            </a>
            <Link
              to="/for-business"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              For Businesses
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <>
                <button className="relative p-2 text-gray-700 hover:text-gray-900" aria-label="Notifications">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User size={20} className="text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">{currentUser.name.split(' ')[0]}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                      <Link
                        to={currentUser.role === 'customer' ? '/dashboard/customer' : '/dashboard/provider'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/explore" className="block text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
              Explore
            </Link>
            <Link to="/for-business" className="block text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
              For Businesses
            </Link>
            <hr className="my-4" />
            {currentUser ? (
              <>
                <Link
                  to={currentUser.role === 'customer' ? '/dashboard/customer' : '/dashboard/provider'}
                  className="block text-sm font-medium text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block btn-outline text-sm text-center" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block btn-primary text-sm text-center" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
