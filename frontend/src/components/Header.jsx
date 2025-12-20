import React from 'react';
import { ShoppingCart, Search, User, Menu, Heart, X, LogOut } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../authResource/useAuth';
import { supabase } from '../authResource/supabaseClient';

// Utility for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- Mock UI Components (Self-Contained) ---

/**
 * Custom Button component using native HTML button.
 */
const Button = ({ children, className = '', variant, size, onClick, ...props }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA15E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  if (size === 'icon') {
    baseClasses += ' w-9 h-9 p-0';
  } else {
    baseClasses += ' h-10 px-4 py-2';
  }

  if (variant === 'ghost') {
    // Note: These base ghost classes are overridden by the active/inactive logic below
    baseClasses += ' text-[#99582A] hover:text-[#99582A] hover:bg-[#FFE6A7]';
  } else {
    baseClasses += ' bg-[#99582A] hover:bg-[#99582A]/90 text-white';
  }

  return (
    <button
      className={cn(baseClasses, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ placeholder, className = '', value, onChange, onKeyDown }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={cn(
      'px-4 py-2 border border-gray-300 rounded-md focus:outline-none',
      className
    )}
  />
);

const Badge = ({ children, className = '' }) => (
  <span className={cn(
    'inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#99582A] rounded-full',
    className
  )}>
    {children}
  </span>
);

// --- Header Component ---

/**
 * @typedef {object} HeaderProps
 * @property {number=} cartItemCount
 * @property {(page: string) => void=} onNavigate - Made optional with default value.
 * @property {string} currentPage - The identifier of the currently active page ('landing', 'products', 'cart', etc.)
 */

/**
 * Header component with responsive design and active navigation link simulation.
 * @param {HeaderProps} props
 */
export function Header({ cartItemCount = 0, wishListItemCount = 0, onNavigate = () => { }, currentPage }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  // State to manage the visibility of the mobile search bar
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleNavigation = (page) => {
    onNavigate(page);
    if (isMenuOpen) {
      setIsMenuOpen(false); // Close menu after navigation
    }
    // Also close the mobile search bar if the user navigates
    setIsSearchOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Optionally navigate to home or login
    handleNavigation('/');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false); // Close mobile search after search
    }
  };

  const navLinks = [
    { name: 'Home', page: '/' },
    { name: 'All Products', page: '/products' },
    { name: 'Value Packs', page: '/value-packs' },
    { name: 'Categories', page: '/category' },
    { name: 'Sale', page: '/sale' },
    { name: 'Track Order', page: '/track-order' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 font-sans">
      {/* Top Bar */}
      <div className="bg-[#FFE6A7] py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <p className="text-[#2C2C2C] hidden sm:block">Free Shipping in CDB and Kasarani</p>
          <div className="flex gap-4">
            <button className="text-[#2C2C2C] hover:text-[#99582A] transition-colors">
              Track Order
            </button>
            <button className="text-[#2C2C2C] hover:text-[#99582A] transition-colors">
              Help
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-2 group focus:outline-none">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#99582A] rounded flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">SH</span>
            </div>
            <span className="text-[#99582A] font-extrabold text-xl hidden sm:block">Spice Hub</span>
          </Link>

          {/* Search Bar (Desktop Only) */}
          <div className="flex-1 max-w-xl relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search spices..."
              className="pl-10 w-full bg-[#F0F0F0] border-0 focus:ring-1 focus:ring-[#99582A]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Search Button (Mobile) - Toggles the mobile search input below */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-700 hover:bg-gray-100"
            onClick={() => setIsSearchOpen(prev => !prev)}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className='space-x-4 text-sm'>
              {session ? (
                <button
                  onClick={handleLogout}
                  className='bg-[#99582A] text-white p-2 rounded-sm flex items-center gap-2'
                >
                  <LogOut className='w-4 h-4' />
                  Logout
                </button>
              ) : (
                <>
                  <NavLink to={'/login'}>
                    <button className='text-[#99582A]'>Log In</button>
                  </NavLink>
                  <NavLink to={'/signup'}>
                    <button className='bg-[#99582A] text-white p-2 rounded-sm'>Sign Up</button>
                  </NavLink>
                </>
              )}
            </div>
            <NavLink to={'/account'}
              className={({ isActive }) =>
                isActive ? 'bg-amber-900/50 rounded-lg text-white' : 'text-gray-700'
              }>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigation('account')}
                className="hidden sm:flex text-gray-700 hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
              </Button>
            </NavLink>
            <NavLink to={'/wishlist'}
              className={({ isActive }) =>
                isActive ? 'bg-amber-900/50 rounded-lg text-white' : 'text-gray-700'
              }>
              <div className='relative'>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex text-gray-700 hover:bg-gray-100"
                  onClick={() => handleNavigation('wishlist')}
                >
                  <Heart className="w-5 h-5" />
                  {wishListItemCount > 0 && (
                    <Badge className="absolute z-50 -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#99582A] border-2 border-white">
                      {wishListItemCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </NavLink>
            {/* Cart Button */}
            <NavLink to={'/cart'}
              className={({ isActive }) =>
                isActive ? 'bg-amber-900/50 rounded-lg text-white' : 'text-gray-700'
              }>
              <div className='relative'>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigation('cart')}
                  className="relative text-gray-700 hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute z-50 -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#99582A] border-2 border-white">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </NavLink>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* --- MOBILE SEARCH INPUT (NEW SECTION) --- */}
        {/* Only visible on small screens when the search icon is clicked */}
        <div
          className={cn(
            "lg:hidden w-full transition-all duration-300 overflow-hidden",
            isSearchOpen ? "max-h-20 pt-3" : "max-h-0"
          )}
        >
          <div className="relative pb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 w-full bg-[#F0F0F0] border-0 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* --- DESKTOP Navigation (Visible md and up) --- */}
        <nav className="mt-4 hidden md:flex gap-8 justify-center border-t border-gray-100 pt-3">
          {navLinks.map((link) => {
            return (
              <NavLink
                key={link.name}
                to={link.page}
                className={({ isActive }) =>
                  isActive ? 'text-[#BC6C25] font-bold border-b-2 border-[#BC6C25]' : 'text-[#2C2C2C] hover:text-[#99582A]'}
              >
                {link.name}
              </NavLink>

            );
          })}
        </nav>
      </div>

      {/* --- MOBILE Navigation Overlay (Visible below md, when open) --- */}
      <div
        className={cn(
          "md:hidden fixed relative inset-x-0  bg-white shadow-lg transition-all duration-300 overflow-hidden border-t border-gray-200",
          isMenuOpen ? "opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navLinks.map((link) => {
            return (
              <NavLink
                key={link.name}
                to={link.page}
                className={({ isActive }) =>
                  isActive ? 'text-[#BC6C25] font-bold border-b-2 border-[#BC6C25]' : 'text-[#2C2C2C] hover:text-[#99582A]'}
              >
                {link.name}
              </NavLink>
            );
          })}
          <div className="pt-4 border-t mt-4 space-y-2">
            <button
              onClick={() => handleNavigation('account')}
              className="w-full text-left py-2 px-3 flex items-center gap-2 text-[#2C2C2C] hover:bg-[#FFE6A7] rounded transition-colors"
            >
              <User className='w-5 h-5' /> My Account
            </button>
            <button
              onClick={() => handleNavigation('wishlist')}
              className="w-full text-left py-2 px-3 flex items-center gap-2 text-[#2C2C2C] hover:bg-[#FFE6A7] rounded transition-colors"
            >
              <Heart className='w-5 h-5' /> Wishlist
            </button>
            {session && (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 flex items-center gap-2 text-[#2C2C2C] hover:bg-[#FFE6A7] rounded transition-colors"
              >
                <LogOut className='w-5 h-5' /> Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;