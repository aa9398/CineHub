import React, { useState } from 'react';
import { Film, User, LogOut, Menu, X, Search, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'Movies & Series', icon: Film },
    ...(user ? [
      { id: 'watchlist', label: 'My List', icon: User },
      { id: 'dashboard', label: 'Dashboard', icon: User }
    ] : [])
  ];

  return (
    <header className="glass-dark sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-netflix to-red-600 p-2 rounded-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">CineHub</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'nav-active text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            {user && (
              <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-netflix rounded-full"></span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="user-avatar w-8 h-8 rounded-full text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => onPageChange('login')}
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onPageChange('signup')}
                  className="btn-primary px-4 py-2 text-white rounded-lg font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-netflix text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              
              {!user && (
                <>
                  <button
                    onClick={() => {
                      onPageChange('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onPageChange('signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-primary px-4 py-3 text-white rounded-lg text-left"
                  >
                    Sign Up
                  </button>
                </>
              )}
              
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;